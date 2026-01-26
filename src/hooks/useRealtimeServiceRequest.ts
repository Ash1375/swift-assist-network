import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface ServiceRequest {
  id: string;
  service_type: string;
  vehicle_type: string | null;
  vehicle_model: string | null;
  address: string | null;
  description: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  status: string | null;
  payment_status: string | null;
  created_at: string;
  updated_at: string;
  technician_id: string | null;
  user_id: string;
  location_lat: number | null;
  location_lng: number | null;
  completed_at: string | null;
  contact_email: string | null;
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  rating: number | null;
  specialties: string[] | null;
  avatar_url: string | null;
}

interface UseRealtimeServiceRequestOptions {
  onStatusChange?: (oldStatus: string | null, newStatus: string | null) => void;
  onTechnicianAssigned?: (technician: Technician) => void;
}

export const useRealtimeServiceRequest = (
  requestId: string | undefined,
  options?: UseRealtimeServiceRequestOptions
) => {
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch technician data
  const fetchTechnician = useCallback(async (technicianId: string) => {
    try {
      const { data, error: techError } = await supabase
        .from('technicians')
        .select('id, name, phone, rating, specialties, avatar_url')
        .eq('id', technicianId)
        .single();

      if (techError) throw techError;
      
      if (data) {
        setTechnician(data);
        options?.onTechnicianAssigned?.(data);
      }
    } catch (err) {
      console.error('Error fetching technician:', err);
    }
  }, [options]);

  // Initial fetch
  const fetchRequestData = useCallback(async () => {
    if (!requestId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('service_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (fetchError) throw fetchError;
      
      setRequest(data);

      // Fetch technician if assigned
      if (data.technician_id) {
        await fetchTechnician(data.technician_id);
      }
    } catch (err: any) {
      console.error('Error fetching request:', err);
      setError(err.message || 'Failed to load request');
      toast.error('Failed to load request details');
    } finally {
      setIsLoading(false);
    }
  }, [requestId, fetchTechnician]);

  // Set up realtime subscription
  useEffect(() => {
    if (!requestId) return;

    let channel: RealtimeChannel | null = null;

    const setupRealtimeSubscription = async () => {
      // First fetch initial data
      await fetchRequestData();

      // Subscribe to changes on this specific request
      channel = supabase
        .channel(`service_request_${requestId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'service_requests',
            filter: `id=eq.${requestId}`
          },
          (payload) => {
            console.log('Realtime update received:', payload);
            
            const newData = payload.new as ServiceRequest;
            const oldData = payload.old as Partial<ServiceRequest>;
            
            // Check if status changed
            if (oldData.status !== newData.status) {
              options?.onStatusChange?.(oldData.status || null, newData.status);
              
              // Show toast notification for status changes
              const statusMessages: Record<string, string> = {
                'assigned': '🎉 A technician has been assigned!',
                'en-route': '🚗 Technician is on the way!',
                'arrived': '📍 Technician has arrived!',
                'in-progress': '🔧 Service in progress...',
                'completed': '✅ Service completed!'
              };
              
              if (newData.status && statusMessages[newData.status]) {
                toast.success(statusMessages[newData.status]);
              }
            }

            // Check if technician was assigned
            if (!oldData.technician_id && newData.technician_id) {
              fetchTechnician(newData.technician_id);
            }

            setRequest(newData);
          }
        )
        .subscribe((status) => {
          console.log('Realtime subscription status:', status);
          setIsConnected(status === 'SUBSCRIBED');
        });
    };

    setupRealtimeSubscription();

    // Cleanup subscription on unmount
    return () => {
      if (channel) {
        console.log('Cleaning up realtime subscription');
        supabase.removeChannel(channel);
      }
    };
  }, [requestId, fetchRequestData, fetchTechnician, options]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchRequestData();
  }, [fetchRequestData]);

  return {
    request,
    technician,
    isLoading,
    isConnected,
    error,
    refresh
  };
};
