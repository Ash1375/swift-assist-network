import React from "react";
import { TechnicianSignupForm } from "./technician-form/TechnicianSignupForm";
import { RegisterFormValues } from "@/types/technician-registration";

interface TechnicianRegistrationFormProps {
  onSubmit: (data: RegisterFormValues, resumeFile: File | null) => Promise<void>;
  isSubmitting: boolean;
}

const TechnicianRegistrationForm: React.FC<TechnicianRegistrationFormProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  return (
    <TechnicianSignupForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
  );
};

export default TechnicianRegistrationForm;
