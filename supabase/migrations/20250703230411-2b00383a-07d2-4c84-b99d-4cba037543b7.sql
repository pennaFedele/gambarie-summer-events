-- Fix storage access control policies
-- First, drop the existing overly permissive policies
DROP POLICY IF EXISTS "Users can update event images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete event images" ON storage.objects;

-- Create more secure storage policies based on file path ownership
-- Users can only update/delete files they uploaded (based on file path containing their user ID)
CREATE POLICY "Users can update their own event images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'event-images' 
  AND auth.uid() IS NOT NULL 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own event images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'event-images' 
  AND auth.uid() IS NOT NULL 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Update the insert policy to include user ID in the path structure
DROP POLICY IF EXISTS "Authenticated users can upload event images" ON storage.objects;
CREATE POLICY "Users can upload to their own folder" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'event-images' 
  AND auth.uid() IS NOT NULL 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Create a function to safely assign the first admin role
CREATE OR REPLACE FUNCTION public.assign_first_admin(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id UUID;
  admin_count INTEGER;
BEGIN
  -- Check if any admin already exists
  SELECT COUNT(*) INTO admin_count 
  FROM public.user_roles 
  WHERE role = 'admin';
  
  -- Only allow if no admin exists yet
  IF admin_count > 0 THEN
    RAISE EXCEPTION 'Admin users already exist. Cannot assign first admin.';
  END IF;
  
  -- Find user by email
  SELECT user_id INTO target_user_id 
  FROM public.profiles 
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Assign admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN TRUE;
END;
$$;

-- Add audit logging table for security monitoring
CREATE TABLE public.security_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs" 
ON public.security_audit_log 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    resource_type,
    resource_id,
    metadata
  ) VALUES (
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id,
    p_metadata
  );
END;
$$;