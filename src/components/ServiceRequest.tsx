import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Check, MapPin, Car, User, Wrench, CreditCard } from "lucide-react";
import LiveProgressTracker from "./service-request/LiveProgressTracker";
import { ServiceRequestFormData, ServiceType } from "./service-request/types";
import PersonalInfoStep from "./service-request/PersonalInfoStep";
import VehicleInfoStep from "./service-request/VehicleInfoStep";
import LocationStep from "./service-request/LocationStep";
import TechnicianSelection from "./TechnicianSelection";
import PaymentStep, { PaymentData } from "./service-request/PaymentStep";
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

const stepDetails = [
  {
    name: "Personal",
    icon: (active: boolean, completed: boolean) => (
      <div className={`rounded-full border-4 flex items-center justify-center transition-all duration-300
        ${completed ? "bg-gradient-to-br from-green-400 via-green-500 to-green-600 border-green-200 shadow-xl animate-glow"
          : active ? "bg-gradient-to-br from-red-400 via-red-500 to-red-600 border-red-200 shadow-lg animate-glow"
          : "bg-gray-200 border-gray-100"}
      `}>
        <User className={`h-6 w-6 ${completed || active ? "text-white" : "text-gray-400"}`} />
      </div>
    ),
    tooltip: "Enter your personal details"
  },
  {
    name: "Vehicle",
    icon: (active: boolean, completed: boolean) => (
      <div className={`rounded-full border-4 flex items-center justify-center transition-all duration-300
        ${completed ? "bg-gradient-to-br from-green-400 via-green-500 to-green-600 border-green-200 shadow-xl animate-glow"
          : active ? "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 border-yellow-200 shadow-lg animate-glow"
          : "bg-gray-200 border-gray-100"}
      `}>
        <Car className={`h-6 w-6 ${completed || active ? "text-white" : "text-gray-400"}`} />
      </div>
    ),
    tooltip: "Enter your vehicle details"
  },
  {
    name: "Location",
    icon: (active: boolean, completed: boolean) => (
      <div className={`rounded-full border-4 flex items-center justify-center transition-all duration-300
        ${completed ? "bg-gradient-to-br from-green-400 via-green-500 to-green-600 border-green-200 shadow-xl animate-glow"
          : active ? "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 border-blue-200 shadow-lg animate-glow"
          : "bg-gray-200 border-gray-100"}
      `}>
        <MapPin className={`h-6 w-6 ${completed || active ? "text-white" : "text-gray-400"}`} />
      </div>
    ),
    tooltip: "Provide your location"
  },
  {
    name: "Technician",
    icon: (active: boolean, completed: boolean) => (
      <div className={`rounded-full border-4 flex items-center justify-center transition-all duration-300
        ${completed ? "bg-gradient-to-br from-green-400 via-green-500 to-green-600 border-green-200 shadow-xl animate-glow"
          : active ? "bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 border-purple-200 shadow-lg animate-glow"
          : "bg-gray-200 border-gray-100"}
      `}>
        <Wrench className={`h-6 w-6 ${completed || active ? "text-white" : "text-gray-400"}`} />
      </div>
    ),
    tooltip: "Choose a technician"
  },
  {
    name: "Payment",
    icon: (active: boolean, completed: boolean) => (
      <div className={`rounded-full border-4 flex items-center justify-center transition-all duration-300
        ${completed ? "bg-gradient-to-br from-green-400 via-green-500 to-green-600 border-green-200 shadow-xl animate-glow"
          : active ? "bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 border-orange-200 shadow-lg animate-glow"
          : "bg-gray-200 border-gray-100"}
      `}>
        <CreditCard className={`h-6 w-6 ${completed || active ? "text-white" : "text-gray-400"}`} />
      </div>
    ),
    tooltip: "Choose payment method"
  },
  {
    name: "Confirm",
    icon: (active: boolean, completed: boolean) => (
      <div className={`rounded-full border-4 flex items-center justify-center transition-all duration-300
        ${completed || active ? "bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 border-red-200 shadow-xl animate-glow"
          : "bg-gray-200 border-gray-100"}
      `}>
        <Check className={`h-6 w-6 ${completed || active ? "text-white" : "text-gray-400"}`} />
      </div>
    ),
    tooltip: "Review and confirm"
  }
];

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
  
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  
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

  const handlePaymentConfirm = (payment: PaymentData) => {
    setPaymentData(payment);
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
    const totalSteps = stepDetails.length;
    return (
      <div className="relative mb-10 select-none">
        <div className="flex justify-between items-center z-10 relative">
          {stepDetails.map((s, idx) => {
            const active = step === idx + 1;
            const completed = step > idx + 1;
            return (
              <div className="flex flex-col items-center group" key={idx}>
                <div className="relative cursor-pointer group">
                  {s.icon(active, completed)}
                  {active && (
                    <span className="absolute -inset-2 rounded-full border-2 border-yellow-300 shadow-2xl animate-ping z-0" />
                  )}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 pointer-events-none group-hover:opacity-100 transition bg-black text-white px-2 py-1 text-xs rounded shadow-lg">
                    {s.tooltip}
                  </div>
                </div>
                <span className={`mt-2 text-xs font-bold transition-colors ${active ? "text-red-600" : completed ? "text-green-600" : "text-gray-500 group-hover:text-black"}`}>
                  {s.name}
                </span>
              </div>
            );
          })}
        </div>
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 flex z-0">
          <div
            className="bg-gradient-to-r from-red-400 via-yellow-400 to-green-500 rounded-full transition-all duration-500 shadow-lg"
            style={{
              width: `${(step - 1) / (stepDetails.length - 1) * 100}%`,
              minWidth: step > 1 ? "2.5rem" : "0px",
              height: "100%",
              transition: "width 500ms cubic-bezier(0.4,0,0.2,1)"
            }}
          />
          <div className="flex-1 bg-gray-200 rounded-full" />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 pb-24 md:pb-0">
      <div className="container max-w-3xl py-4 md:py-12 px-4">
        <Card className="border-none md:border overflow-hidden shadow-xl md:shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                {serviceId && services[serviceId]?.name === "Towing Service" && 
                  <MapPin className="h-7 w-7" />}
                {serviceId && services[serviceId]?.name === "Flat Tire Repair" && 
                  <Car className="h-7 w-7" />}
                {serviceId && services[serviceId]?.name === "Battery Jumpstart" && 
                  <Car className="h-7 w-7" />}
                {serviceId && services[serviceId]?.name !== "Towing Service" && 
                 services[serviceId]?.name !== "Flat Tire Repair" && 
                 services[serviceId]?.name !== "Battery Jumpstart" && 
                  <Car className="h-7 w-7" />}
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl md:text-2xl font-bold leading-tight">{service.name}</CardTitle>
                <CardDescription className="text-primary-foreground/90 mt-2 text-sm md:text-base leading-snug">{service.description}</CardDescription>
                <div className="mt-3 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <span className="text-xs md:text-sm font-semibold">{service.estimatedPrice}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 md:p-6">
          <LiveProgressTracker currentStep={step} totalSteps={6} />
          
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
              <PaymentStep 
                servicePrice={parseInt(service.estimatedPrice.split('₹')[1]?.split(' ')[0] || "599")}
                onPaymentConfirm={handlePaymentConfirm}
              />
            )}

            {step === 6 && (
              <ConfirmationStep 
                service={service}
                formData={formData}
                paymentData={paymentData}
                onInputChange={handleInputChange}
              />
            )}

            {/* Mobile Fixed Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-lg border-t md:hidden z-50">
              <div className="flex gap-3 max-w-3xl mx-auto">
                {step > 1 && step !== 4 && step !== 5 && (
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-12 font-semibold">
                    Back
                  </Button>
                )}
                {step < 4 ? (
                  <Button type="button" className="flex-1 h-12 font-semibold" onClick={nextStep}>
                    Next
                  </Button>
                ) : step === 6 ? (
                  <Button type="submit" className="flex-1 h-12 font-semibold">
                    Confirm & Submit
                  </Button>
                ) : null}
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex mt-8 justify-between">
              {step > 1 && step !== 4 && step !== 5 && (
                <Button type="button" variant="outline" onClick={prevStep} className="px-8">
                  Back
                </Button>
              )}
              {step < 4 ? (
                <Button type="button" className="ml-auto px-8" onClick={nextStep}>
                  Next
                </Button>
              ) : step === 6 ? (
                <Button type="submit" className="ml-auto px-8">
                  Confirm and Submit
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
    </div>
  );
};

export default ServiceRequest;
