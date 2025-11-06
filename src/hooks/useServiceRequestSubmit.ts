import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ServiceRequestData {
  name: string;
  phone: string;
  email?: string;
  vehicleInfo: any;
  locationInfo: any;
  personalInfo?: any;
  details: string;
  urgency: string;
  serviceType: string;
}

export const useServiceRequestSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const submitServiceRequest = async (data: ServiceRequestData) => {
    setIsSubmitting(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please login to submit a service request");
        navigate('/login');
        return;
      }

      const serviceData = {
        user_id: user.id,
        service_type: data.serviceType,
        vehicle_type: data.vehicleInfo?.type || 'unknown',
        vehicle_model: data.vehicleInfo?.model || data.vehicleInfo?.brand || 'Unknown Model',
        address: data.locationInfo?.address || data.personalInfo?.address || 'Not specified',
        description: data.details || '',
        contact_name: data.personalInfo?.name || data.name,
        contact_phone: data.personalInfo?.phone || data.phone,
        contact_email: data.personalInfo?.email || data.email,
        status: 'pending',
        payment_status: 'pending'
      };

      const { data: result, error } = await supabase
        .from('service_requests')
        .insert(serviceData)
        .select()
        .single();

      if (error) throw error;

      toast.success("Service request submitted successfully!");
      
      // Navigate to tracking page with the actual request ID
      navigate(`/request-tracking/${result.id}`);
      
      return result;
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error("Failed to submit request. Please try again.");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitServiceRequest,
    isSubmitting
  };
};