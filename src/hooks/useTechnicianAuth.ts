
import { useState, useEffect } from "react";
import { Technician } from "@/types/technician";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export const useTechnicianAuth = () => {
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTechnicianAuth = async () => {
      // Check if there is an active Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Check if the authenticated user is a technician
        try {
          const { data: techData, error } = await supabase
            .from('technicians')
            .select('*')
            .eq('email', session.user.email)
            .single();
            
          if (techData) {
            // Transform database column names to our Technician type properties
            const mappedTechnician: Technician = {
              id: techData.id,
              name: techData.name,
              email: techData.email,
              phone: techData.phone,
              address: techData.address,
              region: techData.region,
              district: techData.district,
              state: techData.state,
              serviceAreaRange: techData.service_area_range,
              experience: techData.experience,
              specialties: techData.specialties || [],
              pricing: techData.pricing ? (techData.pricing as Record<string, number>) : {},
              verification_status: techData.verification_status as "pending" | "verified" | "rejected"
            };
            
            setTechnician(mappedTechnician);
            localStorage.setItem("towbuddy_technician", JSON.stringify(mappedTechnician));
          }
        } catch (error) {
          console.error("Error fetching technician:", error);
        }
      } else {
        // Check if we have stored technician information locally
        const storedTechnician = localStorage.getItem("towbuddy_technician");
        if (storedTechnician) {
          const parsedTech = JSON.parse(storedTechnician);
          // Validate that the stored technician data is still valid via API call
          try {
            const { data } = await supabase
              .from('technicians')
              .select('verification_status')
              .eq('id', parsedTech.id)
              .single();
              
            if (data) {
              // Update the verification status which might have changed
              parsedTech.verification_status = data.verification_status;
              setTechnician(parsedTech);
              localStorage.setItem("towbuddy_technician", JSON.stringify(parsedTech));
            } else {
              // If technician no longer exists, clear local storage
              localStorage.removeItem("towbuddy_technician");
            }
          } catch (error) {
            console.error("Error validating stored technician:", error);
            localStorage.removeItem("towbuddy_technician");
          }
        }
      }
      
      setIsLoading(false);
    };
    
    checkTechnicianAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (authError) throw authError;
      
      // Fetch technician profile from the database
      const { data: technicianData, error: techFetchError } = await supabase
        .from('technicians')
        .select('*')
        .eq('email', email)
        .single();
        
      if (techFetchError) {
        // If not found as technician, check if it's a regular user account
        const checkAuthError = new Error("Email not registered as a technician. Please use the technician registration page.");
        throw checkAuthError;
      }
      
      // Map database fields to our Technician type
      const mappedTechnician: Technician = {
        id: technicianData.id,
        name: technicianData.name,
        email: technicianData.email,
        phone: technicianData.phone,
        address: technicianData.address,
        region: technicianData.region,
        district: technicianData.district,
        state: technicianData.state,
        serviceAreaRange: technicianData.service_area_range,
        experience: technicianData.experience,
        specialties: technicianData.specialties,
        pricing: technicianData.pricing as Record<string, number>,
        verification_status: technicianData.verification_status as "pending" | "verified" | "rejected"
      };
      
      setTechnician(mappedTechnician);
      localStorage.setItem("towbuddy_technician", JSON.stringify(mappedTechnician));
      return mappedTechnician;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    phone: string, 
    address: string,
    region: string,
    district: string,
    state: string,
    serviceAreaRange: number,
    experience: number,
    specialties: string[],
    pricing: Record<string, number>
  ) => {
    try {
      // First create a user account in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            is_technician: true,
            name
          },
        }
      });
      
      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error("Failed to create user account");
      }
      
      // Then create the technician record
      const technicianData = {
        id: authData.user.id, // Use the auth user's ID as the technician ID
        name,
        email,
        phone,
        address,
        region,
        district,
        state,
        service_area_range: serviceAreaRange,
        experience,
        specialties,
        pricing,
        verification_status: 'pending'
      };
      
      const { data, error } = await supabase
        .from('technicians')
        .insert(technicianData)
        .select()
        .single();
        
      if (error) {
        console.error("Error creating technician record:", error);
        throw error;
      }
      
      // Map database fields to our Technician type
      const mappedTechnician: Technician = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        region: data.region,
        district: data.district,
        state: data.state,
        serviceAreaRange: data.service_area_range,
        experience: data.experience,
        specialties: data.specialties,
        pricing: data.pricing as Record<string, number>,
        verification_status: data.verification_status as "pending" | "verified" | "rejected"
      };
      
      setTechnician(mappedTechnician);
      localStorage.setItem("towbuddy_technician", JSON.stringify(mappedTechnician));
      return mappedTechnician;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const approveTechnician = async (technicianId: string) => {
    try {
      const { error } = await supabase
        .from('technicians')
        .update({ verification_status: 'verified' })
        .eq('id', technicianId);
        
      if (error) throw error;
      
      // Call the email function to notify technician
      const { data: techData } = await supabase
        .from('technicians')
        .select('name, email')
        .eq('id', technicianId)
        .single();
        
      if (techData) {
        await sendTechnicianStatusEmail(techData.email, techData.name, true);
      }
      
      return true;
    } catch (error) {
      console.error("Error approving technician:", error);
      toast.error("Failed to approve technician");
      return false;
    }
  };

  const rejectTechnician = async (technicianId: string) => {
    try {
      const { error } = await supabase
        .from('technicians')
        .update({ verification_status: 'rejected' })
        .eq('id', technicianId);
        
      if (error) throw error;
      
      // Call the email function to notify technician
      const { data: techData } = await supabase
        .from('technicians')
        .select('name, email')
        .eq('id', technicianId)
        .single();
        
      if (techData) {
        await sendTechnicianStatusEmail(techData.email, techData.name, false);
      }
      
      return true;
    } catch (error) {
      console.error("Error rejecting technician:", error);
      toast.error("Failed to reject technician");
      return false;
    }
  };
  
  const sendTechnicianStatusEmail = async (email: string, name: string, isApproved: boolean) => {
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
    
    return await supabase.functions.invoke("send-technician-email", {
      body: { to: email, subject, html }
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setTechnician(null);
    localStorage.removeItem("towbuddy_technician");
  };

  return {
    technician,
    isAuthenticated: !!technician,
    isLoading,
    login,
    register,
    approveTechnician,
    rejectTechnician,
    logout,
  };
};
