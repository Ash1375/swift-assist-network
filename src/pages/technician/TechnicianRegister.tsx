
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTechnicianAuth } from "@/contexts/TechnicianAuthContext";
import { toast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";
import { emailService } from "@/services/emailService";
import TechnicianFormFields from "@/components/technician/TechnicianFormFields";
import ResumeUpload from "@/components/technician/ResumeUpload";
import SpecialtiesSelect from "@/components/technician/SpecialtiesSelect";
import TermsAcceptance from "@/components/technician/TermsAcceptance";
import { RegisterFormValues, specialtiesOptions } from "@/types/technician-registration";

const TechnicianRegister = () => {
  const { register } = useTechnicianAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  const form = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      experience: 0,
      specialties: [],
      termsAccepted: false,
    },
  });

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is PDF or document
      if (file.type === 'application/pdf' || 
          file.type === 'application/msword' || 
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setResumeFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document",
          variant: "destructive",
        });
        e.target.value = '';
      }
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    if (data.password !== data.confirmPassword) {
      form.setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    if (!data.termsAccepted) {
      form.setError("termsAccepted", {
        type: "manual",
        message: "You must accept the terms and conditions",
      });
      return;
    }

    if (!resumeFile) {
      toast({
        title: "Resume required",
        description: "Please upload your resume to complete your application",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Register the technician
      const technicianData = await register(
        data.name, 
        data.email, 
        data.password, 
        data.phone, 
        data.address, 
        data.experience, 
        data.specialties
      );
      
      // Send the application email with resume
      await emailService.sendTechnicianApplicationEmail(technicianData, resumeFile);
      
      toast({
        title: "Registration successful!",
        description: "Your application and resume have been submitted for review",
      });
      navigate("/technician/verification");
    } catch (error) {
      console.error(error);
      toast({
        title: "Registration failed",
        description: "Email may already be in use",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-12 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Join Our Technician Network</h1>
          <p className="text-muted-foreground mt-2">Create an account to start providing services with Towbuddy</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Technician Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <TechnicianFormFields form={form} />
                
                <ResumeUpload resumeFile={resumeFile} handleResumeChange={handleResumeChange} />
                
                <SpecialtiesSelect form={form} specialtiesOptions={specialtiesOptions} />
                
                <TermsAcceptance form={form} />
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <UserPlus className="mr-2 h-4 w-4" /> Register as Technician
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
      </div>
    </div>
  );
};

export default TechnicianRegister;
