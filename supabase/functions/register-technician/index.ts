import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RegisterTechnicianBody {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  region: string;
  district: string;
  state: string;
  locality: string;
  service_area_range: number;
  experience: number;
  specialties: string[];
  pricing: Record<string, number>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("[register-technician] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const body = (await req.json()) as RegisterTechnicianBody;

    const {
      email,
      password,
      name,
      phone = "",
      address = "",
      region = "",
      district = "",
      state = "",
      locality = "",
      service_area_range = 10,
      experience = 0,
      specialties = [],
      pricing = {},
    } = body;

    if (!email?.trim() || !password?.trim() || !name?.trim()) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, password, name" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password: password.trim(),
      email_confirm: true,
      user_metadata: { is_technician: true, name: name.trim() },
    });

    if (authError) {
      console.error("[register-technician] Auth createUser error:", authError.message, authError);
      const msg = authError.message?.toLowerCase() || "";
      if (msg.includes("already") || msg.includes("already been registered")) {
        return new Response(
          JSON.stringify({ error: "This email is already registered. Please log in or use a different email." }),
          { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      return new Response(
        JSON.stringify({ error: authError.message || "Could not create account." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!authData.user) {
      return new Response(
        JSON.stringify({ error: "Failed to create user account." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const technicianRow = {
      user_id: authData.user.id,
      name: name.trim(),
      email: normalizedEmail,
      phone: (phone || "").trim(),
      address: (address || "").trim(),
      region: (region || "").trim(),
      district: (district || "").trim(),
      state: (state || "").trim(),
      locality: (locality || "").trim(),
      service_area_range: Number(service_area_range) || 10,
      experience: Number(experience) || 0,
      specialties: Array.isArray(specialties) ? specialties : [],
      pricing: pricing && typeof pricing === "object" ? pricing : {},
      verification_status: "pending",
      status: "PENDING",
      is_approved: false,
      email_verified: false,
    };

    const { data: technician, error: insertError } = await supabase
      .from("technicians")
      .insert(technicianRow)
      .select()
      .single();

    if (insertError) {
      console.error("[register-technician] Insert technicians error:", insertError.message, insertError);
      const code = (insertError as { code?: string }).code || "";
      if (code === "23505") {
        await supabase.auth.admin.deleteUser(authData.user.id);
        return new Response(
          JSON.stringify({ error: "This email or phone is already registered. Please use different details." }),
          { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      return new Response(
        JSON.stringify({ error: insertError.message || "Could not save your application. Please try again." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        technician: {
          id: technician.id,
          name: technician.name,
          email: technician.email,
          verification_status: technician.verification_status,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (err) {
    console.error("[register-technician] Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Registration failed. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
