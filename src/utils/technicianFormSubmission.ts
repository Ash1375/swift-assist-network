
import { toast } from "@/components/ui/sonner";
import { RegisterFormValues } from "@/types/technician-registration";
import { uploadResume } from "./resumeUploadUtils";
import { emailService } from "@/services/emailService";

export const submitTechnicianApplication = async (
  data: RegisterFormValues,
  resumeFile: File | null,
  registerFunction: Function,
  onSuccessCallback: Function
) => {
  if (!resumeFile) {
    toast.error("Please upload your resume to complete your application");
    return false;
  }

  try {
    // Register the technician
    const technicianData = await registerFunction(
      data.name, 
      data.email, 
      data.password, 
      data.phone, 
      data.address,
      data.region,
      data.district,
      data.state,
      data.serviceAreaRange,
      data.experience, 
      data.specialties,
      data.pricing
    );
    
    // Upload resume
    const resumeUrl = await uploadResume(technicianData.id, resumeFile);
    
    // Send email notification about the new technician application
    await emailService.sendTechnicianApplicationEmail(technicianData, resumeUrl);
    
    // Notify success
    toast.success("Your application has been submitted for review");
    
    // Execute callback (like navigation)
    onSuccessCallback();
    return true;
  } catch (error: any) {
    console.error(error);
    toast.error(error.message || "An unexpected error occurred");
    return false;
  }
};
