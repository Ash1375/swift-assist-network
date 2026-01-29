-- Add status (PENDING/APPROVED/REJECTED), is_approved, email_verified for technician flow
ALTER TABLE public.technicians
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'));

ALTER TABLE public.technicians
  ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

ALTER TABLE public.technicians
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

-- Backfill from verification_status for all existing rows
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
