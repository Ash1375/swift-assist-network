-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- Drop the overly permissive technician insert policy
DROP POLICY IF EXISTS "Anyone can register as technician" ON public.technicians;

-- Create a more secure policy - only authenticated users can register
CREATE POLICY "Authenticated users can register as technician" ON public.technicians 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);