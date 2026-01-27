import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Clock, MapPin, Phone, Car, Wrench, CheckCircle, AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { format } from "date-fns";
import { RealtimeChannel } from "@supabase/supabase-js";
import { toast } from "@/components/ui/sonner";

interface ServiceRequest {
  id: string;
  service_type: string;
  vehicle_type: string | null;
  vehicle_model: string | null;
  address: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  technician_id: string | null;
  contact_phone: string | null;
  technician?: {
    name: string;
    phone: string;
    rating: number | null;
  } | null;
}

const MyRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    if (!user) return;

    let channel: RealtimeChannel | null = null;

    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('service_requests')
          .select(`
            *,
            technician:technicians(name, phone, rating)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Map the data to handle the nested technician object
        const mappedData = (data || []).map(req => ({
          ...req,
          technician: req.technician ? req.technician : null
        }));
        
        setRequests(mappedData);
      } catch (error) {
        console.error('Error fetching requests:', error);
        toast.error('Failed to load your requests');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();

    // Set up realtime subscription for user's requests
    channel = supabase
      .channel(`user_requests_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'service_requests',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          console.log('Request update received:', payload);
          
          if (payload.eventType === 'INSERT') {
            // Fetch the full data with technician info
            const { data } = await supabase
              .from('service_requests')
              .select(`*, technician:technicians(name, phone, rating)`)
              .eq('id', payload.new.id)
              .single();
            
            if (data) {
              setRequests(prev => [{
                ...data,
                technician: data.technician || null
              }, ...prev]);
              toast.success('New request created!');
            }
          } else if (payload.eventType === 'UPDATE') {
            const { data } = await supabase
              .from('service_requests')
              .select(`*, technician:technicians(name, phone, rating)`)
              .eq('id', payload.new.id)
              .single();
            
            if (data) {
              setRequests(prev => prev.map(req => 
                req.id === data.id ? { ...data, technician: data.technician || null } : req
              ));
              
              // Show status update notification
              const statusMessages: Record<string, string> = {
                'assigned': '🎉 Technician assigned to your request!',
                'en-route': '🚗 Technician is on the way!',
                'arrived': '📍 Technician has arrived!',
                'in-progress': '🔧 Service in progress...',
                'completed': '✅ Service completed!'
              };
              
              if (data.status && statusMessages[data.status]) {
                toast.success(statusMessages[data.status]);
              }
            }
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user]);

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case 'assigned':
        return <Badge className="bg-blue-500 gap-1"><Wrench className="h-3 w-3" /> Assigned</Badge>;
      case 'en-route':
        return <Badge className="bg-amber-500 gap-1"><Car className="h-3 w-3" /> En Route</Badge>;
      case 'in-progress':
        return <Badge className="bg-purple-500 gap-1"><Wrench className="h-3 w-3" /> In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-500 gap-1"><CheckCircle className="h-3 w-3" /> Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" /> Cancelled</Badge>;
      default:
        return <Badge>{status || 'Unknown'}</Badge>;
    }
  };

  const activeRequests = requests.filter(r => 
    ['pending', 'assigned', 'en-route', 'in-progress', 'arrived'].includes(r.status || '')
  );
  
  const completedRequests = requests.filter(r => 
    ['completed', 'cancelled'].includes(r.status || '')
  );

  const renderRequestCard = (request: ServiceRequest) => (
    <Card key={request.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-lg">{request.service_type}</h4>
            <p className="text-sm text-muted-foreground">
              {request.vehicle_type} {request.vehicle_model && `- ${request.vehicle_model}`}
            </p>
          </div>
          {getStatusBadge(request.status)}
        </div>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{request.address || 'Address not specified'}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{format(new Date(request.created_at), 'PPp')}</span>
          </div>
          {request.technician && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wrench className="h-4 w-4" />
              <span>{request.technician.name} • {request.technician.phone}</span>
            </div>
          )}
        </div>

        {['pending', 'assigned', 'en-route', 'in-progress', 'arrived'].includes(request.status || '') && (
          <Link to={`/request-tracking/${request.id}`}>
            <Button variant="outline" size="sm" className="w-full">
              Track Request
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Service Requests</h1>
          <p className="text-muted-foreground">Track and manage your roadside assistance requests</p>
        </div>
        <Badge 
          variant="outline" 
          className={`text-xs ${isConnected ? 'border-green-500 text-green-600' : 'border-yellow-500 text-yellow-600'}`}
        >
          {isConnected ? (
            <>
              <Wifi className="h-3 w-3 mr-1" />
              Live Updates
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 mr-1" />
              Connecting...
            </>
          )}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="active" className="gap-2">
            <Clock className="h-4 w-4" />
            Active ({activeRequests.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            History ({completedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {activeRequests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No active requests</h3>
                <p className="text-muted-foreground mb-6">
                  You don't have any ongoing service requests at the moment.
                </p>
                <Link to="/services">
                  <Button>Request Service</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeRequests.map(renderRequestCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          {completedRequests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No completed requests</h3>
                <p className="text-muted-foreground">
                  Your completed service requests will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {completedRequests.map(renderRequestCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyRequests;
