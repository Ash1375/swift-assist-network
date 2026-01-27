import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  technicianId: string;
  requestId: string;
  serviceType: string;
  customerName?: string;
  customerPhone?: string;
  address?: string;
  notificationType: 'new_request' | 'status_update' | 'cancellation';
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: NotificationPayload = await req.json();
    console.log('Notification payload received:', payload);

    // Fetch technician details
    const { data: technician, error: techError } = await supabase
      .from('technicians')
      .select('name, phone, email')
      .eq('id', payload.technicianId)
      .single();

    if (techError || !technician) {
      console.error('Error fetching technician:', techError);
      return new Response(
        JSON.stringify({ error: 'Technician not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Technician found:', technician.name, technician.phone);

    // Build notification message based on type
    let message = '';
    let subject = '';

    switch (payload.notificationType) {
      case 'new_request':
        subject = '🔔 New Service Request!';
        message = `Hi ${technician.name}! You have a new ${payload.serviceType} request.`;
        if (payload.customerName) message += ` Customer: ${payload.customerName}.`;
        if (payload.address) message += ` Location: ${payload.address}.`;
        message += ` Open your dashboard to accept.`;
        break;
      
      case 'status_update':
        subject = '📋 Request Status Updated';
        message = `Request #${payload.requestId.slice(0, 8)} has been updated. Check your dashboard for details.`;
        break;
      
      case 'cancellation':
        subject = '❌ Request Cancelled';
        message = `The service request #${payload.requestId.slice(0, 8)} has been cancelled by the customer.`;
        break;
    }

    // Log the notification (in production, integrate with SMS provider like Twilio, MSG91, etc.)
    console.log('=== NOTIFICATION ===');
    console.log(`To: ${technician.phone}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log('====================');

    // Store notification in database for tracking
    const { error: notifError } = await supabase
      .from('notifications')
      .insert({
        technician_id: payload.technicianId,
        request_id: payload.requestId,
        type: payload.notificationType,
        message: message,
        phone: technician.phone,
        status: 'pending', // Would be 'sent' after actual SMS integration
        created_at: new Date().toISOString()
      });

    // Note: The notifications table may not exist yet - that's okay, we log it
    if (notifError) {
      console.log('Notification not stored (table may not exist):', notifError.message);
    }

    // TODO: Integrate with SMS provider
    // Example with Twilio:
    // const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    // const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    // const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');
    // 
    // if (twilioAccountSid && twilioAuthToken && twilioPhoneNumber) {
    //   const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
    //   const response = await fetch(twilioUrl, {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': 'Basic ' + btoa(`${twilioAccountSid}:${twilioAuthToken}`),
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //     body: new URLSearchParams({
    //       To: technician.phone,
    //       From: twilioPhoneNumber,
    //       Body: message,
    //     }),
    //   });
    //   const result = await response.json();
    //   console.log('Twilio response:', result);
    // }

    // Send email notification as backup
    try {
      await supabase.functions.invoke('send-technician-email', {
        body: {
          to: technician.email,
          subject: subject,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #2563eb;">${subject}</h2>
              <p style="font-size: 16px; line-height: 1.5;">${message}</p>
              <div style="margin-top: 20px;">
                <a href="https://swift-assist-network.lovable.app/technician/dashboard" 
                   style="background-color: #2563eb; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 6px; display: inline-block;">
                  Open Dashboard
                </a>
              </div>
              <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
                This is an automated notification from SwiftAssist.
              </p>
            </div>
          `
        }
      });
      console.log('Email notification sent');
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification queued',
        details: {
          phone: technician.phone,
          email: technician.email,
          notificationType: payload.notificationType
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in notify-technician function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
