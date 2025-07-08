-- Fix assign_first_admin function to work with users created manually in auth.users
CREATE OR REPLACE FUNCTION public.assign_first_admin(user_email text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
  
  -- Find user by email in auth.users table directly
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Create profile if it doesn't exist
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (target_user_id, user_email, user_email)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Assign admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN TRUE;
END;
$function$