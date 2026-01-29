-- Allow technician registration insert when user_id is set (e.g. right after signUp).
-- This fixes "Registration could not be completed" when email confirmation is enabled
-- and auth.uid() is not yet set on the next request.
-- Either policy allows insert: auth.uid() IS NOT NULL OR user_id IS NOT NULL.
CREATE POLICY "Allow technician application with user_id" ON public.technicians
FOR INSERT WITH CHECK (user_id IS NOT NULL);
