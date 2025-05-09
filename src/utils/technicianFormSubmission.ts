
import { toast } from "@/components/ui/sonner";
import { RegisterFormValues } from "@/types/technician-registration";
import { resumeService } from "@/services/resumeService";

export const submitTechnicianApplication = async (
  data: RegisterFormValues,
  resumeFile: File | null,
  register: (
    name: string, 
    email: string, 
    password: string, 
    phone: string, 
    address: string,
    region: string,
    district: string,
    state: string,
    locality: string, // Added locality parameter
    serviceAreaRange: number,
    experience: number,
    specialties: string[],
    pricing: Record<string, number>
  ) => Promise<any>,
  onSuccess: () => void
) => {
  try {
    // Format pricing data from the form
    // The pricing in RegisterFormValues is an object, not an array
    const formattedPricing: Record<string, number> = {
      towing: data.pricing.towing,
      tireChange: data.pricing.tireChange,
      jumpStart: data.pricing.jumpStart,
      fuelDelivery: data.pricing.fuelDelivery,
      lockout: data.pricing.lockout,
      winching: data.pricing.winching
    };
    
    // Register the technician
    const technician = await register(
      data.name,
      data.email,
      data.password,
      data.phone,
      data.address,
      data.region,
      data.district,
      data.state,
      data.locality || "", // Pass the locality with a default empty string
      Number(data.serviceAreaRange),
      Number(data.experience),
      data.specialties,
      formattedPricing
    );

    // Upload resume if provided
    if (resumeFile && technician && technician.id) {
      await resumeService.uploadResume(technician.id, resumeFile);
    }
    
    toast.success("Registration successful! Your application is under review.");
    onSuccess();
  } catch (error: any) {
    console.error("Registration error:", error);
    toast.error(error.message || "Registration failed. Please try again.");
  }
};
