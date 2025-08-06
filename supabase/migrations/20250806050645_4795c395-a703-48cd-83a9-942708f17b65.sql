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
    status TEXT DEFAULT 'pending',
    payment_method TEXT,
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
    created_by UUID,
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

CREATE POLICY "System can manage all timeline entries" 
ON public.service_timeline 
FOR ALL 
USING (true);

-- Create storage bucket for resumes if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;