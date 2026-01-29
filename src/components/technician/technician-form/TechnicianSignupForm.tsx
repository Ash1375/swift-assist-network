import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FormProgress } from "./FormProgress";
import { PersonalInfoStep } from "./PersonalInfoStep";
import type { PersonalInfoData } from "./PersonalInfoStep";
import { ServiceTypeStep } from "./ServiceTypeStep";
import { ShopVerificationStep } from "./ShopVerificationStep";
import { ServicePricingStep } from "./ServicePricingStep";
import { ChevronLeft, ChevronRight, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import { RegisterFormValues } from "@/types/technician-registration";
const STEPS = [
  { id: 1, title: "Personal Info", description: "Your details" },
  { id: 2, title: "Services", description: "What you offer" },
  { id: 3, title: "Verification", description: "Shop images" },
  { id: 4, title: "Pricing", description: "Set your rates" },
];

// Map GitHub service IDs to our backend specialty IDs
const SERVICE_TO_SPECIALTY: Record<string, string> = {
  mechanical: "towing", // fallback - mechanical not in our list
  battery: "jump-start",
  fuel: "fuel-delivery",
  lockout: "lockout",
  tire: "tire-change",
  ev: "jump-start", // fallback - ev not in our list
  winching: "winching",
  towing: "towing",
};

// Map GitHub pricing to our backend pricing keys
const extractBackendPricing = (
  pricing: Record<string, Record<string, Record<string, string>>>
): Record<string, number> => {
  const getFirstPrice = (
    serviceId: string,
    subServiceIds: string[]
  ): number => {
    const servicePricing = pricing[serviceId];
    if (!servicePricing) return 0;
    for (const [, vehiclePricing] of Object.entries(servicePricing)) {
      for (const subId of subServiceIds) {
        const val = vehiclePricing[subId];
        if (val && !isNaN(parseFloat(val))) {
          return Math.round(parseFloat(val));
        }
      }
    }
    return 0;
  };

  const towingPrice = getFirstPrice("towing", ["baseCharge", "perKm", "flatbed"]);
  const mechanicalPrice = getFirstPrice("mechanical", ["general", "breakdown", "engine", "ac", "electrical", "diagnostics"]);

  return {
    towing: towingPrice || mechanicalPrice,
    tireChange: getFirstPrice("tire", [
      "tireChange",
      "puncture",
      "tubelessRepair",
      "wheelBalancing",
    ]),
    jumpStart: getFirstPrice("battery", ["jumpstart", "replacement", "testing"]) ||
      getFirstPrice("ev", ["charging", "evDiagnostics", "chargerSetup"]),
    fuelDelivery: getFirstPrice("fuel", [
      "deliveryCharge",
      "petrol",
      "diesel",
    ]),
    lockout: getFirstPrice("lockout", [
      "unlocking",
      "keyMaking",
      "keyDuplication",
    ]),
    winching: getFirstPrice("winching", [
      "basicWinch",
      "mudRecovery",
      "accidentRecovery",
    ]),
  };
};

export interface TechnicianSignupFormData {
  personalInfo: PersonalInfoData;
  serviceType: {
    services: string[];
    vehicleTypes: string[];
  };
  verification: {
    shopImage: File | null;
    equipmentImage: File | null;
    workingBayImage: File | null;
    facilitiesImage: File | null;
    gstinNumber: string;
  };
  pricing: Record<string, Record<string, Record<string, string>>>;
  termsAccepted: boolean;
}

const initialPersonalInfo: PersonalInfoData = {
  technicianName: "",
  shopName: "",
  email: "",
  password: "",
  confirmPassword: "",
  personalContact: "",
  shopContact: "",
  shopAddress: "",
  gpsLocation: "",
  region: "",
  district: "",
  state: "Tamil Nadu",
  locality: "",
  serviceAreaRange: 10,
  experience: 0,
};

const initialFormData: TechnicianSignupFormData = {
  personalInfo: initialPersonalInfo,
  serviceType: {
    services: [],
    vehicleTypes: [],
  },
  verification: {
    shopImage: null,
    equipmentImage: null,
    workingBayImage: null,
    facilitiesImage: null,
    gstinNumber: "",
  },
  pricing: {},
  termsAccepted: false,
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

const validatePersonalInfo = (
  data: PersonalInfoData
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.technicianName.trim()) {
    errors.technicianName = "Technician name is required";
  } else if (data.technicianName.trim().length < 2) {
    errors.technicianName = "Name must be at least 2 characters";
  }

  if (!data.shopName.trim()) {
    errors.shopName = "Shop name is required";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!data.password.trim()) {
    errors.password = "Password is required";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (!data.personalContact.trim()) {
    errors.personalContact = "Personal contact is required";
  } else if (!validatePhone(data.personalContact)) {
    errors.personalContact = "Enter a valid 10-digit phone number";
  }

  if (!data.shopContact.trim()) {
    errors.shopContact = "Shop contact is required";
  } else if (!validatePhone(data.shopContact)) {
    errors.shopContact = "Enter a valid 10-digit phone number";
  }

  if (!data.shopAddress.trim()) {
    errors.shopAddress = "Shop address is required";
  } else if (data.shopAddress.trim().length < 10) {
    errors.shopAddress = "Please enter a complete address";
  }

  if (!data.gpsLocation.trim()) {
    errors.gpsLocation = "GPS location is required";
  }

  if (!data.region) {
    errors.region = "Region is required";
  }

  if (!data.district) {
    errors.district = "District is required";
  }

  if (!data.serviceAreaRange || data.serviceAreaRange < 1) {
    errors.serviceAreaRange = "Service area range is required";
  }

  return errors;
};

const validateServiceType = (data: {
  services: string[];
  vehicleTypes: string[];
}): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (data.services.length === 0) {
    errors.services = "Please select at least one service";
  }

  if (data.vehicleTypes.length === 0) {
    errors.vehicleTypes = "Please select at least one vehicle type";
  }

  return errors;
};

const validateVerification = (data: {
  shopImage: File | null;
}): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.shopImage) {
    errors.shopImage = "Shop front image is required for verification";
  }

  return errors;
};

