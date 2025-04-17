
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  MapPin, 
  User, 
  Phone, 
  Clock, 
  Car, 
  Wrench, 
  CheckCircle2, 
  CircleDot
} from "lucide-react";
import { Button } from "./ui/button";

// Mock data - in a real app this would come from your backend
const mockTechnician = {
  id: "tech123",
  name: "Alex Johnson",
  phone: "+1 (555) 987-6543",
  rating: 4.8,
  image: "https://randomuser.me/api/portraits/men/32.jpg",
  vehicle: "Service Truck - White Ford F-150",
  licensePlate: "ABC 1234",
  currentLocation: { lat: 34.053, lng: -118.243 },
  estimatedArrival: "15 minutes",
};

const RequestTracking = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const [status, setStatus] = useState("assigned"); // assigned, en-route, arrived, completed
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // In a real app, you would fetch the request details and technician info from your backend
  
  useEffect(() => {
    // Update the elapsed time every minute
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 60000);
    
    // Simulate technician status updates
    const statusTimer = setTimeout(() => {
      setStatus("en-route");
      
      setTimeout(() => {
        setStatus("arrived");
        
        setTimeout(() => {
          setStatus("completed");
        }, 120000); // Completed after 2 more minutes
      }, 300000); // Arrived after 5 minutes
    }, 180000); // En-route after 3 minutes
    
    return () => {
      clearInterval(timer);
      clearTimeout(statusTimer);
    };
  }, []);
  
  // Format elapsed time
  const formatElapsedTime = () => {
    if (elapsedTime < 60) {
      return `${elapsedTime} min`;
    } else {
      const hours = Math.floor(elapsedTime / 60);
      const minutes = elapsedTime % 60;
      return `${hours}h ${minutes}m`;
    }
  };
  
  return (
    <div className="container max-w-3xl py-12">
      <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-red-600 text-white p-6">
          <h1 className="text-2xl font-bold">Tracking Your Request</h1>
          <p className="mt-2">Request #{requestId}</p>
        </div>
        
        <div className="p-6">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status !== "pending" ? "bg-green-500" : "bg-gray-300"}`}>
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div className={`h-1 w-16 ${status !== "pending" ? "bg-green-500" : "bg-gray-300"}`}></div>
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status === "en-route" || status === "arrived" || status === "completed" ? "bg-green-500" : status === "assigned" ? "bg-yellow-500" : "bg-gray-300"}`}>
                {status === "en-route" || status === "arrived" || status === "completed" ? (
                  <CheckCircle2 className="h-6 w-6 text-white" />
                ) : (
                  <CircleDot className="h-6 w-6 text-white" />
                )}
              </div>
              <div className={`h-1 w-16 ${status === "en-route" || status === "arrived" || status === "completed" ? "bg-green-500" : "bg-gray-300"}`}></div>
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status === "arrived" || status === "completed" ? "bg-green-500" : status === "en-route" ? "bg-yellow-500" : "bg-gray-300"}`}>
                {status === "arrived" || status === "completed" ? (
                  <CheckCircle2 className="h-6 w-6 text-white" />
                ) : (
                  <CircleDot className="h-6 w-6 text-white" />
                )}
              </div>
              <div className={`h-1 w-16 ${status === "completed" ? "bg-green-500" : "bg-gray-300"}`}></div>
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status === "completed" ? "bg-green-500" : status === "arrived" ? "bg-yellow-500" : "bg-gray-300"}`}>
                {status === "completed" ? (
                  <CheckCircle2 className="h-6 w-6 text-white" />
                ) : (
                  <CircleDot className="h-6 w-6 text-white" />
                )}
              </div>
            </div>
            
            <div className="flex justify-between text-sm px-1">
              <div className="text-center">
                <p className="font-medium">Assigned</p>
                <p className="text-gray-500">Technician ready</p>
              </div>
              <div className="text-center">
                <p className="font-medium">En Route</p>
                <p className="text-gray-500">On the way</p>
              </div>
              <div className="text-center">
                <p className="font-medium">Arrived</p>
                <p className="text-gray-500">Service started</p>
              </div>
              <div className="text-center">
                <p className="font-medium">Completed</p>
                <p className="text-gray-500">Service finished</p>
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
                  ★★★★★ <span className="text-gray-600 text-sm ml-1">{mockTechnician.rating}</span>
                </div>
                <p className="text-sm text-gray-600">{mockTechnician.vehicle}</p>
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
            <h3 className="font-semibold mb-2">Status Updates</h3>
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
              
              {status === "en-route" || status === "arrived" || status === "completed" ? (
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Car className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Technician En Route</p>
                    <p className="text-sm text-gray-600">
                      {mockTechnician.name} is on the way to your location
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{formatElapsedTime()} ago</p>
                  </div>
                </div>
              ) : null}
              
              {status === "arrived" || status === "completed" ? (
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Technician Arrived</p>
                    <p className="text-sm text-gray-600">
                      {mockTechnician.name} has arrived at your location
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{formatElapsedTime()} ago</p>
                  </div>
                </div>
              ) : null}
              
              {status === "completed" ? (
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Service Completed</p>
                    <p className="text-sm text-gray-600">
                      Your service has been successfully completed
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{formatElapsedTime()} ago</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestTracking;
