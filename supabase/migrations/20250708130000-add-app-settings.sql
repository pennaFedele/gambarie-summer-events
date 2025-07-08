-- Create app_settings table for admin configuration
CREATE TABLE IF NOT EXISTS public.app_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(255) NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    setting_type VARCHAR(50) NOT NULL DEFAULT 'string',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on app_settings
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for app_settings
CREATE POLICY "Anyone can read app settings" ON public.app_settings
FOR SELECT USING (true);

CREATE POLICY "Only admins can modify app settings" ON public.app_settings
FOR ALL USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default app settings
INSERT INTO public.app_settings (setting_key, setting_value, setting_type, description)
VALUES 
    ('app_public_visible', 'true'::jsonb, 'boolean', 'Controls whether the app is visible to the public. When false, shows maintenance page.'),
    ('maintenance_message', '"Stiamo lavorando per Voi. App in aggiornamento"'::jsonb, 'string', 'Message shown on maintenance page when app is not public'),
    ('maintenance_admin_button_text', '"Sei admin? Accedi"'::jsonb, 'string', 'Text for admin login button on maintenance page')
ON CONFLICT (setting_key) DO NOTHING;

-- Create function to get app setting value
CREATE OR REPLACE FUNCTION public.get_app_setting(setting_key_param TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN (
        SELECT setting_value 
        FROM public.app_settings 
        WHERE setting_key = setting_key_param
    );
END;
$$;

-- Create function to update app setting (admin only)
CREATE OR REPLACE FUNCTION public.update_app_setting(
    setting_key_param TEXT,
    setting_value_param JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if user is admin
    IF NOT public.has_role(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'Access denied. Admin role required.';
    END IF;
    
    -- Update the setting
    UPDATE public.app_settings 
    SET setting_value = setting_value_param,
        updated_at = NOW()
    WHERE setting_key = setting_key_param;
    
    -- Log the change
    INSERT INTO public.security_audit_log (
        user_id,
        action,
        resource_type,
        resource_id,
        metadata
    )
    VALUES (
        auth.uid(),
        'UPDATE',
        'app_settings',
        setting_key_param,
        jsonb_build_object(
            'function_call', 'update_app_setting',
            'setting_key', setting_key_param,
            'setting_value', setting_value_param
        )
    );
END;
$$;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_app_settings_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_app_settings_updated_at
    BEFORE UPDATE ON public.app_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_app_settings_updated_at();