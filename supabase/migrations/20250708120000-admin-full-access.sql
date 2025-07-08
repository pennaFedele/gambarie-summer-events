-- Grant admin users full access to modify and delete all content
-- This migration updates RLS policies to allow admins to manage all resources

-- Update events table policies
DROP POLICY IF EXISTS "Users can update their own events" ON public.events;
DROP POLICY IF EXISTS "Users can delete their own events" ON public.events;

CREATE POLICY "Users can update their own events or admins can update all" 
ON public.events 
FOR UPDATE 
USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own events or admins can delete all" 
ON public.events 
FOR DELETE 
USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));

-- Update long_events table policies
DROP POLICY IF EXISTS "Users can update their own long events" ON public.long_events;
DROP POLICY IF EXISTS "Users can delete their own long events" ON public.long_events;

CREATE POLICY "Users can update their own long events or admins can update all" 
ON public.long_events 
FOR UPDATE 
USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own long events or admins can delete all" 
ON public.long_events 
FOR DELETE 
USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));

-- Update activities table policies
DROP POLICY IF EXISTS "Users can update their own activities or null created_by" ON public.activities;
DROP POLICY IF EXISTS "Users can delete their own activities" ON public.activities;

CREATE POLICY "Users can update their own activities or admins can update all" 
ON public.activities 
FOR UPDATE 
USING (auth.uid() = created_by OR created_by IS NULL OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own activities or admins can delete all" 
ON public.activities 
FOR DELETE 
USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));

-- Update profiles table policies to allow admin access
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile or admins can update all" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert their own profile or admins can insert all" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete profiles (be careful with this)
CREATE POLICY "Admins can delete profiles" 
ON public.profiles 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Update storage policies to allow admin access
-- Note: This requires updating the storage policies through the Supabase dashboard or API
-- The following is a comment for reference:
-- STORAGE POLICY UPDATE NEEDED:
-- Allow admins to upload/update/delete files in any folder
-- Policy name: "Admins can manage all files"
-- Expression: has_role(auth.uid(), 'admin') OR path[1] = auth.uid()::text