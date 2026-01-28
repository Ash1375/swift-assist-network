-- Create reviews table for technician ratings
CREATE TABLE public.reviews (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    technician_id UUID NOT NULL REFERENCES public.technicians(id) ON DELETE CASCADE,
    service_request_id UUID NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(service_request_id) -- One review per service request
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can create reviews for their own completed requests"
ON public.reviews FOR INSERT
WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM public.service_requests sr
        WHERE sr.id = service_request_id
        AND sr.user_id = auth.uid()
        AND sr.status = 'completed'
    )
);

CREATE POLICY "Users can view their own reviews"
ON public.reviews FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Public can view reviews for verified technicians"
ON public.reviews FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.technicians t
        WHERE t.id = technician_id
        AND t.verification_status = 'verified'
    )
);

CREATE POLICY "Users can update their own reviews"
ON public.reviews FOR UPDATE
USING (auth.uid() = user_id);

-- Function to update technician average rating
CREATE OR REPLACE FUNCTION public.update_technician_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.technicians
    SET rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM public.reviews
        WHERE technician_id = NEW.technician_id
    )
    WHERE id = NEW.technician_id;
    RETURN NEW;
END;
$$;

-- Trigger to auto-update rating on new review
CREATE TRIGGER update_technician_rating_trigger
AFTER INSERT OR UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_technician_rating();

-- Trigger for updated_at
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();