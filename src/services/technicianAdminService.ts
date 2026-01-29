
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export const technicianAdminService = {
  approveTechnician: async (technicianId: string) => {
    try {
      const { error } = await supabase
        .from('technicians')
        .update({
          verification_status: 'verified',
          status: 'APPROVED',
          is_approved: true,
          email_verified: true,
        })
        .eq('id', technicianId);
        
      if (error) throw error;
      
      // Fetch technician for email (expect array; handle 0 rows to avoid PGRST116)
      const { data: techRows } = await supabase
        .from('technicians')
        .select('name, email')
        .eq('id', technicianId)
        .limit(1);
      const techData = Array.isArray(techRows) && techRows.length > 0 ? techRows[0] : null;
      if (techData) {
        await sendTechnicianStatusEmail(techData.email, techData.name, true, technicianId);
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
        .update({ verification_status: 'rejected', status: 'REJECTED' })
        .eq('id', technicianId);

      if (error) throw error;

      // Fetch technician for email (expect array; handle 0 rows to avoid PGRST116)
      const { data: techRows } = await supabase
        .from('technicians')
        .select('name, email')
        .eq('id', technicianId)
        .limit(1);
      const techData = Array.isArray(techRows) && techRows.length > 0 ? techRows[0] : null;
      if (techData) {
        await sendTechnicianStatusEmail(techData.email, techData.name, false, technicianId);
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
export const sendTechnicianStatusEmail = async (
  email: string,
  name: string,
  isApproved: boolean,
  technicianId?: string
) => {
  const subject = isApproved
    ? "Your ResQNow Application has been Approved!"
    : "Update on Your ResQNow Application";

  const html = isApproved
    ? `
      <h2>Congratulations, ${name}!</h2>
      <p>Your technician account has been approved. You can now log in.</p>
      <p>You can log in to your technician dashboard and start accepting service requests.</p>
      <p><a href="${window.location.origin}/technician/login" style="padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Log in to Your Dashboard</a></p>
      <p>Thank you for joining our team!</p>
      <p>Regards,<br />ResQNow Team</p>
    `
    : `
      <h2>Hello ${name},</h2>
      <p>We have reviewed your application to join the ResQNow technician network.</p>
      <p>Unfortunately, we cannot accept your application at this time.</p>
      <p>Please contact our support team if you have any questions.</p>
      <p>Thank you for your interest in ResQNow.</p>
      <p>Regards,<br />ResQNow Team</p>
    `;

  const { data, error } = await supabase.functions.invoke("send-technician-email", {
    body: { to: email, subject, html, technicianId: technicianId ?? undefined }
  });

  if (error) {
    console.error("[sendTechnicianStatusEmail] Edge function error:", error);
    return;
  }
  const result = data as { error?: string; success?: boolean; message?: string } | null;
  if (result?.error) {
    console.error("[sendTechnicianStatusEmail] Email failed:", result.error);
    toast.warning("Status updated, but notification email could not be sent.");
  }
};
