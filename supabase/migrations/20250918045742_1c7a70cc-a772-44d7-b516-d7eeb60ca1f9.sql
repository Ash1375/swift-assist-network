-- Fix the column type casting issue and create comprehensive schema

-- 1. Create enums for better data integrity
CREATE TYPE IF NOT EXISTS public.app_role AS ENUM ('admin', 'moderator', 'user', 'technician');
CREATE TYPE IF NOT EXISTS public.service_status AS ENUM ('pending', 'assigned', 'in_progress', 'completed', 'cancelled', 'rejected');
CREATE TYPE IF NOT EXISTS public.payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE IF NOT EXISTS public.urgency_level AS ENUM ('low', 'normal', 'high', 'emergency');
CREATE TYPE IF NOT EXISTS public.verification_status AS ENUM ('pending', 'verified', 'rejected', 'suspended');

-- 2. Enhanced profiles table with proper structure
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name text,
  phone text,
  email text,
  avatar_url text,
  address jsonb,
  subscription_tier text DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. User roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

-- 4. Fix existing technicians table or create new one
DROP TABLE IF EXISTS public.technicians CASCADE;
CREATE TABLE public.technicians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text,
  latitude decimal(10,8),
  longitude decimal(11,8),
  service_area_radius integer DEFAULT 50,
  specialties text[] DEFAULT '{}',
  pricing jsonb DEFAULT '{}',
  experience_years integer DEFAULT 0,
  rating decimal(3,2) DEFAULT 0.0,
  total_jobs integer DEFAULT 0,
  verification_status verification_status DEFAULT 'pending',
  is_available boolean DEFAULT true,
  profile_image_url text,
  documents jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 5. Fix service_requests table type issues
-- First, update existing status values to match enum
UPDATE public.service_requests SET status = 'pending' WHERE status NOT IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled', 'rejected');
UPDATE public.service_requests SET urgency = 'normal' WHERE urgency NOT IN ('low', 'normal', 'high', 'emergency');

-- Drop the column and recreate with proper type
ALTER TABLE public.service_requests DROP COLUMN IF EXISTS status;
ALTER TABLE public.service_requests ADD COLUMN status service_status DEFAULT 'pending';

ALTER TABLE public.service_requests DROP COLUMN IF EXISTS urgency;
ALTER TABLE public.service_requests ADD COLUMN urgency urgency_level DEFAULT 'normal';

-- Add other missing columns
ALTER TABLE public.service_requests
  ADD COLUMN IF NOT EXISTS estimated_cost decimal(10,2),
  ADD COLUMN IF NOT EXISTS final_cost decimal(10,2),
  ADD COLUMN IF NOT EXISTS assigned_at timestamptz,
  ADD COLUMN IF NOT EXISTS started_at timestamptz,
  ADD COLUMN IF NOT EXISTS eta timestamptz,
  ADD COLUMN IF NOT EXISTS rating integer CHECK (rating >= 1 AND rating <= 5),
  ADD COLUMN IF NOT EXISTS review text;

-- 6. Payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id uuid REFERENCES public.service_requests(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  technician_id uuid REFERENCES public.technicians(id) ON DELETE SET NULL,
  amount decimal(10,2) NOT NULL,
  status payment_status DEFAULT 'pending',
  payment_method text,
  transaction_id text,
  razorpay_order_id text,
  razorpay_payment_id text,
  payment_gateway_response jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 7. Technician reviews table
CREATE TABLE IF NOT EXISTS public.technician_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id uuid REFERENCES public.service_requests(id) ON DELETE CASCADE NOT NULL,
  technician_id uuid REFERENCES public.technicians(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review text,
  created_at timestamptz DEFAULT now()
);

-- 8. Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  related_id uuid,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 9. Insert sample technicians data for testing
INSERT INTO public.technicians (name, email, phone, address, latitude, longitude, specialties, pricing, experience_years, rating, total_jobs, verification_status, is_available) VALUES
('Rajesh Kumar', 'rajesh.kumar@email.com', '+91-9876543210', 'T. Nagar, Chennai', 13.0417, 80.2481, '{"towing", "tire-repair", "battery"}', '{"towing": 800, "tire-repair": 400, "battery": 500}', 5, 4.8, 156, 'verified', true),
('Suresh Menon', 'suresh.menon@email.com', '+91-9876543211', 'Koramangala, Bangalore', 12.9352, 77.6245, '{"mechanical", "winching", "lockout"}', '{"mechanical": 600, "winching": 900, "lockout": 350}', 8, 4.6, 203, 'verified', true),
('Arjun Patel', 'arjun.patel@email.com', '+91-9876543212', 'Andheri, Mumbai', 19.1136, 72.8697, '{"towing", "fuel-delivery", "battery"}', '{"towing": 750, "fuel-delivery": 300, "battery": 450}', 3, 4.5, 89, 'verified', false),
('Vikram Singh', 'vikram.singh@email.com', '+91-9876543213', 'Connaught Place, Delhi', 28.6315, 77.2167, '{"tire-repair", "mechanical", "winching"}', '{"tire-repair": 450, "mechanical": 700, "winching": 950}', 12, 4.9, 324, 'verified', true),
('Manoj Krishnan', 'manoj.krishnan@email.com', '+91-9876543214', 'Kochi, Kerala', 9.9312, 76.2673, '{"towing", "lockout", "battery"}', '{"towing": 650, "lockout": 400, "battery": 500}', 6, 4.4, 142, 'verified', true);