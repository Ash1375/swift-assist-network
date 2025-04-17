
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { MapPin, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Mock service data - this would come from your backend
const services = {
  "towing": {
    name: "Towing Service",
    description: "Vehicle breakdown? Our towing service quickly transports your vehicle to the nearest repair shop or your preferred location.",
    estimatedPrice: "$75 - $150"
  },
  "flat-tire": {
    name: "Flat Tire Repair",
    description: "Experienced technicians will fix or replace your flat tire on the spot to get you back on the road quickly.",
    estimatedPrice: "$45 - $85"
  },
  "battery": {
    name: "Battery Jumpstart",
    description: "Dead battery? Our technicians will jumpstart your vehicle or provide a replacement battery if needed.",
    estimatedPrice: "$50 - $100"
  },
  "mechanical": {
    name: "Mechanical Issues",
    description: "Our skilled mechanics can diagnose and fix common mechanical problems on the spot.",
    estimatedPrice: "$60 - $120+"
  },
  "fuel": {
    name: "Fuel Delivery",
    description: "Run out of fuel? We'll deliver the fuel you need to get back on the road.",
    estimatedPrice: "$40 - $70"
  },
  "lockout": {
    name: "Lockout Assistance",
    description: "Locked your keys inside? Our specialists will help you regain access to your vehicle safely.",
    estimatedPrice: "$50 - $90"
  },
  "winching": {
    name: "Winching Services",
    description: "Vehicle stuck in mud, snow, or a ditch? Our winching service will pull you out safely.",
    estimatedPrice: "$75 - $150"
  },
  "other": {
    name: "Other Service",
    description: "Need another type of assistance? Contact us for any roadside emergency.",
    estimatedPrice: "Varies"
  }
};

const vehicleTypes = [
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "hatchback", label: "Hatchback" },
  { value: "mpv", label: "MPV" },
  { value: "bike", label: "Motorcycle/Bike" },
  { value: "truck", label: "Truck" },
  { value: "van", label: "Van" },
  { value: "bus", label: "Bus" },
  { value: "other", label: "Other" },
];

const ServiceRequest = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    vehicleType: "",
    vehicleModel: "",
    location: "",
    details: ""
  });
  
  const [currentLocation, setCurrentLocation] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [step, setStep] = useState(1);
  
  // Get current service based on URL param
  const service = serviceId && services[serviceId as keyof typeof services] 
    ? services[serviceId as keyof typeof services] 
    : services.other;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you would use a Maps API to reverse geocode these coordinates
          const locationText = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
          setCurrentLocation(locationText);
          setFormData({
            ...formData,
            location: locationText
          });
          setIsGettingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location error",
            description: "Unable to get your current location. Please enter it manually.",
            variant: "destructive"
          });
          setIsGettingLocation(false);
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation. Please enter your location manually.",
        variant: "destructive"
      });
      setIsGettingLocation(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.phone) {
        toast({
          title: "Missing information",
          description: "Please provide your name and phone number.",
          variant: "destructive"
        });
        return;
      }
    } else if (step === 2) {
      if (!formData.vehicleType || !formData.vehicleModel) {
        toast({
          title: "Missing information",
          description: "Please provide your vehicle details.",
          variant: "destructive"
        });
        return;
      }
    } else if (step === 3) {
      if (!formData.location) {
        toast({
          title: "Missing information",
          description: "Please provide your location.",
          variant: "destructive"
        });
        return;
      }
    }
    
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would send the form data to your backend
    console.log("Form submitted:", formData);
    
    // Show success message
    toast({
      title: "Service requested!",
      description: "Your request has been submitted. A technician will be assigned shortly.",
    });
    
    // Redirect to tracking page
    // In a real app, this would include the request ID
    navigate("/request-tracking/123");
  };

  return (
    <div className="container max-w-3xl py-12">
      <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-red-600 text-white p-6">
          <h1 className="text-2xl font-bold">{service.name}</h1>
          <p className="mt-2">{service.description}</p>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <div className={`h-1 w-12 ${step >= 2 ? 'bg-red-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
              <div className={`h-1 w-12 ${step >= 3 ? 'bg-red-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                3
              </div>
              <div className={`h-1 w-12 ${step >= 4 ? 'bg-red-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 4 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                4
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Vehicle Information</h2>
                <div>
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <select
                    id="vehicleType"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="" disabled>Select vehicle type</option>
                    {vehicleTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="vehicleModel">Vehicle Make & Model</Label>
                  <Input 
                    id="vehicleModel" 
                    name="vehicleModel" 
                    value={formData.vehicleModel} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Toyota Camry, Honda CBR"
                    required
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Location</h2>
                <div className="flex items-center gap-4 mb-4">
                  <Button 
                    type="button" 
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    {isGettingLocation ? "Getting Location..." : "Use Current Location"}
                  </Button>
                  <span className="text-sm text-gray-500">or enter manually</span>
                </div>
                
                {currentLocation && (
                  <div className="p-4 bg-gray-50 rounded-md mb-4">
                    <p className="text-sm">
                      <span className="font-medium">Detected Location:</span> {currentLocation}
                    </p>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="location">Address/Location Description</Label>
                  <Textarea 
                    id="location" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleInputChange} 
                    placeholder="Enter your precise location, nearby landmarks, or address"
                    className="min-h-[100px]"
                    required
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Request Summary</h2>
                
                <div className="p-4 bg-gray-50 rounded-md mb-4">
                  <h3 className="font-semibold text-lg mb-2">Service Details</h3>
                  <p><span className="font-medium">Service:</span> {service.name}</p>
                  <p><span className="font-medium">Estimated Price:</span> {service.estimatedPrice}</p>
                  <p className="text-sm text-gray-500 mt-1">Final price may vary based on specific requirements</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-md mb-4">
                  <h3 className="font-semibold text-lg mb-2">Your Information</h3>
                  <p><span className="font-medium">Name:</span> {formData.name}</p>
                  <p><span className="font-medium">Phone:</span> {formData.phone}</p>
                  <p><span className="font-medium">Vehicle:</span> {formData.vehicleType} - {formData.vehicleModel}</p>
                  <p><span className="font-medium">Location:</span> {formData.location}</p>
                </div>
                
                <div>
                  <Label htmlFor="details">Additional Details (Optional)</Label>
                  <Textarea 
                    id="details" 
                    name="details" 
                    value={formData.details} 
                    onChange={handleInputChange} 
                    placeholder="Any additional information about your situation that might help our technician"
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                  <p className="text-sm text-yellow-700">
                    By submitting this request, you agree to our terms of service and privacy policy.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
              )}
              {step < 4 ? (
                <Button type="button" className="bg-red-600 hover:bg-red-700 ml-auto" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit" className="bg-red-600 hover:bg-red-700 ml-auto">
                  Submit Request
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequest;
