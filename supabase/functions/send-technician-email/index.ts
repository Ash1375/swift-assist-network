import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Missing authorization header" }),
        { 
          status: 401, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Create Supabase client with user's auth token
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify the JWT and get claims
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid token" }),
        { 
          status: 401, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    const userId = claimsData.claims.sub;

    // Check if user is admin using has_role function
    const { data: isAdmin, error: roleError } = await supabase
      .rpc('has_role', { _user_id: userId, _role: 'admin' });

    if (roleError || !isAdmin) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin access required" }),
        { 
          status: 403, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    const { to, subject, html, technicianId } = await req.json();
    
    // Validate required fields
    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject, html" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Validate email is for a technician in the database (prevent arbitrary email sending)
    if (technicianId) {
      const { data: technician, error: techError } = await supabase
        .from('technicians')
        .select('email')
        .eq('id', technicianId)
        .single();

      if (techError || !technician || technician.email !== to) {
        return new Response(
          JSON.stringify({ error: "Invalid recipient: Email must match a registered technician" }),
          { 
            status: 400, 
            headers: { "Content-Type": "application/json", ...corsHeaders } 
          }
        );
      }
    }

    // Sanitize HTML input - basic sanitization
    const sanitizedHtml = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/on\w+='[^']*'/gi, '');

    // For now, we'll just log the email details since we don't have an actual email service integrated yet
    // In a production environment, you would integrate with a service like SendGrid, AWS SES, or Resend
    console.log("Email sent by admin:", {
      adminUserId: userId,
      to,
      subject,
      html: sanitizedHtml.substring(0, 200) + '...',
      technicianId: technicianId || 'N/A'
    });
    
    const adminEmail = "ash970462@gmail.com";
    console.log(`CC'd to admin: ${adminEmail}`);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Email sent successfully (simulated)"
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  } catch (error) {
    console.error("Error in send-technician-email function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
});
