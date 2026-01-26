import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Phone, CheckCircle, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { useTechnicianAuth } from "@/contexts/TechnicianAuthContext";
import { useRealtimeTechnicianRequests } from "@/hooks/useRealtimeTechnicianRequests";
import { useMemo } from "react";

const ServiceRequestsTab = () => {
  const { technician } = useTechnicianAuth();
  
  // Real-time subscription options
  const realtimeOptions = useMemo(() => ({
    onNewRequest: (request: any) => {
      console.log('New request notification:', request);
    },
    onRequestUpdated: (request: any) => {
      console.log('Request updated:', request);
    }
  }), []);

  const { 
    requests, 
    isLoading, 
    isConnected,
    refresh,
    updateRequestStatus 
  } = useRealtimeTechnicianRequests(technician?.id, realtimeOptions);

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    await updateRequestStatus(requestId, newStatus);
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'assigned':
        return <Badge className="bg-blue-500">Assigned</Badge>;
      case 'en-route':
        return <Badge className="bg-amber-500">En Route</Badge>;
      case 'in-progress':
        return <Badge className="bg-purple-500">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      default:
        return <Badge>{status || 'Unknown'}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>Service Requests</CardTitle>
            <Badge 
              variant="outline" 
              className={`text-xs ${isConnected ? 'border-green-500 text-green-600' : 'border-yellow-500 text-yellow-600'}`}
            >
              {isConnected ? (
                <>
                  <Wifi className="h-3 w-3 mr-1" />
                  Live
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 mr-1" />
                  Connecting
                </>
              )}
            </Badge>
          </div>
          <CardDescription>
            View and respond to customer service requests in real-time
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={refresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No pending requests</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              There are no service requests available at this moment. New requests will appear here when customers need assistance.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{request.service_type}</h4>
                    <p className="text-sm text-muted-foreground">
                      {request.vehicle_type} - {request.vehicle_model}
                    </p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{request.address || 'Address not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{request.contact_phone || 'No phone'}</span>
                  </div>
                  {request.description && (
                    <p className="text-muted-foreground mt-2">{request.description}</p>
                  )}
                </div>
                
                <div className="flex gap-2 mt-4">
                  {request.status === 'assigned' && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(request.id, 'en-route')}
                    >
                      Start Journey
                    </Button>
                  )}
                  {request.status === 'en-route' && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(request.id, 'in-progress')}
                    >
                      Mark Arrived
                    </Button>
                  )}
                  {request.status === 'in-progress' && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusUpdate(request.id, 'completed')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                  >
                    <a href={`tel:${request.contact_phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceRequestsTab;
