import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import VehicleInfoStep from "../service-request/VehicleInfoStep";
import LocationStep from "../service-request/LocationStep";
import PersonalInfoStep from "../service-request/PersonalInfoStep";
import ProgressStepper from "../service-request/ProgressStepper";
import { ServiceRequestFormData } from "../service-request/types";
import { Loader2 } from "lucide-react";
import TechnicianSelection from "../TechnicianSelection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CarServiceRequest = () => {
  const { serviceId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [showTechnicianSelection, setShowTechnicianSelection] = useState(false);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const steps = [
    { id: 1, name: "Vehicle Info", description: "Tell us about your car" },
    { id: 2, name: "Location", description: "Where are you?" },
    { id: 3, name: "Contact", description: "How to reach you" },
    { id: 4, name: "Technician", description: "Choose expert" },
  ];

  const [formData, setFormData] = useState<ServiceRequestFormData>({
    vehicleType: "car",
    vehicleSubtype: "",
    vehicleModel: "",
    location: "",
    name: "",
    phone: "",
    details: "",
    selectedTechnicianId: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVehicleTypeSelect = (type: string) => {
    setFormData((prev) => ({ ...prev, vehicleType: type }));
  };

  const handleVehicleSubtypeSelect = (subtype: string) => {
    setFormData((prev) => ({ ...prev, vehicleSubtype: subtype }));
  };

  const handleGetCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationString = `${position.coords.latitude}, ${position.coords.longitude}`;
          setCurrentLocation(locationString);
          setFormData((prev) => ({ ...prev, location: locationString }));
          setIsGettingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsGettingLocation(false);
        }
      );
    } else {
      setIsGettingLocation(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      setShowTechnicianSelection(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTechnicianSelect = async (technicianId: string) => {
    setSelectedTechnicianId(technicianId);
    setShowTechnicianSelection(false);
    setIsSubmitting(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please login to submit a service request");
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('service_requests')
        .insert({
          user_id: user.id,
          service_type: `car-${serviceId}`,
          vehicle_type: 'car',
          vehicle_model: `${formData.vehicleSubtype} - ${formData.vehicleModel}`,
          address: formData.location,
          description: formData.details || '',
          contact_name: formData.name,
          contact_phone: formData.phone,
          contact_email: '',
          technician_id: technicianId,
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Service request submitted successfully!");
      navigate(`/request-tracking/${data.id}`);
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit request. Please try again.");
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return formData.vehicleType && formData.vehicleSubtype && formData.vehicleModel;
    }
    if (currentStep === 2) {
      return formData.location;
    }
    if (currentStep === 3) {
      return formData.name && formData.phone;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50/30 py-4 md:py-8 pb-24 md:pb-8">
      <div className="container mx-auto px-3 md:px-4 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-12 border border-gray-100">
          {!showTechnicianSelection && (
            <ProgressStepper currentStep={currentStep} steps={steps} />
          )}
          
          {showTechnicianSelection ? (
            <TechnicianSelection 
              serviceType={serviceId || "Unknown Service"}
              vehicleType={formData.vehicleType}
              location={formData.location}
              onSelect={handleTechnicianSelect}
            />
          ) : (
            <>
              {currentStep === 1 && (
                <VehicleInfoStep
                  formData={formData}
                  onInputChange={handleInputChange}
                  onVehicleTypeSelect={handleVehicleTypeSelect}
                  onVehicleSubtypeSelect={handleVehicleSubtypeSelect}
                />
              )}

              {currentStep === 2 && (
                <LocationStep
                  formData={formData}
                  onInputChange={handleInputChange}
                  currentLocation={currentLocation}
                  isGettingLocation={isGettingLocation}
                  onGetCurrentLocation={handleGetCurrentLocation}
                />
              )}

              {currentStep === 3 && (
                <PersonalInfoStep
                  formData={formData}
                  onInputChange={handleInputChange}
                />
              )}

              {/* Navigation Buttons */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t md:relative md:border-t-0 md:p-0 md:mt-8 z-10 backdrop-blur-sm md:backdrop-blur-none">
                <div className="flex gap-3 max-w-4xl mx-auto">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1 py-6 text-base font-semibold"
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!canProceed() || isSubmitting}
                    className="flex-1 py-6 text-base font-semibold bg-gradient-to-r from-primary to-primary/80"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : currentStep === 3 ? (
                      "Find Technicians"
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarServiceRequest;