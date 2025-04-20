
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { MapPin, AlertCircle, Car, Bike, Truck, Check, Info } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import TechnicianSelection from "./TechnicianSelection";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

// Mock service data - this would come from your backend
const services = {
  "towing": {
    name: "Towing Service",
    description: "Vehicle breakdown? Our towing service quickly transports your vehicle to the nearest repair shop or your preferred location.",
    estimatedPrice: "₹599 - ₹1,499"
  },
  "flat-tire": {
    name: "Flat Tire Repair",
    description: "Experienced technicians will fix or replace your flat tire on the spot to get you back on the road quickly.",
    estimatedPrice: "₹349 - ₹699"
  },
  "battery": {
    name: "Battery Jumpstart",
    description: "Dead battery? Our technicians will jumpstart your vehicle or provide a replacement battery if needed.",
    estimatedPrice: "₹399 - ₹899"
  },
  "mechanical": {
    name: "Mechanical Issues",
    description: "Our skilled mechanics can diagnose and fix common mechanical problems on the spot.",
    estimatedPrice: "₹499 - ₹1,299+"
  },
  "fuel": {
    name: "Fuel Delivery",
    description: "Run out of fuel? We'll deliver the fuel you need to get back on the road.",
    estimatedPrice: "₹299 - ₹599"
  },
  "lockout": {
    name: "Lockout Assistance",
    description: "Locked your keys inside? Our specialists will help you regain access to your vehicle safely.",
    estimatedPrice: "₹399 - ₹799"
  },
  "winching": {
    name: "Winching Services",
    description: "Vehicle stuck in mud, snow, or a ditch? Our winching service will pull you out safely.",
    estimatedPrice: "₹599 - ₹1,499"
  },
  "other": {
    name: "Other Service",
    description: "Need another type of assistance? Contact us for any roadside emergency.",
    estimatedPrice: "Varies"
  }
};

const vehicleTypes = [
  { 
    id: "car",
    name: "Cars", 
    icon: Car,
    subtypes: ["SUV", "Hatchback", "Sedan", "MPV", "Other Cars"] 
  },
  { 
    id: "bike",
    name: "Motorcycles/Bikes", 
    icon: Bike,
    subtypes: ["Sport Bike", "Cruiser", "Commuter", "Scooter", "Other Bikes"] 
  },
  { 
    id: "commercial",
    name: "Commercial Vehicles", 
    icon: Truck,
    subtypes: ["Truck", "Van", "Bus", "Construction Vehicle", "Other Commercial"] 
  },
];

