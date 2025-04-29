
import { useState, useEffect } from "react";
import { Technician } from "@/types/technician";
import { technicianAuthService } from "@/services/technicianAuthService";

export const useTechnicianAuth = () => {
  const [technician, setTechnician] = useState<Technician | null>(null);

  useEffect(() => {
    const storedTechnician = localStorage.getItem("towbuddy_technician");
    if (storedTechnician) {
      setTechnician(JSON.parse(storedTechnician));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const authenticatedTechnician = await technicianAuthService.login(email, password);
    setTechnician(authenticatedTechnician);
    localStorage.setItem("towbuddy_technician", JSON.stringify(authenticatedTechnician));
    return authenticatedTechnician;
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    phone: string, 
    address: string,
    experience: number,
    specialties: string[]
  ) => {
    const registeredTechnician = await technicianAuthService.register(
      name, email, password, phone, address, experience, specialties
    );
    setTechnician(registeredTechnician);
    localStorage.setItem("towbuddy_technician", JSON.stringify(registeredTechnician));
    return registeredTechnician;
  };

  const approveTechnician = async (technicianId: string) => {
    return technicianAuthService.approveTechnician(technicianId);
  };

  const rejectTechnician = async (technicianId: string) => {
    return technicianAuthService.rejectTechnician(technicianId);
  };

  const logout = () => {
    technicianAuthService.logout();
    setTechnician(null);
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
