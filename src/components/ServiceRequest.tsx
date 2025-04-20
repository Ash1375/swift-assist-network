import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Check, MapPin, Car } from "lucide-react";
import { ServiceRequestFormData, ServiceType } from "./service-request/types";
import PersonalInfoStep from "./service-request/PersonalInfoStep";
import VehicleInfoStep from "./service-request/VehicleInfoStep";
import LocationStep from "./service-request/LocationStep";
import TechnicianSelection from "./technician/TechnicianSelection";
import ConfirmationStep from "./service-request/ConfirmationStep";

const services: Record<string, ServiceType> = {
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

const ServiceRequest = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<ServiceRequestFormData>({
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
  
  const service = serviceId && services[serviceId] ? services[serviceId] : services.other;

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
      vehicleSubtype: ""
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
    setStep(step + 1);
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
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

  const validateStep = () => {
    if (step === 1 && (!formData.name || !formData.phone)) {
      toast({
        title: "Missing information",
        description: "Please provide your name and phone number.",
        variant: "destructive"
      });
      return false;
    }
    if (step === 2 && (!formData.vehicleType || !formData.vehicleSubtype || !formData.vehicleModel)) {
      toast({
        title: "Missing information",
        description: "Please complete all vehicle information.",
        variant: "destructive"
      });
      return false;
    }
    if (step === 3 && !formData.location) {
      toast({
        title: "Missing information",
        description: "Please provide your location.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    toast({
      title: "Service requested!",
      description: "Your request has been submitted. A technician will be assigned shortly.",
    });
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
  };

  return (
    <div className="container max-w-3xl py-12">
      <Card className="border border-gray-200 overflow-hidden shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              {serviceId && services[serviceId]?.name === "Towing Service" && 
                <MapPin className="h-6 w-6" />}
              {serviceId && services[serviceId]?.name === "Flat Tire Repair" && 
                <Car className="h-6 w-6" />}
              {serviceId && services[serviceId]?.name === "Battery Jumpstart" && 
                <Car className="h-6 w-6" />}
              {serviceId && services[serviceId]?.name !== "Towing Service" && 
               services[serviceId]?.name !== "Flat Tire Repair" && 
               services[serviceId]?.name !== "Battery Jumpstart" && 
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
              <PersonalInfoStep 
                formData={formData}
                onInputChange={handleInputChange}
              />
            )}

            {step === 2 && (
              <VehicleInfoStep 
                formData={formData}
                onInputChange={handleInputChange}
                onVehicleTypeSelect={handleVehicleTypeSelect}
                onVehicleSubtypeSelect={handleVehicleSubtypeSelect}
              />
            )}

            {step === 3 && (
              <LocationStep 
                formData={formData}
                onInputChange={handleInputChange}
                currentLocation={currentLocation}
                isGettingLocation={isGettingLocation}
                onGetCurrentLocation={getCurrentLocation}
              />
            )}

            {step === 4 && (
              <TechnicianSelection 
                serviceType={service.name} 
                onSelect={handleTechnicianSelect} 
              />
            )}

            {step === 5 && (
              <ConfirmationStep 
                service={service}
                formData={formData}
                onInputChange={handleInputChange}
              />
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