interface TechnicianSignupFormProps {
  onSubmit: (data: RegisterFormValues, resumeFile: File | null) => Promise<void>;
  isSubmitting: boolean;
}

export function TechnicianSignupForm({
  onSubmit,
  isSubmitting,
}: TechnicianSignupFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] =
    useState<TechnicianSignupFormData>(initialFormData);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [showStepErrors, setShowStepErrors] = useState(false);

  const handleFieldBlur = useCallback((field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  }, []);

  const getPersonalInfoErrors = useCallback(() => {
    return validatePersonalInfo(formData.personalInfo);
  }, [formData.personalInfo]);

  const getServiceTypeErrors = useCallback(() => {
    return validateServiceType(formData.serviceType);
  }, [formData.serviceType]);

  const getVerificationErrors = useCallback(() => {
    return validateVerification(formData.verification);
  }, [formData.verification]);

  const validateCurrentStep = (): boolean => {
    let errors: Record<string, string> = {};
    let isValid = true;

    switch (currentStep) {
      case 1:
        errors = getPersonalInfoErrors();
        isValid = Object.keys(errors).length === 0;
        if (!isValid) {
          const missingFields = Object.keys(errors).map((key) => {
            const fieldLabels: Record<string, string> = {
              technicianName: "Technician Name",
              shopName: "Shop Name",
              email: "Email",
              password: "Password",
              confirmPassword: "Confirm Password",
              personalContact: "Personal Contact",
              shopContact: "Shop Contact",
              shopAddress: "Shop Address",
              gpsLocation: "GPS Location",
              region: "Region",
              district: "District",
              serviceAreaRange: "Service Area Range",
            };
            return fieldLabels[key] || key;
          });
          toast.error("Please fill all required fields", {
            description: `Missing: ${missingFields.join(", ")}`,
          });
          setTouchedFields({
            technicianName: true,
            shopName: true,
            email: true,
            password: true,
            confirmPassword: true,
            personalContact: true,
            shopContact: true,
            shopAddress: true,
            gpsLocation: true,
            region: true,
            district: true,
            serviceAreaRange: true,
          });
        }
        break;
      case 2:
        errors = getServiceTypeErrors();
        isValid = Object.keys(errors).length === 0;
        if (!isValid) {
          const issues: string[] = [];
          if (errors.services) issues.push("services");
          if (errors.vehicleTypes) issues.push("vehicle types");
          toast.error("Selection required", {
            description: `Please select at least one ${issues.join(" and ")}`,
          });
        }
        setStepErrors(errors);
        setShowStepErrors(true);
        break;
      case 3:
        errors = getVerificationErrors();
        isValid = Object.keys(errors).length === 0;
        if (!isValid) {
          toast.error("Shop image required", {
            description: "Please upload a shop front image for verification",
          });
        }
        setStepErrors(errors);
        setShowStepErrors(true);
        break;
      case 4:
        if (!formData.termsAccepted) {
          toast.error("Terms required", {
            description: "You must accept the terms and conditions",
          });
          isValid = false;
        } else {
          isValid = true;
        }
        break;
    }

    return isValid;
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setShowStepErrors(false);
      setStepErrors({});
      toast.success(`Step ${currentStep} completed!`, {
        description: `Moving to ${STEPS[currentStep].title}`,
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setShowStepErrors(false);
      setStepErrors({});
    }
  };

  const mapToRegisterFormValues = (): RegisterFormValues => {
    const pi = formData.personalInfo;
    const st = formData.serviceType;

    // Map services to our specialties (filter to only those we support)
    const ourSpecialties = ["towing", "tire-change", "jump-start", "fuel-delivery", "lockout", "winching"];
    const specialties = st.services
      .map((s) => SERVICE_TO_SPECIALTY[s] || s)
      .filter((s) => ourSpecialties.includes(s));
    const uniqueSpecialties = [...new Set(specialties)];

    // If no mapped specialties, use at least towing
    const finalSpecialties =
      uniqueSpecialties.length > 0 ? uniqueSpecialties : ["towing"];

    const address = [pi.shopName, pi.shopAddress, pi.gpsLocation]
      .filter(Boolean)
      .join(", ");

    const backendPricing = extractBackendPricing(formData.pricing);

    return {
      name: pi.technicianName,
      email: pi.email,
      password: pi.password,
      confirmPassword: pi.confirmPassword,
      phone: pi.personalContact,
      address,
      region: pi.region,
      district: pi.district,
      state: pi.state || "Tamil Nadu",
      locality: pi.locality || "",
      serviceAreaRange: pi.serviceAreaRange || 10,
      experience: pi.experience || 0,
      specialties: finalSpecialties,
      pricing: {
        towing: backendPricing.towing ?? 0,
        tireChange: backendPricing.tireChange ?? 0,
        jumpStart: backendPricing.jumpStart ?? 0,
        fuelDelivery: backendPricing.fuelDelivery ?? 0,
        lockout: backendPricing.lockout ?? 0,
        winching: backendPricing.winching ?? 0,
      },
      termsAccepted: formData.termsAccepted,
    };
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    const registerData = mapToRegisterFormValues();
    const resumeFile = formData.verification.shopImage;

    await onSubmit(registerData, resumeFile);
  };

  return (
    <div className="space-y-6">
      <FormProgress steps={STEPS} currentStep={currentStep} />

      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <PersonalInfoStep
            data={formData.personalInfo}
            onChange={(data) =>
              setFormData({ ...formData, personalInfo: data })
            }
            errors={getPersonalInfoErrors()}
            touched={touchedFields}
            onBlur={handleFieldBlur}
          />
        )}
        {currentStep === 2 && (
          <ServiceTypeStep
            data={formData.serviceType}
            onChange={(data) =>
              setFormData({ ...formData, serviceType: data })
            }
            errors={stepErrors}
            showErrors={showStepErrors}
          />
        )}
        {currentStep === 3 && (
          <ShopVerificationStep
            data={formData.verification}
            onChange={(data) =>
              setFormData({ ...formData, verification: data })
            }
            errors={stepErrors}
            showErrors={showStepErrors}
          />
        )}
        {currentStep === 4 && (
          <div className="space-y-6">
            <ServicePricingStep
              selectedServices={formData.serviceType.services}
              selectedVehicleTypes={formData.serviceType.vehicleTypes}
              pricing={formData.pricing}
              onChange={(pricing) =>
                setFormData({ ...formData, pricing })
              }
              errors={stepErrors}
              showErrors={showStepErrors}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="termsAccepted"
                checked={formData.termsAccepted}
                onChange={(e) =>
                  setFormData({ ...formData, termsAccepted: e.target.checked })
                }
                className="h-4 w-4 rounded border-primary"
              />
              <label htmlFor="termsAccepted" className="text-sm">
                I accept the{" "}
                <Link to="/terms" className="text-primary font-medium">
                  terms and conditions
                </Link>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep < 4 ? (
          <Button type="button" onClick={handleNext}>
            Next Step
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Application
              </>
            )}
          </Button>
        )}
      </div>

      <div className="text-center pt-4">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/technician/login" className="text-primary font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
