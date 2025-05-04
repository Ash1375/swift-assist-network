
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTechnicianAuth } from "@/contexts/TechnicianAuthContext";
import { toast } from "@/components/ui/sonner";
import { UserPlus, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import TechnicianFormFields from "@/components/technician/TechnicianFormFields";
import ResumeUpload from "@/components/technician/ResumeUpload";
import SpecialtiesSelect from "@/components/technician/SpecialtiesSelect";
import PricingFields from "@/components/technician/PricingFields";
import TermsAcceptance from "@/components/technician/TermsAcceptance";
import { RegisterFormValues, specialtiesOptions } from "@/types/technician-registration";
import { emailService } from "@/services/emailService";

const TechnicianRegister = () => {
  const { register } = useTechnicianAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  const formSchema = z.object({
    name: z.string().min(2, "Full name is required"),
    email: z.string().email("Valid email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    phone: z.string().min(10, "Valid phone number is required"),
    address: z.string().min(5, "Address is required"),
    region: z.string().min(1, "Region is required"),
    district: z.string().min(1, "District is required"),
    state: z.string().min(1, "State is required"),
    serviceAreaRange: z.number().min(1, "Service area range is required"),
    experience: z.number().min(0, "Experience is required"),
    specialties: z.array(z.string()).min(1, "Select at least one specialty"),
    pricing: z.object({
      towing: z.number().min(0, "Price required"),
      tireChange: z.number().min(0, "Price required"),
      jumpStart: z.number().min(0, "Price required"),
      fuelDelivery: z.number().min(0, "Price required"),
      lockout: z.number().min(0, "Price required"),
      winching: z.number().min(0, "Price required")
    }),
    termsAccepted: z.boolean().refine(val => val === true, {
      message: "You must accept the terms and conditions",
    })
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      region: "",
      district: "",
      state: "",
      serviceAreaRange: 10,
      experience: 0,
      specialties: [],
      pricing: {
        towing: 0,
        tireChange: 0,
        jumpStart: 0,
        fuelDelivery: 0,
        lockout: 0,
        winching: 0
      },
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
        toast.error("Invalid file type. Please upload a PDF or Word document");
        e.target.value = '';
      }
    }
  };

  const uploadResume = async (technicianId: string) => {
    if (!resumeFile) return null;
    
    try {
      // Check if bucket exists, create if not
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(bucket => bucket.name === 'technician_resumes')) {
        await supabase.storage.createBucket('technician_resumes', {
          public: false,
          fileSizeLimit: 10485760 // 10MB
        });
      }
      
      const fileExt = resumeFile.name.split('.').pop();
      const fileName = `${technicianId}_resume.${fileExt}`;
      const filePath = `${technicianId}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('technician_resumes')
        .upload(filePath, resumeFile);
        
      if (error) {
        console.error('Error uploading resume:', error);
        return null;
      }
      
      // Get a URL for the resume
      const { data: urlData } = await supabase.storage
        .from('technician_resumes')
        .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days
      
      return urlData?.signedUrl || null;
    } catch (error) {
      console.error("Error in resume upload:", error);
      return null;
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    if (!resumeFile) {
      toast.error("Please upload your resume to complete your application");
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
        data.region,
        data.district,
        data.state,
        data.serviceAreaRange,
        data.experience, 
        data.specialties,
        data.pricing
      );
      
      // Upload resume
      const resumeUrl = await uploadResume(technicianData.id);
      
      // Send email notification about the new technician application
      await emailService.sendTechnicianApplicationEmail(technicianData, resumeUrl);
      
      // Notify success and navigate to verification page
      toast.success("Your application has been submitted for review");
      navigate("/technician/verification");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An unexpected error occurred");
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

        <Card className="border-2 border-primary/10 shadow-lg">
          <CardHeader className="bg-primary-foreground">
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" /> 
              Technician Application Form
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <TechnicianFormFields form={form} />
                
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
                
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? (
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
      </div>
    </div>
  );
};

export default TechnicianRegister;
