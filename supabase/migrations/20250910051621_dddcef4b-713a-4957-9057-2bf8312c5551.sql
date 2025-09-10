-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  brand TEXT NOT NULL,
  wholesale_price DECIMAL(10,2) NOT NULL,
  retail_price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  vehicle_compatibility TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES public.categories(id),
  is_active BOOLEAN DEFAULT true,
  min_order_quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create service_requests table
CREATE TABLE public.service_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  service_type TEXT NOT NULL,
  vehicle_info JSONB,
  location_info JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create technicians table
CREATE TABLE public.technicians (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  address TEXT,
  verification_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart table
CREATE TABLE public.cart (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price_type TEXT NOT NULL CHECK (price_type IN ('retail', 'wholesale')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create service_communications table for mediator functionality
CREATE TABLE public.service_communications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  service_provider_id UUID,
  service_type TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  location JSONB,
  vehicle_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_communications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for categories (public read)
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

-- Create RLS policies for products (public read)
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Create RLS policies for service_requests
CREATE POLICY "Users can view their own service requests" ON public.service_requests FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create their own service requests" ON public.service_requests FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own service requests" ON public.service_requests FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Create RLS policies for technicians
CREATE POLICY "Users can view their own technician profile" ON public.technicians FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create their own technician profile" ON public.technicians FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own technician profile" ON public.technicians FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Create RLS policies for cart
CREATE POLICY "Users can view their own cart" ON public.cart FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can manage their own cart" ON public.cart FOR ALL USING (auth.uid()::text = user_id::text);

-- Create RLS policies for service_communications
CREATE POLICY "Users can view their own communications" ON public.service_communications FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create communications" ON public.service_communications FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Service providers can view communications directed to them" ON public.service_communications FOR SELECT USING (auth.uid()::text = service_provider_id::text);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON public.service_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_technicians_updated_at BEFORE UPDATE ON public.technicians FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON public.cart FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_service_communications_updated_at BEFORE UPDATE ON public.service_communications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample categories
INSERT INTO public.categories (name, description) VALUES
('Tyres', 'All types of vehicle tyres and wheels'),
('Engine Parts', 'Engine components and accessories'),
('Brake Parts', 'Brake pads, discs, and brake system components'),
('Electrical', 'Electrical components and accessories'),
('Body Parts', 'External and internal body components'),
('Filters', 'Air, oil, fuel filters and more');

-- Insert sample products
INSERT INTO public.products (name, description, brand, wholesale_price, retail_price, stock_quantity, images, vehicle_compatibility, category_id) 
SELECT 
  'Michelin Pilot Sport 4',
  'High-performance summer tyre with excellent grip and handling',
  'Michelin',
  8500.00,
  12000.00,
  50,
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
  ARRAY['Sedan', 'Hatchback', 'SUV'],
  id FROM public.categories WHERE name = 'Tyres' LIMIT 1;

INSERT INTO public.products (name, description, brand, wholesale_price, retail_price, stock_quantity, images, vehicle_compatibility, category_id)
SELECT 
  'Bosch Spark Plug',
  'Premium spark plug for better engine performance',
  'Bosch',
  450.00,
  650.00,
  200,
  ARRAY['https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400'],
  ARRAY['Sedan', 'Hatchback', 'SUV', 'Motorcycle'],
  id FROM public.categories WHERE name = 'Engine Parts' LIMIT 1;