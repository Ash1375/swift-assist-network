import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface TechnicianServiceRequest {
  id: string;
  service_type: string;
  vehicle_type: string | null;
  vehicle_model: string | null;
  address: string | null;
  description: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  status: string | null;
  payment_status: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  location_lat: number | null;
  location_lng: number | null;
}

interface UseRealtimeTechnicianRequestsOptions {
  onNewRequest?: (request: TechnicianServiceRequest) => void;
  onRequestUpdated?: (request: TechnicianServiceRequest) => void;
}

export const useRealtimeTechnicianRequests = (
  technicianId: string | undefined,
  options?: UseRealtimeTechnicianRequestsOptions
) => {
  const [requests, setRequests] = useState<TechnicianServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all requests for this technician
  const fetchRequests = useCallback(async () => {
    if (!technicianId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('service_requests')
        .select('*')
        .eq('technician_id', technicianId)
        .in('status', ['pending', 'assigned', 'en-route', 'in-progress'])
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setRequests(data || []);
    } catch (err: any) {
      console.error('Error fetching requests:', err);
      setError(err.message || 'Failed to load requests');
      toast.error('Failed to load service requests');
    } finally {
      setIsLoading(false);
    }
  }, [technicianId]);

  // Update request status
  const updateRequestStatus = useCallback(async (
    requestId: string, 
    newStatus: string
  ): Promise<boolean> => {
    try {
      const updates: Record<string, string> = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };
      
      if (newStatus === 'completed') {
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('service_requests')
        .update(updates)
        .eq('id', requestId);

      if (error) throw error;
      
      toast.success(`Request ${newStatus === 'completed' ? 'completed' : 'updated'} successfully`);
      return true;
    } catch (err: any) {
      console.error('Error updating request:', err);
      toast.error('Failed to update request');
      return false;
    }
  }, []);

  // Set up realtime subscription
  useEffect(() => {
    if (!technicianId) return;

    let channel: RealtimeChannel | null = null;

    const setupRealtimeSubscription = async () => {
      // First fetch initial data
      await fetchRequests();

      // Subscribe to changes for this technician's requests
      channel = supabase
        .channel(`technician_requests_${technicianId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'service_requests',
            filter: `technician_id=eq.${technicianId}`
          },
          (payload) => {
            console.log('New request received:', payload);
            const newRequest = payload.new as TechnicianServiceRequest;
            
            setRequests(prev => [newRequest, ...prev]);
            options?.onNewRequest?.(newRequest);
            
            toast.success('🔔 New service request received!', {
              description: `${newRequest.service_type} - ${newRequest.address || 'No address'}`
            });
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'service_requests',
            filter: `technician_id=eq.${technicianId}`
          },
          (payload) => {
            console.log('Request updated:', payload);
            const updatedRequest = payload.new as TechnicianServiceRequest;
            
            setRequests(prev => {
              // If completed, remove from active list
              if (updatedRequest.status === 'completed') {
                return prev.filter(r => r.id !== updatedRequest.id);
              }
              
              // Otherwise update in place
              return prev.map(r => 
                r.id === updatedRequest.id ? updatedRequest : r
              );
            });
            
            options?.onRequestUpdated?.(updatedRequest);
          }
        )
        .subscribe((status) => {
          console.log('Technician realtime subscription status:', status);
          setIsConnected(status === 'SUBSCRIBED');
        });
    };

    setupRealtimeSubscription();

    // Cleanup subscription on unmount
    return () => {
      if (channel) {
        console.log('Cleaning up technician realtime subscription');
        supabase.removeChannel(channel);
      }
    };
  }, [technicianId, fetchRequests, options]);

  return {
    requests,
    isLoading,
    isConnected,
    error,
    refresh: fetchRequests,
    updateRequestStatus
  };
};
