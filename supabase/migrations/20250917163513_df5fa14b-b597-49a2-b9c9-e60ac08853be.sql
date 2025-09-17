-- Align service_requests/service_communications with frontend and allow public inserts + safe selects for returns
-- 1) Add missing columns used by the app
ALTER TABLE public.service_requests
  ADD COLUMN IF NOT EXISTS personal_info jsonb,
  ADD COLUMN IF NOT EXISTS details text,
  ADD COLUMN IF NOT EXISTS urgency text,
  ADD COLUMN IF NOT EXISTS completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS technician_id uuid;

-- 2) Set sensible defaults to allow anonymous submissions (no auth yet)
ALTER TABLE public.service_requests
  ALTER COLUMN user_id SET DEFAULT gen_random_uuid();

ALTER TABLE public.service_communications
  ALTER COLUMN user_id SET DEFAULT gen_random_uuid();

-- 3) Optional FK to technicians if not already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'service_requests_technician_id_fkey'
  ) THEN
    ALTER TABLE public.service_requests
      ADD CONSTRAINT service_requests_technician_id_fkey
      FOREIGN KEY (technician_id) REFERENCES public.technicians (id) ON DELETE SET NULL;
  END IF;
END $$;

-- 4) RLS policies: allow PUBLIC to INSERT, and allow SELECT on recently created rows so returning works
-- service_requests
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='service_requests' AND polname='Public can create service requests'
  ) THEN
    CREATE POLICY "Public can create service requests"
    ON public.service_requests
    FOR INSERT
    WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='service_requests' AND polname='Public can view recent service requests'
  ) THEN
    CREATE POLICY "Public can view recent service requests"
    ON public.service_requests
    FOR SELECT
    USING (created_at > now() - interval '1 hour');
  END IF;
END $$;

-- service_communications
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='service_communications' AND polname='Public can create service communications'
  ) THEN
    CREATE POLICY "Public can create service communications"
    ON public.service_communications
    FOR INSERT
    WITH CHECK (true);
  END IF;
END $$;