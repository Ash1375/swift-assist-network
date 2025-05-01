
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { ServiceRequestFormData } from "@/components/service-request/types";

export const useServiceRequests = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeRequests, setActiveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const submitServiceRequest = async (formData: ServiceRequestFormData, serviceType: string) => {
    if (!user) {
      toast.error("You must be logged in to request service");
      return null;
    }
    
    setIsSubmitting(true);
    
    try {
      // Extract coordinates from location string or use geocoding in a real app
      // This is a simplified version
      let lat = 0, lng = 0;
      const locationParts = formData.location.match(/Latitude: ([\d.]+), Longitude: ([\d.]+)/);
      if (locationParts && locationParts.length === 3) {
        lat = parseFloat(locationParts[1]);
        lng = parseFloat(locationParts[2]);
      }
      
      const request = {
        user_id: user.id,
        service_type: serviceType,
        vehicle_type: `${formData.vehicleType} - ${formData.vehicleSubtype}`,
        vehicle_model: formData.vehicleModel,
        location_lat: lat,
        location_lng: lng,
        address: formData.location,
        description: formData.details,
        technician_id: formData.selectedTechnicianId,
        status: 'pending'
      };
      
      // Use any() to access 'service_requests' table which isn't in the type definition yet
      const { data, error } = await supabase
        .from('service_requests')
        .insert(request)
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success("Service request submitted successfully!");
      return data;
    } catch (error: any) {
      console.error("Error submitting service request:", error);
      toast.error(error.message || "Failed to submit service request");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getUserRequests = async () => {
    if (!user) return [];
    
    setIsLoading(true);
    try {
      // Use any() to access 'service_requests' and join with 'technicians' table
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          technicians (
            name,
            phone,
            email
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error("Error fetching user requests:", error);
      toast.error("Failed to load your service requests");
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const getTechnicianRequests = async (technicianId: string) => {
    setIsLoading(true);
    try {
      // Use any() to access 'service_requests' and join with 'profiles' table
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          profiles:user_id (
            full_name,
            phone
          )
        `)
        .eq('technician_id', technicianId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error("Error fetching technician requests:", error);
      toast.error("Failed to load service requests");
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      const updates = {
        status,
        updated_at: new Date().toISOString(),
      };
      
      if (status === 'completed') {
        updates.completed_at = new Date().toISOString();
      }
      
      // Use any() to update 'service_requests' table which isn't in the type definition yet
      const { error } = await supabase
        .from('service_requests')
        .update(updates)
        .eq('id', requestId);
        
      if (error) throw error;
      
      toast.success(`Request ${status} successfully`);
      return true;
    } catch (error) {
      console.error(`Error updating request to ${status}:`, error);
      toast.error(`Failed to update request status`);
      return false;
    }
  };

  return {
    submitServiceRequest,
    getUserRequests,
    getTechnicianRequests,
    updateRequestStatus,
    isSubmitting,
    isLoading,
  };
};
