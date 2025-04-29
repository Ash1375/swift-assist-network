
interface EmailData {
  to: string;
  subject: string;
  body: string;
  attachments?: {
    filename: string;
    content: string | Blob;
  }[];
}

// In a real application, this would integrate with a proper email service like SendGrid or AWS SES
// For demo purposes, we'll simulate email sending
export const emailService = {
  send: async (data: EmailData): Promise<boolean> => {
    console.log("Sending email:", data);
    return new Promise((resolve) => {
      // Simulate email sending with a delay
      setTimeout(() => {
        console.log(`Email sent to ${data.to} with subject: ${data.subject}`);
        resolve(true);
      }, 1000);
    });
  },
  
  // Helper function to send technician application email
  sendTechnicianApplicationEmail: async (
    technicianData: any, 
    resumeFile?: File
  ): Promise<boolean> => {
    const adminEmail = "ashop1355@gmail.com";
    
    // Generate approval/rejection links
    // In a real app, these would be actual URLs with tokens
    const approveLink = `${window.location.origin}/admin/approve-technician/${technicianData.id}`;
    const rejectLink = `${window.location.origin}/admin/reject-technician/${technicianData.id}`;
    
    const emailContent = `
      <h2>New Technician Application</h2>
      <p>A new technician has applied to join Towbuddy:</p>
      <hr />
      <h3>Technician Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${technicianData.name}</li>
        <li><strong>Email:</strong> ${technicianData.email}</li>
        <li><strong>Phone:</strong> ${technicianData.phone}</li>
        <li><strong>Address:</strong> ${technicianData.address}</li>
        <li><strong>Experience:</strong> ${technicianData.experience} years</li>
        <li><strong>Specialties:</strong> ${technicianData.specialties.join(", ")}</li>
      </ul>
      <hr />
      <p>Resume is attached to this email.</p>
      <div style="margin: 20px 0;">
        <p>Please review the application and select one of the options below:</p>
        <div style="display: flex; gap: 10px;">
          <a href="${approveLink}" style="padding: 10px 20px; background-color: #22c55e; color: white; text-decoration: none; border-radius: 5px;">Approve Application</a>
          <a href="${rejectLink}" style="padding: 10px 20px; background-color: #ef4444; color: white; text-decoration: none; border-radius: 5px;">Reject Application</a>
        </div>
      </div>
      <p>You can also respond to this email directly for any questions.</p>
      <p>Thank you,<br />Towbuddy Team</p>
    `;
    
    const emailData: EmailData = {
      to: adminEmail,
      subject: `New Technician Application: ${technicianData.name}`,
      body: emailContent
    };
    
    // If resume is provided, add it as an attachment
    if (resumeFile) {
      emailData.attachments = [
        {
          filename: `${technicianData.name.replace(/\s+/g, '_')}_resume.pdf`,
          content: resumeFile
        }
      ];
    }
    
    return await emailService.send(emailData);
  },
  
  // Helper function to notify technician of their application result
  sendTechnicianStatusEmail: async (
    technicianEmail: string, 
    name: string, 
    isApproved: boolean
  ): Promise<boolean> => {
    const subject = isApproved 
      ? "Your Towbuddy Application has been Approved!" 
      : "Update on Your Towbuddy Application";
      
    const body = isApproved
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
      body
    });
  }
};
