
import { useState, useEffect } from "react";
import { Technician } from "@/types/technician";
import { supabase } from "@/integrations/supabase/client";

export const useTechnicianAuth = () => {
  const [technician, setTechnician] = useState<Technician | null>(null);

  useEffect(() => {
    const storedTechnician = localStorage.getItem("towbuddy_technician");
    if (storedTechnician) {
      setTechnician(JSON.parse(storedTechnician));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Fetch technician profile from the database
      const { data: technicianData, error: techFetchError } = await supabase
        .from('technicians')
        .select('*')
        .eq('email', email)
        .single();
        
      if (techFetchError) throw techFetchError;
      
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
        pricing: technicianData.pricing,
        verification_status: technicianData.verification_status
      };
      
      setTechnician(mappedTechnician);
      localStorage.setItem("towbuddy_technician", JSON.stringify(mappedTechnician));
      return technicianData;
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
      // Create a new user in Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (authError) throw authError;
      
      // Add the technician to the technicians table
      const technicianData = {
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
        
      if (error) throw error;
      
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
        pricing: data.pricing,
        verification_status: data.verification_status
      };
      
      setTechnician(mappedTechnician);
      localStorage.setItem("towbuddy_technician", JSON.stringify(mappedTechnician));
      return data;
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
      return true;
    } catch (error) {
      console.error("Error approving technician:", error);
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
      return true;
    } catch (error) {
      console.error("Error rejecting technician:", error);
      return false;
    }
  };

  const logout = () => {
    supabase.auth.signOut();
    setTechnician(null);
    localStorage.removeItem("towbuddy_technician");
  };

  return {
    technician,
    isAuthenticated: !!technician,
    login,
    register,
    approveTechnician,
    rejectTechnician,
    logout,
  };
};
