import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  MapPin, 
  User, 
  Phone, 
  Clock, 
  Car, 
  Wrench, 
  CheckCircle2, 
  CircleDot,
  CreditCard,
  Star,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface ServiceRequest {
  id: string;
  service_type: string;
  vehicle_type: string;
  vehicle_model: string;
  address: string;
  description: string;
  contact_name: string;
  contact_phone: string;
  status: string;
  payment_status: string;
  created_at: string;
  technician_id: string | null;
}

interface Technician {
  id: string;
  name: string;
  phone: string;
  rating: number;
  specialties: string[];
  avatar_url: string | null;
}

const RequestTracking = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  
  const fetchRequestData = async () => {
    if (!requestId) return;
    
    setIsLoading(true);
    try {
      const { data: requestData, error: requestError } = await supabase
        .from('service_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (requestError) throw requestError;
      setRequest(requestData);

      // Fetch technician if assigned
      if (requestData.technician_id) {
        const { data: techData, error: techError } = await supabase
          .from('technicians')
          .select('id, name, phone, rating, specialties, avatar_url')
          .eq('id', requestData.technician_id)
          .single();

        if (!techError && techData) {
          setTechnician(techData);
        }
      }

      // Check if payment is pending
      if (requestData.status === 'completed' && requestData.payment_status === 'pending') {
        setShowPayment(true);
      }
    } catch (error) {
      console.error('Error fetching request:', error);
      toast.error('Failed to load request details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestData();
    
    // Poll for updates every 30 seconds
    const pollInterval = setInterval(fetchRequestData, 30000);
    
    // Update elapsed time
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 10000);
    
    return () => {
      clearInterval(pollInterval);
      clearInterval(timer);
    };
  }, [requestId]);
  
  const formatElapsedTime = () => {
    if (elapsedTime < 6) {
      return `${elapsedTime * 10} sec`;
    } else {
      const minutes = Math.floor(elapsedTime / 6);
      const seconds = (elapsedTime % 6) * 10;
      return `${minutes}m ${seconds}s`;
    }
  };
  
  const handlePayment = async () => {
    if (!request) return;
    
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ 
          payment_status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (error) throw error;
      
      setShowPayment(false);
      toast.success('Payment completed successfully!');
      
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Payment failed. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-3xl py-12">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container max-w-3xl py-12">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Request Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The service request you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = request.status;
  const paymentCompleted = request.payment_status === 'completed';
  
  return (
    <div className="container max-w-3xl py-12">
      <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-red-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Tracking Your Request</h1>
              <p className="mt-2">Request #{requestId?.slice(0, 8)}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchRequestData}
              className="text-white border-white hover:bg-white/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          {/* Payment Card - Shows when service is completed */}
          {showPayment && status === "completed" && !paymentCompleted && (
            <Card className="mb-6 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <CreditCard className="h-5 w-5" />
                  Payment Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                    <span className="font-medium">Service Charge:</span>
                    <span className="text-xl font-bold text-green-600">₹599</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-800">Service Completed Successfully!</p>
                      <p className="text-xs text-blue-600">Please proceed with payment to complete your request</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      className="bg-green-600 hover:bg-green-700" 
                      onClick={handlePayment}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay Now
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-orange-300 text-orange-700 hover:bg-orange-50"
                    >
                      Pay Later
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {paymentCompleted && (
            <Card className="mb-6 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="p-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-green-800 mb-2">Payment Successful!</h3>
                <p className="text-sm text-green-600 mb-4">Thank you for using TowBuddy. Your request has been completed.</p>
                <Badge className="bg-green-600">Transaction Complete</Badge>
              </CardContent>
            </Card>
          )}

          {/* Status Progress */}
          <div className="mb-8">
            <div className="flex items-center mb-4 overflow-x-auto">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center min-w-[40px] ${status !== "pending" ? "bg-green-500" : "bg-yellow-500 animate-pulse"}`}>
                {status !== "pending" ? <CheckCircle2 className="h-6 w-6 text-white" /> : <CircleDot className="h-6 w-6 text-white" />}
              </div>
              <div className={`h-1 w-16 ${["assigned", "en-route", "arrived", "in-progress", "completed"].includes(status) ? "bg-green-500" : "bg-gray-300"}`}></div>
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center min-w-[40px] ${["en-route", "arrived", "in-progress", "completed"].includes(status) ? "bg-green-500" : status === "assigned" ? "bg-yellow-500 animate-pulse" : "bg-gray-300"}`}>
                {["en-route", "arrived", "in-progress", "completed"].includes(status) ? <CheckCircle2 className="h-6 w-6 text-white" /> : <CircleDot className="h-6 w-6 text-white" />}
              </div>
              <div className={`h-1 w-16 ${["arrived", "in-progress", "completed"].includes(status) ? "bg-green-500" : "bg-gray-300"}`}></div>
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center min-w-[40px] ${["in-progress", "completed"].includes(status) ? "bg-green-500" : status === "arrived" ? "bg-yellow-500 animate-pulse" : "bg-gray-300"}`}>
                {["in-progress", "completed"].includes(status) ? <CheckCircle2 className="h-6 w-6 text-white" /> : <CircleDot className="h-6 w-6 text-white" />}
              </div>
              <div className={`h-1 w-16 ${status === "completed" ? "bg-green-500" : "bg-gray-300"}`}></div>
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center min-w-[40px] ${status === "completed" ? "bg-green-500" : status === "in-progress" ? "bg-yellow-500 animate-pulse" : "bg-gray-300"}`}>
                {status === "completed" ? <CheckCircle2 className="h-6 w-6 text-white" /> : <Wrench className="h-6 w-6 text-white" />}
              </div>
              <div className={`h-1 w-16 ${paymentCompleted ? "bg-green-500" : "bg-gray-300"}`}></div>
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center min-w-[40px] ${paymentCompleted ? "bg-green-500" : status === "completed" && !paymentCompleted ? "bg-orange-500 animate-pulse" : "bg-gray-300"}`}>
                {paymentCompleted ? <CheckCircle2 className="h-6 w-6 text-white" /> : <CreditCard className="h-6 w-6 text-white" />}
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-2 text-xs px-1">
              <div className="text-center">
                <p className="font-medium">Pending</p>
              </div>
              <div className="text-center">
                <p className="font-medium">Assigned</p>
              </div>
              <div className="text-center">
                <p className="font-medium">Arrived</p>
              </div>
              <div className="text-center">
                <p className="font-medium">Completed</p>
              </div>
              <div className="text-center">
                <p className="font-medium">Payment</p>
              </div>
            </div>
          </div>
          
          {/* Request Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-4">Service Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Wrench className="h-5 w-5 text-red-600 mr-2" />
                <span>{request.service_type}</span>
              </div>
              <div className="flex items-center">
                <Car className="h-5 w-5 text-red-600 mr-2" />
                <span>{request.vehicle_type} - {request.vehicle_model}</span>
              </div>
              <div className="flex items-center col-span-2">
                <MapPin className="h-5 w-5 text-red-600 mr-2" />
                <span>{request.address || 'Address not specified'}</span>
              </div>
            </div>
          </div>
          
          {/* Technician Info */}
          {technician ? (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <img 
                    src={technician.avatar_url || "/placeholder.svg"} 
                    alt={technician.name} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-red-600" 
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{technician.name}</h2>
                  <div className="flex items-center text-yellow-500 mb-1">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="h-4 w-4" fill={star <= (technician.rating || 0) ? "currentColor" : "none"} />
                    ))}
                    <span className="text-gray-600 text-sm ml-1">{technician.rating || 'N/A'}</span>
                  </div>
                  <div className="flex gap-2 mt-1">
                    {technician.specialties?.slice(0, 3).map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-red-600 mr-2" />
                  <span>{technician.phone}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-red-600 mr-2" />
                  <span>Elapsed: {formatElapsedTime()}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Button className="w-full bg-red-600 hover:bg-red-700" asChild>
                  <a href={`tel:${technician.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call Technician
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-center">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Technician Assignment Pending</h3>
              <p className="text-muted-foreground text-sm">
                A technician will be assigned to your request shortly.
              </p>
            </div>
          )}
          
          {/* Live Status Updates */}
          <div>
            <h3 className="font-semibold mb-2">Status Updates</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Request Created</p>
                  <p className="text-sm text-gray-600">Your service request has been submitted</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(request.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              
              {status !== 'pending' && (
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Technician Assigned</p>
                    <p className="text-sm text-gray-600">
                      {technician ? `${technician.name} has been assigned` : 'A technician has been assigned'}
                    </p>
                  </div>
                </div>
              )}
              
              {["en-route", "arrived", "in-progress", "completed"].includes(status) && (
                <div className="flex items-start">
                  <div className="bg-amber-100 p-2 rounded-full mr-3">
                    <Car className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">Technician En Route</p>
                    <p className="text-sm text-gray-600">On the way to your location</p>
                  </div>
                </div>
              )}
              
              {["arrived", "in-progress", "completed"].includes(status) && (
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Technician Arrived</p>
                    <p className="text-sm text-gray-600">Has arrived at your location</p>
                  </div>
                </div>
              )}
              
              {status === "completed" && (
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Service Completed</p>
                    <p className="text-sm text-gray-600">Your service has been completed successfully</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestTracking;
