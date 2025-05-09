
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PersonalInfoFields from "@/components/technician/PersonalInfoFields";
import ServiceAreaFields from "@/components/technician/ServiceAreaFields";
import ResumeUpload from "@/components/technician/ResumeUpload";
import SpecialtiesSelect from "@/components/technician/SpecialtiesSelect";
import PricingFields from "@/components/technician/PricingFields";
import TermsAcceptance from "@/components/technician/TermsAcceptance";
import { specialtiesOptions } from "@/types/technician-registration";
import { Upload } from "lucide-react";
import { useTechnicianRegistrationForm } from "@/hooks/useTechnicianRegistrationForm";
import { RegisterFormValues } from "@/types/technician-registration";

interface TechnicianRegistrationFormProps {
  onSubmit: (data: RegisterFormValues, resumeFile: File | null) => Promise<void>;
  isSubmitting: boolean;
}

const TechnicianRegistrationForm: React.FC<TechnicianRegistrationFormProps> = ({
  onSubmit,
  isSubmitting
}) => {
  const {
    form,
    resumeFile,
    handleResumeChange
  } = useTechnicianRegistrationForm();

  const handleFormSubmit = async (data: RegisterFormValues) => {
    await onSubmit(data, resumeFile);
  };

  return (
    <Card className="border-2 border-primary/10 shadow-lg">
      <CardHeader className="bg-primary-foreground">
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" /> 
          Technician Application Form
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <PersonalInfoFields form={form} />
            <ServiceAreaFields form={form} />
            <PricingFields form={form} />
            
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Professional Details</h3>
                <div className="space-y-6">
                  <ResumeUpload resumeFile={resumeFile} handleResumeChange={handleResumeChange} />
                  
                  <SpecialtiesSelect form={form} specialtiesOptions={specialtiesOptions} />
                </div>
              </CardContent>
            </Card>
            
            <TermsAcceptance form={form} />
            
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting Application...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Upload className="mr-2 h-4 w-4" /> Submit Application
                </span>
              )}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/technician/login" className="text-primary font-medium">
              Log in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianRegistrationForm;