const ServiceRequest = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    vehicleType: "",
    vehicleSubtype: "",
    vehicleModel: "",
    location: "",
    details: "",
    selectedTechnicianId: ""
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

  const handleVehicleTypeSelect = (type: string) => {
    setFormData({
      ...formData,
      vehicleType: type,
      vehicleSubtype: "" // Reset subtype when type changes
    });
  };

  const handleVehicleSubtypeSelect = (subtype: string) => {
    setFormData({
      ...formData,
      vehicleSubtype: subtype
    });
  };

  const handleTechnicianSelect = (technicianId: string) => {
    setFormData({
      ...formData,
      selectedTechnicianId: technicianId
    });
    // Move to next step
    setStep(step + 1);
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
      if (!formData.vehicleType) {
        toast({
          title: "Missing information",
          description: "Please select your vehicle type.",
          variant: "destructive"
        });
        return;
      }
      if (!formData.vehicleSubtype) {
        toast({
          title: "Missing information",
          description: "Please select your vehicle subtype.",
          variant: "destructive"
        });
        return;
      }
      if (!formData.vehicleModel) {
        toast({
          title: "Missing information",
          description: "Please provide your vehicle make & model.",
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

  const renderProgress = () => {
    const totalSteps = 5;
    
    return (
      <div className="relative mb-10">
        <div className="flex justify-between mb-2">
          {[...Array(totalSteps)].map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                  ${index + 1 <= step ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}
              >
                {index + 1 <= step ? (
                  <Check className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-xs mt-1 font-medium text-center text-gray-500">
                {index === 0 ? "Personal" : 
                 index === 1 ? "Vehicle" : 
                 index === 2 ? "Location" :
                 index === 3 ? "Technician" : "Confirm"}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0">
          <div 
            className="h-0.5 bg-red-600 transition-all" 
            style={{ width: `${(step - 1) / (totalSteps - 1) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-12">
      <Card className="border border-gray-200 overflow-hidden shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              {serviceId && services[serviceId as keyof typeof services]?.name === "Towing Service" && 
                <MapPin className="h-6 w-6" />}
              {serviceId && services[serviceId as keyof typeof services]?.name === "Flat Tire Repair" && 
                <Car className="h-6 w-6" />}
              {serviceId && services[serviceId as keyof typeof services]?.name === "Battery Jumpstart" && 
                <Car className="h-6 w-6" />}
              {serviceId && services[serviceId as keyof typeof services]?.name !== "Towing Service" && 
               services[serviceId as keyof typeof services]?.name !== "Flat Tire Repair" && 
               services[serviceId as keyof typeof services]?.name !== "Battery Jumpstart" && 
                <Car className="h-6 w-6" />}
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">{service.name}</CardTitle>
              <CardDescription className="text-white/80 mt-1">{service.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {renderProgress()}
          
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      placeholder="Enter your full name"
                      className="border-gray-300 focus:border-red-500 focus:ring focus:ring-red-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      placeholder="Enter your phone number"
                      className="border-gray-300 focus:border-red-500 focus:ring focus:ring-red-200"
                      required
                    />
                    <p className="text-xs text-gray-500">We'll send updates about your service request to this number</p>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold mb-4">Vehicle Information</h2>
                
                <div className="space-y-4">
                  <Label>Vehicle Type</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {vehicleTypes.map((type) => (
                      <div
                        key={type.id}
                        className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                          ${formData.vehicleType === type.id 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-200 hover:border-red-300 hover:bg-red-50/30'}`}
                        onClick={() => handleVehicleTypeSelect(type.id)}
                      >
                        <div className={`p-3 rounded-full ${formData.vehicleType === type.id ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                          <type.icon className="h-6 w-6" />
                        </div>
                        <span className="font-medium text-center">{type.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {formData.vehicleType && (
                  <div className="space-y-4 animate-fade-in">
                    <Label>Vehicle Subtype</Label>
                    <div className="flex flex-wrap gap-2">
                      {vehicleTypes.find(t => t.id === formData.vehicleType)?.subtypes.map((subtype) => (
                        <Button
                          key={subtype}
                          type="button"
                          variant={formData.vehicleSubtype === subtype ? "default" : "outline"}
                          className={formData.vehicleSubtype === subtype ? "bg-red-600 hover:bg-red-700" : ""}
                          onClick={() => handleVehicleSubtypeSelect(subtype)}
                        >
                          {subtype}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="space-y-2 mt-6">
                      <Label htmlFor="vehicleModel">Vehicle Make & Model</Label>
                      <Input 
                        id="vehicleModel" 
                        name="vehicleModel" 
                        value={formData.vehicleModel} 
                        onChange={handleInputChange} 
                        placeholder="e.g., Toyota Camry, Honda CBR"
                        className="border-gray-300 focus:border-red-500 focus:ring focus:ring-red-200"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold mb-4">Your Location</h2>
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
                  <div className="p-4 bg-red-50 rounded-md mb-4 border border-red-100">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Detected Location:</p>
                        <p className="text-gray-700">{currentLocation}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="location">Address/Location Description</Label>
                  <Textarea 
                    id="location" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleInputChange} 
                    placeholder="Enter your precise location, nearby landmarks, or address"
                    className="min-h-[100px] border-gray-300 focus:border-red-500 focus:ring focus:ring-red-200"
                    required
                  />
                  <p className="text-xs text-gray-500">Please provide as much detail as possible to help the technician find you</p>
                </div>
              </div>
            )}

            {step === 4 && (
              <TechnicianSelection 
                serviceType={service.name} 
                onSelect={handleTechnicianSelect} 
              />
            )}

            {step === 5 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold mb-4">Request Summary</h2>
                
                <Card className="bg-red-50 border-red-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-red-700">Service Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Service:</span>
                        <span>{service.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Estimated Price:</span>
                        <span>{service.estimatedPrice}</span>
                      </div>
                      <p className="text-sm text-red-600/80 mt-1">Final price may vary based on specific requirements</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Selected Technician</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-gray-100">
                        <AvatarImage src="/placeholder.svg" alt="Technician" />
                        <AvatarFallback className="bg-red-100 text-red-800 font-semibold">
                          RT
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">Rajesh Kumar</h4>
                        <div className="flex items-center text-yellow-500">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3" fill="currentColor" />
                          ))}
                          <span className="ml-1 text-xs text-gray-600">4.8 (538 jobs)</span>
                        </div>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="text-xl font-bold text-red-600">₹599</div>
                        <div className="text-xs text-gray-500">Base Charge</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Your Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium">{formData.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{formData.phone}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Vehicle</p>
                        <p className="font-medium">
                          {formData.vehicleSubtype} {formData.vehicleModel}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{formData.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div>
                  <Label htmlFor="details">Additional Details (Optional)</Label>
                  <Textarea 
                    id="details" 
                    name="details" 
                    value={formData.details} 
                    onChange={handleInputChange} 
                    placeholder="Any additional information about your situation that might help our technician"
                    className="min-h-[80px] border-gray-300 focus:border-red-500 focus:ring focus:ring-red-200"
                  />
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                  <p className="text-sm text-yellow-700">
                    By submitting this request, you agree to our terms of service and privacy policy.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              {step > 1 && step !== 4 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
              )}
              {step < 4 ? (
                <Button type="button" className="bg-red-600 hover:bg-red-700 ml-auto" onClick={nextStep}>
                  Next
                </Button>
              ) : step === 5 ? (
                <Button type="submit" className="bg-red-600 hover:bg-red-700 ml-auto">
                  Confirm and Submit
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceRequest;
