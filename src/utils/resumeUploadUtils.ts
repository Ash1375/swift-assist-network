
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

export const validateResumeFile = (file: File): boolean => {
  // Check if file is PDF or document
  if (
    file.type === 'application/pdf' || 
    file.type === 'application/msword' || 
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return true;
  } else {
    toast.error("Invalid file type. Please upload a PDF or Word document");
    return false;
  }
};

export const uploadResume = async (technicianId: string, resumeFile: File): Promise<string | null> => {
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
