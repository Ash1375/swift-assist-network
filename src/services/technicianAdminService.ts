
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export const technicianAdminService = {
  approveTechnician: async (technicianId: string) => {
    try {
      const { error } = await supabase
        .from('technicians')
        .update({ verification_status: 'verified' })
        .eq('id', technicianId);
        
      if (error) throw error;
      
      // Call the email function to notify technician
      const { data: techData } = await supabase
        .from('technicians')
        .select('name, email')
        .eq('id', technicianId)
        .single();
        
      if (techData) {
        await sendTechnicianStatusEmail(techData.email, techData.name, true);
      }
      
      return true;
    } catch (error) {
      console.error("Error approving technician:", error);
      toast.error("Failed to approve technician");
      return false;
    }
  },
  
  rejectTechnician: async (technicianId: string) => {
    try {
      const { error } = await supabase
        .from('technicians')
        .update({ verification_status: 'rejected' })
        .eq('id', technicianId);
        
      if (error) throw error;
      
      // Call the email function to notify technician
      const { data: techData } = await supabase
        .from('technicians')
        .select('name, email')
        .eq('id', technicianId)
        .single();
        
      if (techData) {
        await sendTechnicianStatusEmail(techData.email, techData.name, false);
      }
      
      return true;
    } catch (error) {
      console.error("Error rejecting technician:", error);
      toast.error("Failed to reject technician");
      return false;
    }
  }
};

// Helper function to send email notification to technician
export const sendTechnicianStatusEmail = async (email: string, name: string, isApproved: boolean) => {
  const subject = isApproved 
    ? "Your Towbuddy Application has been Approved!" 
    : "Update on Your Towbuddy Application";
    
  const html = isApproved
    ? `
      <h2>Congratulations, ${name}!</h2>
      <p>Your application to join the Towbuddy technician network has been approved.</p>
      <p>You can now log in to your technician dashboard and start accepting service requests.</p>
      <p><a href="${window.location.origin}/technician/login" style="padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Log in to Your Dashboard</a></p>
      <p>Thank you for joining our team!</p>
      <p>Regards,<br />Towbuddy Team</p>
    `
    : `
      <h2>Hello ${name},</h2>
      <p>We have reviewed your application to join the Towbuddy technician network.</p>
      <p>Unfortunately, we cannot accept your application at this time.</p>
      <p>Please contact our support team if you have any questions.</p>
      <p>Thank you for your interest in Towbuddy.</p>
      <p>Regards,<br />Towbuddy Team</p>
    `;
  
  return await supabase.functions.invoke("send-technician-email", {
    body: { to: email, subject, html }
  });
};
