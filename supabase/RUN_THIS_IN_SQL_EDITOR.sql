-- =============================================================================
-- RUN THIS ENTIRE FILE IN SUPABASE SQL EDITOR
-- Dashboard: https://supabase.com/dashboard/project/ikfagbdzyeacpaphrveu/sql
-- Copy all below, paste in New query, click Run.
-- =============================================================================

-- 1) Add status columns if not already present
ALTER TABLE public.technicians
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'));

ALTER TABLE public.technicians
  ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

ALTER TABLE public.technicians
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

-- Backfill from verification_status (safe to run multiple times)
UPDATE public.technicians
SET
  status = CASE verification_status
    WHEN 'pending' THEN 'PENDING'
    WHEN 'verified' THEN 'APPROVED'
    WHEN 'rejected' THEN 'REJECTED'
    ELSE 'PENDING'
  END,
  is_approved = (verification_status = 'verified'),
  email_verified = (verification_status = 'verified');

-- 2) Fix RLS for technician registration (fixes 42501 / "Registration could not be completed")
DROP POLICY IF EXISTS "Technician can insert own profile" ON public.technicians;
DROP POLICY IF EXISTS "Allow technician application with user_id" ON public.technicians;
DROP POLICY IF EXISTS "Authenticated users can register as technician" ON public.technicians;

CREATE POLICY "Technician can insert own profile"
ON public.technicians
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Allow technician application with user_id"
ON public.technicians
FOR INSERT
WITH CHECK (user_id IS NOT NULL);

-- Done. Technician registration and admin applications should work after this.
