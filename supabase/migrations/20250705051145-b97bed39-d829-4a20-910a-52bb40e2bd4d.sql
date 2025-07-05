
-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium', 'enterprise', 'none')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create technicians table
CREATE TABLE public.technicians (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  region TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT NOT NULL,
  locality TEXT,
  service_area_range INTEGER NOT NULL DEFAULT 10,
  experience INTEGER NOT NULL DEFAULT 0,
  specialties TEXT[] DEFAULT '{}',
  pricing JSONB DEFAULT '{}',
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service_requests table
CREATE TABLE public.service_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  technician_id UUID REFERENCES public.technicians(id) ON DELETE SET NULL,
  service_type TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  vehicle_model TEXT,
  location_lat DECIMAL,
  location_lng DECIMAL,
  address TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for technicians (allow public read for verified technicians)
CREATE POLICY "Anyone can view verified technicians" ON public.technicians
  FOR SELECT USING (verification_status = 'verified');

CREATE POLICY "Technicians can view own data" ON public.technicians
  FOR SELECT USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Technicians can update own data" ON public.technicians
  FOR UPDATE USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Anyone can insert technician applications" ON public.technicians
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for service_requests
CREATE POLICY "Users can view own service requests" ON public.service_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Technicians can view assigned requests" ON public.service_requests
  FOR SELECT USING (
    technician_id IN (
      SELECT id FROM public.technicians WHERE auth.jwt() ->> 'email' = email
    )
  );

CREATE POLICY "Users can create service requests" ON public.service_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own requests" ON public.service_requests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Technicians can update assigned requests" ON public.service_requests
  FOR UPDATE USING (
    technician_id IN (
      SELECT id FROM public.technicians WHERE auth.jwt() ->> 'email' = email
    )
  );

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
