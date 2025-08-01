
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
  AlertCircle
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

// Mock data - in a real app this would come from your backend
const mockTechnician = {
  id: "tech123",
  name: "Rajesh Kumar",
  phone: "+91 98765 43210",
  rating: 4.8,
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  vehicle: "Service Van - Mahindra Bolero",
  licensePlate: "MH 12 AB 1234",
  currentLocation: { lat: 19.0760, lng: 72.8777 },
  estimatedArrival: "12 minutes",
  serviceCharge: 599,
  specialties: ["Towing", "Battery", "Flat Tire"]
};

const RequestTracking = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState("assigned"); // assigned, en-route, arrived, in-progress, completed, payment-pending, payment-completed
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  
  // In a real app, you would fetch the request details and technician info from your backend
  
  useEffect(() => {
    // Update the elapsed time every 10 seconds for demo purposes
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 10000);
    
    // Simulate technician status updates with realistic Indian timing
    const statusTimer1 = setTimeout(() => {
      setStatus("en-route");
    }, 15000); // En-route after 15 seconds (was 3 minutes)
    
    const statusTimer2 = setTimeout(() => {
      setStatus("arrived");
    }, 45000); // Arrived after 45 seconds (was 5 minutes)
    
    const statusTimer3 = setTimeout(() => {
      setStatus("in-progress");
    }, 60000); // Started work after 1 minute
    
    const statusTimer4 = setTimeout(() => {
      setStatus("completed");
    }, 120000); // Completed after 2 minutes
    
    const statusTimer5 = setTimeout(() => {
      setStatus("payment-pending");
      setShowPayment(true);
    }, 125000); // Payment prompt after 2 minutes 5 seconds
    
    return () => {
      clearInterval(timer);
      clearTimeout(statusTimer1);
      clearTimeout(statusTimer2);
      clearTimeout(statusTimer3);
      clearTimeout(statusTimer4);
      clearTimeout(statusTimer5);
    };
  }, []);
  
  // Format elapsed time (showing seconds for demo)
  const formatElapsedTime = () => {
    if (elapsedTime < 6) {
      return `${elapsedTime * 10} sec`;
    } else {
      const minutes = Math.floor(elapsedTime / 6);
      const seconds = (elapsedTime % 6) * 10;
      return `${minutes}m ${seconds}s`;
    }
  };
  
  const handlePayment = () => {
    // Simulate payment processing
    setStatus("payment-completed");
    setShowPayment(false);
    
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };
  
  return (
    <div className="container max-w-3xl py-12">
      <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-red-600 text-white p-6">
          <h1 className="text-2xl font-bold">Tracking Your Request</h1>
          <p className="mt-2">Request #{requestId}</p>
        </div>
        
        <div className="p-6">
          {/* Payment Card - Shows when service is completed */}
          {showPayment && status === "payment-pending" && (
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
                    <span className="text-xl font-bold text-green-600">₹{mockTechnician.serviceCharge}</span>
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

          {status === "payment-completed" && (
            <Card className="mb-6 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="p-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-green-800 mb-2">Payment Successful!</h3>
                <p className="text-sm text-green-600 mb-4">Thank you for using TowBuddy. Your request has been completed.</p>
                <Badge className="bg-green-600">Transaction ID: TXN{Date.now().toString().slice(-8)}</Badge>
              </CardContent>
            </Card>
          )}

          <div className="mb-8">
            <div className="flex items-center mb-4 overflow-x-auto">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center min-w-[40px] ${status !== "pending" ? "bg-green-500" : "bg-gray-300"}`}>
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div className={`h-1 w-16 ${status !== "pending" ? "bg-green-500" : "bg-gray-300"}`}></div>
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center min-w-[40px] ${["en-route", "arrived", "in-progress", "completed", "payment-pending", "payment-completed"].includes(status) ? "bg-green-500" : status === "assigned" ? "bg-yellow-500 animate-pulse" : "bg-gray-300"}`}>
                {["en-route", "arrived", "in-progress", "completed", "payment-pending", "payment-completed"].includes(status) ? (
                  <CheckCircle2 className="h-6 w-6 text-white" />
                ) : (
                  <CircleDot className="h-6 w-6 text-white" />
                )}
              </div>
              <div className={`h-1 w-16 ${["en-route", "arrived", "in-progress", "completed", "payment-pending", "payment-completed"].includes(status) ? "bg-green-500" : "bg-gray-300"}`}></div>
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center min-w-[40px] ${["arrived", "in-progress", "completed", "payment-pending", "payment-completed"].includes(status) ? "bg-green-500" : status === "en-route" ? "bg-yellow-500 animate-pulse" : "bg-gray-300"}`}>
                {["arrived", "in-progress", "completed", "payment-pending", "payment-completed"].includes(status) ? (
                  <CheckCircle2 className="h-6 w-6 text-white" />
                ) : (
                  <CircleDot className="h-6 w-6 text-white" />
                )}
              </div>
              <div className={`h-1 w-16 ${["in-progress", "completed", "payment-pending", "payment-completed"].includes(status) ? "bg-green-500" : "bg-gray-300"}`}></div>
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center min-w-[40px] ${["completed", "payment-pending", "payment-completed"].includes(status) ? "bg-green-500" : status === "in-progress" ? "bg-yellow-500 animate-pulse" : status === "arrived" ? "bg-blue-500 animate-pulse" : "bg-gray-300"}`}>
                {["completed", "payment-pending", "payment-completed"].includes(status) ? (
                  <CheckCircle2 className="h-6 w-6 text-white" />
                ) : (
                  <CircleDot className="h-6 w-6 text-white" />
                )}
              </div>
              <div className={`h-1 w-16 ${["payment-pending", "payment-completed"].includes(status) ? "bg-green-500" : "bg-gray-300"}`}></div>
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center min-w-[40px] ${status === "payment-completed" ? "bg-green-500" : status === "payment-pending" ? "bg-orange-500 animate-pulse" : "bg-gray-300"}`}>
                {status === "payment-completed" ? (
                  <CheckCircle2 className="h-6 w-6 text-white" />
                ) : (
                  <CreditCard className="h-6 w-6 text-white" />
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-2 text-xs px-1">
              <div className="text-center">
                <p className="font-medium">Assigned</p>
                <p className="text-gray-500">Ready</p>
              </div>
              <div className="text-center">
                <p className="font-medium">En Route</p>
                <p className="text-gray-500">Coming</p>
              </div>
              <div className="text-center">
                <p className="font-medium">Arrived</p>
                <p className="text-gray-500">Started</p>
              </div>
              <div className="text-center">
                <p className="font-medium">Completed</p>
                <p className="text-gray-500">Finished</p>
              </div>
              <div className="text-center">
                <p className="font-medium">Payment</p>
                <p className="text-gray-500">Done</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="mr-4">
                <img 
                  src={mockTechnician.image} 
                  alt={mockTechnician.name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-red-600" 
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{mockTechnician.name}</h2>
                <div className="flex items-center text-yellow-500 mb-1">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-4 w-4" fill="currentColor" />
                  ))}
                  <span className="text-gray-600 text-sm ml-1">{mockTechnician.rating}</span>
                </div>
                <p className="text-sm text-gray-600">{mockTechnician.vehicle}</p>
                <div className="flex gap-2 mt-1">
                  {mockTechnician.specialties.map((specialty) => (
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
                <span>{mockTechnician.phone}</span>
              </div>
              <div className="flex items-center">
                <Car className="h-5 w-5 text-red-600 mr-2" />
                <span>{mockTechnician.licensePlate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-red-600 mr-2" />
                <span>ETA: {mockTechnician.estimatedArrival}</span>
              </div>
              <div className="flex items-center">
                <Wrench className="h-5 w-5 text-red-600 mr-2" />
                <span>Flat Tire Repair</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Button className="w-full bg-red-600 hover:bg-red-700">
                <Phone className="mr-2 h-4 w-4" />
                Call Technician
              </Button>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-100 rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-3">Live Location Tracking</h3>
            <div className="bg-gray-200 h-64 rounded-md flex items-center justify-center">
              <p className="text-gray-600">
                Map will be displayed here. In a real app, this would show a live map with the technician's location.
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Live Status Updates</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Technician Assigned</p>
                  <p className="text-sm text-gray-600">
                    {mockTechnician.name} has been assigned to your request
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Just now</p>
                </div>
              </div>
              
              {["en-route", "arrived", "in-progress", "completed", "payment-pending", "payment-completed"].includes(status) && (
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Car className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Technician En Route</p>
                    <p className="text-sm text-gray-600">
                      {mockTechnician.name} is on the way to your location
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{formatElapsedTime()} ago</p>
                  </div>
                </div>
              )}
              
              {["arrived", "in-progress", "completed", "payment-pending", "payment-completed"].includes(status) && (
                <div className="flex items-start">
                  <div className="bg-orange-100 p-2 rounded-full mr-3">
                    <MapPin className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Technician Arrived</p>
                    <p className="text-sm text-gray-600">
                      {mockTechnician.name} has arrived at your location and started the diagnosis
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{formatElapsedTime()} ago</p>
                  </div>
                </div>
              )}
              
              {["in-progress", "completed", "payment-pending", "payment-completed"].includes(status) && (
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <Wrench className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Service In Progress</p>
                    <p className="text-sm text-gray-600">
                      {mockTechnician.name} is working on your vehicle
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{formatElapsedTime()} ago</p>
                  </div>
                </div>
              )}
              
              {["completed", "payment-pending", "payment-completed"].includes(status) && (
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Service Completed</p>
                    <p className="text-sm text-gray-600">
                      Your flat tire has been successfully repaired. Vehicle is ready to drive!
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{formatElapsedTime()} ago</p>
                  </div>
                </div>
              )}
              
              {status === "payment-pending" && (
                <div className="flex items-start">
                  <div className="bg-orange-100 p-2 rounded-full mr-3 animate-pulse">
                    <CreditCard className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-orange-800">Payment Required</p>
                    <p className="text-sm text-gray-600">
                      Please complete the payment to finish your service request
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Now</p>
                  </div>
                </div>
              )}
              
              {status === "payment-completed" && (
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Payment Successful</p>
                    <p className="text-sm text-gray-600">
                      Thank you! Your service request has been completed successfully.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Just now</p>
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
