-- RLS: Allow authenticated users to INSERT their own technician record.
-- Fixes: "new row violates row-level security policy for table 'technicians'" (42501)
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Technician can insert own profile" ON public.technicians;
CREATE POLICY "Technician can insert own profile"
ON public.technicians
FOR INSERT
WITH CHECK (auth.uid() = user_id);
