import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function jsonResponse(body: object, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl?.trim() || !supabaseServiceKey?.trim()) {
    console.error("[get-technician-applications] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set them in Supabase Dashboard → Project Settings → Edge Functions → Secrets (or they are auto-injected when deployed).");
    return jsonResponse({ error: "Server configuration error" }, 500);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse({ error: "Unauthorized: Missing authorization header" }, 401);
    }

    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) {
      return jsonResponse({ error: "Unauthorized: Empty token" }, 401);
    }

    let userId: string | null = null;

    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (!claimsError && claimsData?.claims?.sub) {
      userId = String(claimsData.claims.sub);
    }
    if (!userId) {
      const { data: userData, error: userError } = await supabase.auth.getUser(token);
      if (!userError && userData?.user?.id) {
        userId = userData.user.id;
      }
    }
    if (!userId?.trim()) {
      console.error("[get-technician-applications] Invalid token:", claimsError?.message ?? "no claims, getUser failed");
      return jsonResponse({ error: "Unauthorized: Invalid token" }, 401);
    }

    const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });

    if (roleError) {
      console.error("[get-technician-applications] has_role error:", roleError.message);
      return jsonResponse({ error: "Forbidden: Admin access required" }, 403);
    }
    if (!isAdmin) {
      return jsonResponse({ error: "Forbidden: Admin access required" }, 403);
    }

    let statusFilter = "pending";
    const url = new URL(req.url);
    statusFilter = url.searchParams.get("status") ?? statusFilter;
    if (req.method === "POST") {
      try {
        const body = (await req.json()) as { status?: string };
        if (body?.status) statusFilter = body.status;
      } catch {
        // keep default
      }
    }

    let query = supabase.from("technicians").select("*").order("created_at", { ascending: false });
    if (statusFilter !== "all") {
      query = query.eq("verification_status", statusFilter);
    }

    const { data: rows, error } = await query;

    if (error) {
      console.error("[get-technician-applications] Select error:", error.message);
      return jsonResponse({ error: error.message || "Failed to load applications" }, 500);
    }

    const applications = Array.isArray(rows) ? rows : [];
    return jsonResponse({ applications }, 200);
  } catch (err) {
    console.error("[get-technician-applications] Error:", err);
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Internal server error" },
      500
    );
  }
});
