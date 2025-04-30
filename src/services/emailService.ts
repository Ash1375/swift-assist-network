
import { supabase } from "@/integrations/supabase/client";

interface EmailData {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export const emailService = {
  send: async (data: EmailData): Promise<boolean> => {
    try {
      const { to, subject, html, replyTo } = data;

      const { error } = await supabase.functions.invoke('send-technician-email', {
        body: { to, subject, html, replyTo }
      });

      if (error) {
        console.error('Error sending email:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  },
  
  sendTechnicianApplicationEmail: async (technicianData: any, resumeUrl: string | null): Promise<boolean> => {
    try {
      // Convert pricing object to formatted string for email
      const pricingList = Object.entries(technicianData.pricing)
        .map(([key, value]) => {
          const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          return `<li><strong>${formattedKey}:</strong> $${value}</li>`;
        })
        .join('');
        
      const html = `
        <h2>New Technician Application</h2>
        <p>A new technician has applied to join Towbuddy:</p>
        <hr />
        <h3>Technician Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${technicianData.name}</li>
          <li><strong>Email:</strong> ${technicianData.email}</li>
          <li><strong>Phone:</strong> ${technicianData.phone}</li>
          <li><strong>Address:</strong> ${technicianData.address}</li>
          <li><strong>Region:</strong> ${technicianData.region}</li>
          <li><strong>District:</strong> ${technicianData.district}</li>
          <li><strong>State:</strong> ${technicianData.state}</li>
          <li><strong>Service Area Range:</strong> ${technicianData.service_area_range} miles</li>
          <li><strong>Experience:</strong> ${technicianData.experience} years</li>
          <li><strong>Specialties:</strong> ${technicianData.specialties.join(", ")}</li>
        </ul>
        
        <h3>Pricing:</h3>
        <ul>
          ${pricingList}
        </ul>
        
        <hr />
        ${resumeUrl ? `<p>Resume: <a href="${resumeUrl}" target="_blank">View Resume</a></p>` : '<p>No resume attached</p>'}
        
        <div style="margin: 20px 0;">
          <p>Please review the application and select one of the options below:</p>
          <div>
            <a href="${window.location.origin}/admin/approve-technician/${technicianData.id}" 
               style="padding: 10px 20px; background-color: #22c55e; color: white; text-decoration: none; border-radius: 5px; margin-right: 10px;">
              Approve Application
            </a>
            <a href="${window.location.origin}/admin/reject-technician/${technicianData.id}" 
               style="padding: 10px 20px; background-color: #ef4444; color: white; text-decoration: none; border-radius: 5px;">
              Reject Application
            </a>
          </div>
        </div>
        
        <p>Thank you,<br />Towbuddy Team</p>
      `;
      
      return await emailService.send({
        to: "admin@towbuddy.com", // Replace with your actual email
        subject: `New Technician Application: ${technicianData.name}`,
        html,
        replyTo: technicianData.email
      });
    } catch (error) {
      console.error("Error sending application email:", error);
      return false;
    }
  },
  
  sendTechnicianStatusEmail: async (
    technicianEmail: string, 
    name: string, 
    isApproved: boolean
  ): Promise<boolean> => {
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
    
    return await emailService.send({
      to: technicianEmail,
      subject,
      html
    });
  }
};
