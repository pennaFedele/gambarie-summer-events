-- Fix the update_app_setting function to use correct security_audit_log schema
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