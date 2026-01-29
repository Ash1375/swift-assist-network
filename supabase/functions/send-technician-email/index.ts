import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl?.trim() || !supabaseServiceKey?.trim()) {
    console.error("[send-technician-email] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
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

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: authHeader } },
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

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: Deno.env.get("EMAIL_FROM") || "ResQNow <onboarding@resend.dev>",
            to: [to],
            subject,
            html: sanitizedHtml,
          }),
        });
        const result = await res.json();
        if (!res.ok) {
          console.error("[send-technician-email] Resend API error:", res.status, result);
          return new Response(
            JSON.stringify({ error: result.message || "Email delivery failed" }),
            { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        console.log("[send-technician-email] Sent via Resend:", result.id);
        return new Response(
          JSON.stringify({ success: true, message: "Email sent successfully", id: result.id }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      } catch (sendErr) {
        console.error("[send-technician-email] Resend request failed:", sendErr);
        return new Response(
          JSON.stringify({ error: "Email service error. Please try again later." }),
          { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    console.log("[send-technician-email] No RESEND_API_KEY; email logged only:", { to, subject });
    return new Response(
      JSON.stringify({
        success: true,
        message: "Email queued (configure RESEND_API_KEY for delivery)",
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("[send-technician-email] Error:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
