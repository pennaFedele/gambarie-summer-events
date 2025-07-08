-- Fix RLS policy to allow updates for activities with NULL created_by
-- This is a temporary fix to handle existing data
DROP POLICY IF EXISTS "Users can update their own activities" ON public.activities;

CREATE POLICY "Users can update their own activities or null created_by" 
ON public.activities 
FOR UPDATE 
USING (auth.uid() = created_by OR created_by IS NULL);