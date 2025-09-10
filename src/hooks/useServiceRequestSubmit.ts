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
      // For now, use a temporary user ID until authentication is implemented
      const userId = 'temp-user-id';
      
      const serviceData = {
        user_id: userId,
        service_type: data.serviceType,
        vehicle_info: data.vehicleInfo,
        location_info: data.locationInfo,
        personal_info: data.personalInfo || {
          name: data.name,
          phone: data.phone,
          email: data.email
        },
        details: data.details,
        urgency: data.urgency,
        status: 'pending'
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