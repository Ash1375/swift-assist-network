-- =====================================================
-- SECURITY FIX MIGRATION
-- Addresses: tech_password_public_read, admin_client_auth, 
-- resume_admin_policy, system_policies_too_permissive
-- =====================================================

-- 1. Create admin role enum and user_roles table for proper server-side auth
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Only admins can view and manage roles
CREATE POLICY "Admins can view all roles" ON public.user_roles
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.user_roles ur 
        WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
);

CREATE POLICY "Users can view own role" ON public.user_roles
FOR SELECT USING (user_id = auth.uid());

-- 2. Create security definer function for role checking (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 3. Drop the password column from technicians table (CRITICAL)
ALTER TABLE public.technicians DROP COLUMN IF EXISTS password;

-- 4. Add user_id column to technicians for proper auth relationship
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- 5. Create a safe public view for technicians (excludes sensitive fields)
CREATE OR REPLACE VIEW public.technicians_public AS
SELECT 
    id, name, phone, address, region, district, state, locality,
    service_area_range, experience, specialties, pricing, rating,
    completed_jobs, verification_status, avatar_url, created_at
FROM public.technicians
WHERE verification_status = 'verified';

-- 6. Fix technician RLS policies
DROP POLICY IF EXISTS "Anyone can view verified technicians" ON public.technicians;
DROP POLICY IF EXISTS "Technicians can update own record" ON public.technicians;

-- Technicians can view their own record
CREATE POLICY "Technicians view own full record" ON public.technicians
FOR SELECT USING (
    email = auth.email() 
    OR user_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
);

-- Technicians can update their own record (but not verification_status)
CREATE POLICY "Technicians update own record" ON public.technicians
FOR UPDATE USING (
    (email = auth.email() OR user_id = auth.uid())
    AND NOT public.has_role(auth.uid(), 'admin')
) WITH CHECK (
    (email = auth.email() OR user_id = auth.uid())
);

-- Only admins can update verification_status
CREATE POLICY "Admins can update any technician" ON public.technicians
FOR UPDATE USING (
    public.has_role(auth.uid(), 'admin')
);

-- 7. Create resumes storage bucket if not exists and fix policies
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'resumes', 
    'resumes', 
    false, 
    5242880, 
    ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Drop overly permissive resume policy
DROP POLICY IF EXISTS "Admins can view all resumes" ON storage.objects;

-- Technicians can upload their own resumes
CREATE POLICY "Technicians upload own resume" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'resumes' 
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Technicians can view their own resumes
CREATE POLICY "Technicians view own resume" ON storage.objects
FOR SELECT USING (
    bucket_id = 'resumes' 
    AND (
        (storage.foldername(name))[1] = auth.uid()::text
        OR public.has_role(auth.uid(), 'admin')
    )
);

-- Admins can view all resumes (proper check now)
CREATE POLICY "Admins view all resumes" ON storage.objects
FOR SELECT USING (
    bucket_id = 'resumes' 
    AND public.has_role(auth.uid(), 'admin')
);