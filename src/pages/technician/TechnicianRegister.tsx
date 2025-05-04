
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTechnicianAuth } from "@/contexts/TechnicianAuthContext";
import { toast } from "@/components/ui/sonner";
import { RegisterFormValues } from "@/types/technician-registration";
import { UserPlus } from "lucide-react";
import TechnicianRegistrationForm from "@/components/technician/TechnicianRegistrationForm";
import { submitTechnicianApplication } from "@/utils/technicianFormSubmission";

const TechnicianRegister = () => {
  const { register } = useTechnicianAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (data: RegisterFormValues, resumeFile: File | null) => {
    setIsLoading(true);
    
    try {
      await submitTechnicianApplication(
        data,
        resumeFile,
        register,
        () => navigate("/technician/verification")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-12 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Join Our Technician Network</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Become part of our growing network of skilled roadside assistance professionals. 
            Complete the form below to submit your application.
          </p>
        </div>

        <TechnicianRegistrationForm 
          onSubmit={handleSubmit}
          isSubmitting={isLoading}
        />
      </div>
    </div>
  );
};

export default TechnicianRegister;
