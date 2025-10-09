import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { serviceType, vehicleType, location, technicians } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create technician summary for AI
    const technicianSummary = technicians.map((tech: any, idx: number) => 
      `${idx + 1}. ${tech.name} - Rating: ${tech.rating}/5, Jobs: ${tech.completedJobs}, ` +
      `Distance: ${tech.distance}, ETA: ${tech.estimatedArrival}, ` +
      `Price: ${tech.price}, Specialties: ${tech.specialties.join(', ')}`
    ).join('\n');

    const systemPrompt = `You are an expert vehicle service matching assistant. Analyze the service request and available technicians to provide intelligent recommendations.

Consider these factors in priority order:
1. Service type expertise (specialties matching the service needed)
2. Customer ratings and completed jobs (reliability)
3. Distance and estimated arrival time (convenience)
4. Pricing (value for money)

Provide 3 recommendations with clear reasoning.`;

    const userPrompt = `Service Request:
- Service Type: ${serviceType}
- Vehicle Type: ${vehicleType}
- Location: ${location}

Available Technicians:
${technicianSummary}

Recommend the top 3 technicians with brief reasoning for each.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service requires payment. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const recommendation = data.choices[0]?.message?.content || "No recommendation available";

    return new Response(
      JSON.stringify({ recommendation }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        recommendation: "Unable to generate AI recommendations at this time."
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
