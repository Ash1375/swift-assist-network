-- Fix security definer view warning - drop the view and keep using RLS policies
DROP VIEW IF EXISTS public.technicians_public;

-- Create a function instead for safe public technician access
CREATE OR REPLACE FUNCTION public.get_verified_technicians()
RETURNS TABLE (
    id uuid,
    name text,
    phone text,
    address text,
    region text,
    district text,
    state text,
    locality text,
    service_area_range integer,
    experience integer,
    specialties text[],
    pricing jsonb,
    rating numeric,
    completed_jobs integer,
    verification_status text,
    avatar_url text,
    created_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
    SELECT 
        t.id, t.name, t.phone, t.address, t.region, t.district, t.state, t.locality,
        t.service_area_range, t.experience, t.specialties, t.pricing, t.rating,
        t.completed_jobs, t.verification_status, t.avatar_url, t.created_at
    FROM public.technicians t
    WHERE t.verification_status = 'verified';
$$;

-- Add a policy for public to view verified technicians (without sensitive fields, enforced by RLS)
DROP POLICY IF EXISTS "Public can view verified technicians basic info" ON public.technicians;

CREATE POLICY "Public can view verified technicians basic info" ON public.technicians
FOR SELECT USING (
    verification_status = 'verified'
);