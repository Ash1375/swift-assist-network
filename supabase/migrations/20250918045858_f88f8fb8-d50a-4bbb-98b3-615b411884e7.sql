-- Fix security issues by enabling RLS on all new tables

-- Enable RLS on all new tables
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technician_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for payments
CREATE POLICY "Users can view their own payments" 
ON public.payments 
FOR SELECT 
USING (user_id::text = auth.uid()::text);

CREATE POLICY "Technicians can view their payments" 
ON public.payments 
FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.technicians 
    WHERE technicians.id = payments.technician_id 
    AND technicians.user_id = auth.uid()
));

-- Create RLS policies for technician_reviews
CREATE POLICY "Anyone can view reviews" 
ON public.technician_reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create reviews for their service requests" 
ON public.technician_reviews 
FOR INSERT 
WITH CHECK (EXISTS (
    SELECT 1 FROM public.service_requests 
    WHERE service_requests.id = service_request_id 
    AND service_requests.user_id::text = auth.uid()::text
));

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (user_id::text = auth.uid()::text);