
import { useState, useEffect } from "react";
import { Technician } from "@/types/technician";
import { supabase } from "@/integrations/supabase/client";
import { technicianAuthService } from "@/services/technicianAuthService";
import { technicianAdminService } from "@/services/technicianAdminService";

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
          const techData = await technicianAuthService.fetchTechnicianProfile(session.user.email!);
          setTechnician(techData);
          localStorage.setItem("towbuddy_technician", JSON.stringify(techData));
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
            const data = await technicianAuthService.validateStoredTechnician(parsedTech.id);
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
    const technicianData = await technicianAuthService.login(email, password);
    setTechnician(technicianData);
    localStorage.setItem("towbuddy_technician", JSON.stringify(technicianData));
    return technicianData;
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
    locality: string, // Added locality parameter 
    serviceAreaRange: number,
    experience: number,
    specialties: string[],
    pricing: Record<string, number>
  ) => {
    const technicianData = await technicianAuthService.register(
      name, email, password, phone, address,
      region, district, state, locality, serviceAreaRange,
      experience, specialties, pricing
    );
    
    setTechnician(technicianData);
    localStorage.setItem("towbuddy_technician", JSON.stringify(technicianData));
    return technicianData;
  };

  const logout = async () => {
    await technicianAuthService.logout();
    setTechnician(null);
  };

  return {
    technician,
    isAuthenticated: !!technician,
    isLoading,
    login,
    register,
    approveTechnician: technicianAdminService.approveTechnician,
    rejectTechnician: technicianAdminService.rejectTechnician,
    logout,
  };
};
