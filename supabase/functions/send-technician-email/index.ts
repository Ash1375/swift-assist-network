
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, replyTo } = await req.json();
    
    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          } 
        }
      );
    }
    
    // For now, we'll just log the email details since we don't have an actual email service integrated yet
    // In a production environment, you would integrate with a service like SendGrid, AWS SES, or Resend
    console.log("Email sent:", {
      to,
      subject,
      html,
      replyTo: replyTo || undefined
    });
    
    // Add admin@towbuddy.com as CC for technician-related emails
    const adminEmail = "ash970462@gmail.com";
    
    console.log(`CC'd to admin: ${adminEmail}`);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Email sent successfully (simulated)"
      }),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error("Error in send-technician-email function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  }
});
