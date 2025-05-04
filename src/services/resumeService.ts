
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export const resumeService = {
  /**
   * Upload technician resume file
   */
  uploadResume: async (technicianId: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${technicianId}/resume.${fileExt}`;
      
      // Create storage bucket if it doesn't exist
      const { data: buckets } = await supabase
        .storage
        .listBuckets();
      
      if (!buckets?.some(bucket => bucket.name === 'resumes')) {
        await supabase
          .storage
          .createBucket('resumes', {
            public: false,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: [
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ]
          });
      }
      
      const { error } = await supabase
        .storage
        .from('resumes')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error("Failed to upload resume");
      return false;
    }
  },
  
  /**
   * Get technician resume URL
   */
  getResumeUrl: async (technicianId: string) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('resumes')
        .createSignedUrl(`${technicianId}/resume`, 3600);
        
      if (error) throw error;
      
      return data.signedUrl;
    } catch (error) {
      console.error("Error getting resume URL:", error);
      return null;
    }
  },
  
  /**
   * Check if technician has uploaded a resume
   */
  hasResume: async (technicianId: string) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('resumes')
        .list(technicianId);
        
      if (error) throw error;
      
      return data && data.length > 0;
    } catch (error) {
      console.error("Error checking resume:", error);
      return false;
    }
  }
};
