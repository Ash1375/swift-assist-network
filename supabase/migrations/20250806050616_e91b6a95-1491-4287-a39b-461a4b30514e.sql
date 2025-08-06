-- Add missing columns to service_requests table for payment and contact info
ALTER TABLE public.service_requests 
ADD COLUMN IF NOT EXISTS contact_name TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS payment_timing TEXT DEFAULT 'after_service',
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS estimated_cost DECIMAL(10,2);

-- Create payments table for tracking payment transactions
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    service_request_id UUID NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
    razorpay_payment_id TEXT,
    razorpay_order_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'pending', -- pending, success, failed, refunded
    payment_method TEXT, -- card, upi, netbanking, wallet, cash
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create service_timeline table for tracking service progress
CREATE TABLE IF NOT EXISTS public.service_timeline (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    service_request_id UUID NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    notes TEXT,
    created_by UUID, -- technician or system
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_timeline ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payments table
CREATE POLICY "Users can view their own payments" 
ON public.payments 
FOR SELECT 
USING (
    service_request_id IN (
        SELECT id FROM public.service_requests 
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Technicians can view assigned service payments" 
ON public.payments 
FOR SELECT 
USING (
    service_request_id IN (
        SELECT id FROM public.service_requests 
        WHERE technician_id IN (
            SELECT id FROM public.technicians 
            WHERE id = auth.uid()
        )
    )
);

CREATE POLICY "System can manage all payments" 
ON public.payments 
FOR ALL 
USING (true);

-- RLS Policies for service_timeline table
CREATE POLICY "Users can view their service timeline" 
ON public.service_timeline 
FOR SELECT 
USING (
    service_request_id IN (
        SELECT id FROM public.service_requests 
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Technicians can view and update assigned service timeline" 
ON public.service_timeline 
FOR ALL 
USING (
    service_request_id IN (
        SELECT id FROM public.service_requests 
        WHERE technician_id IN (
            SELECT id FROM public.technicians 
            WHERE id = auth.uid()
        )
    )
);

CREATE POLICY "System can manage all timeline entries" 
ON public.service_timeline 
FOR ALL 
USING (true);

-- Update RLS policies for existing tables to ensure proper access
DROP POLICY IF EXISTS "Users can view their own requests" ON public.service_requests;
DROP POLICY IF EXISTS "Users can create their own requests" ON public.service_requests;
DROP POLICY IF EXISTS "Users can update their own requests" ON public.service_requests;

CREATE POLICY "Users can view their own requests" 
ON public.service_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own requests" 
ON public.service_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own requests" 
ON public.service_requests 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Technicians can view assigned requests" 
ON public.service_requests 
FOR SELECT 
USING (
    technician_id IN (
        SELECT id FROM public.technicians 
        WHERE id = auth.uid()
    )
);

CREATE POLICY "Technicians can update assigned requests" 
ON public.service_requests 
FOR UPDATE 
USING (
    technician_id IN (
        SELECT id FROM public.technicians 
        WHERE id = auth.uid()
    )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create timeline entries
CREATE OR REPLACE FUNCTION public.create_timeline_entry()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.service_timeline (service_request_id, status, notes)
        VALUES (NEW.id, NEW.status, 'Service request created');
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        INSERT INTO public.service_timeline (service_request_id, status, notes)
        VALUES (NEW.id, NEW.status, 'Status updated to ' || NEW.status);
        RETURN NEW;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timeline creation
CREATE TRIGGER create_service_timeline
    AFTER INSERT OR UPDATE OF status ON public.service_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.create_timeline_entry();

-- Create storage bucket for resumes if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for resumes
CREATE POLICY "Technicians can upload their own resumes" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Technicians can view their own resumes" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all resumes" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'resumes');