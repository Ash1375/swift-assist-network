
import { Technician } from "@/types/technician";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export const technicianAuthService = {
  fetchTechnicianProfile: async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('technicians')
        .select('*')
        .eq('email', email)
        .single();
        
      if (error) throw error;
      
      return mapTechnicianData(data);
    } catch (error) {
      console.error("Error fetching technician profile:", error);
      throw error;
    }
  },
  
  validateStoredTechnician: async (technicianId: string) => {
    try {
      const { data, error } = await supabase
        .from('technicians')
        .select('verification_status')
        .eq('id', technicianId)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error validating stored technician:", error);
      throw error;
    }
  },
  
  login: async (email: string, password: string) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (authError) throw authError;
      
      const { data: technicianData, error: techFetchError } = await supabase
        .from('technicians')
        .select('*')
        .eq('email', email)
        .single();
        
      if (techFetchError) {
        throw new Error("Email not registered as a technician. Please use the technician registration page.");
      }
      
      return mapTechnicianData(technicianData);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
  
  register: async (
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
    try {
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
      
      const technicianData = {
        id: authData.user.id,
        name,
        email,
        phone,
        address,
        region,
        district,
        state,
        locality, // Added locality field
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
      
      return mapTechnicianData(data);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("towbuddy_technician");
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }
};

// Helper function to map database fields to our Technician type
const mapTechnicianData = (data: any): Technician => {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    region: data.region,
    district: data.district,
    state: data.state,
    locality: data.locality, // Added locality field
    serviceAreaRange: data.service_area_range,
    experience: data.experience,
    specialties: data.specialties || [],
    pricing: data.pricing ? (data.pricing as Record<string, number>) : {},
    verification_status: data.verification_status as "pending" | "verified" | "rejected"
  };
};
