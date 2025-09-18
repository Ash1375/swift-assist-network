-- Create comprehensive production schema (simplified approach)

-- 1. Create enums (without IF NOT EXISTS)
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user', 'technician');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.service_status AS ENUM ('pending', 'assigned', 'in_progress', 'completed', 'cancelled', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.urgency_level AS ENUM ('low', 'normal', 'high', 'emergency');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.verification_status AS ENUM ('pending', 'verified', 'rejected', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Drop and recreate technicians table with complete structure
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

-- 3. Insert sample technicians for immediate use
INSERT INTO public.technicians (name, email, phone, address, latitude, longitude, specialties, pricing, experience_years, rating, total_jobs, verification_status, is_available) VALUES
('Rajesh Kumar', 'rajesh.kumar@email.com', '+91-9876543210', 'T. Nagar, Chennai', 13.0417, 80.2481, '{"towing","tire-repair","battery"}', '{"towing": 800, "tire-repair": 400, "battery": 500}', 5, 4.8, 156, 'verified', true),
('Suresh Menon', 'suresh.menon@email.com', '+91-9876543211', 'Koramangala, Bangalore', 12.9352, 77.6245, '{"mechanical","winching","lockout"}', '{"mechanical": 600, "winching": 900, "lockout": 350}', 8, 4.6, 203, 'verified', true),
('Arjun Patel', 'arjun.patel@email.com', '+91-9876543212', 'Andheri, Mumbai', 19.1136, 72.8697, '{"towing","fuel-delivery","battery"}', '{"towing": 750, "fuel-delivery": 300, "battery": 450}', 3, 4.5, 89, 'verified', false),
('Vikram Singh', 'vikram.singh@email.com', '+91-9876543213', 'Connaught Place, Delhi', 28.6315, 77.2167, '{"tire-repair","mechanical","winching"}', '{"tire-repair": 450, "mechanical": 700, "winching": 950}', 12, 4.9, 324, 'verified', true),
('Manoj Krishnan', 'manoj.krishnan@email.com', '+91-9876543214', 'Kochi, Kerala', 9.9312, 76.2673, '{"towing","lockout","battery"}', '{"towing": 650, "lockout": 400, "battery": 500}', 6, 4.4, 142, 'verified', true);

-- 4. Enable RLS and create policies for technicians
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view verified available technicians" 
ON public.technicians 
FOR SELECT 
USING (verification_status = 'verified' AND is_available = true);

CREATE POLICY "Technicians can update their own profile" 
ON public.technicians 
FOR UPDATE 
USING (auth.uid() = user_id);

-- 5. Create other essential tables
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id uuid REFERENCES public.service_requests(id) ON DELETE CASCADE NOT NULL,
  user_id uuid,
  technician_id uuid REFERENCES public.technicians(id) ON DELETE SET NULL,
  amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending',
  payment_method text,
  transaction_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.technician_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id uuid REFERENCES public.service_requests(id) ON DELETE CASCADE NOT NULL,
  technician_id uuid REFERENCES public.technicians(id) ON DELETE CASCADE NOT NULL,
  user_id uuid,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  related_id uuid,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);