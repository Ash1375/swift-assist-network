-- Fix RLS for technician registration: Ensure both policies work together
-- Policy 1: When authenticated (auth.uid() = user_id)
-- Policy 2: When user_id is provided (for cases where session isn't set yet after signUp)

-- Drop existing policies to recreate them correctly
DROP POLICY IF EXISTS "Technician can insert own profile" ON public.technicians;
DROP POLICY IF EXISTS "Allow technician application with user_id" ON public.technicians;
DROP POLICY IF EXISTS "Authenticated users can register as technician" ON public.technicians;

-- Policy 1: Authenticated users can insert their own technician record
CREATE POLICY "Technician can insert own profile"
ON public.technicians
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Policy 2: Allow insert when user_id is provided (for signUp flow when session might not be set)
-- This allows registration right after signUp even if email confirmation is required
CREATE POLICY "Allow technician application with user_id"
ON public.technicians
FOR INSERT
WITH CHECK (user_id IS NOT NULL);
