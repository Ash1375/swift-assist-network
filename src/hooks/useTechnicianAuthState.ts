
import { useState, useEffect } from "react";
import { Technician, TechnicianWithPassword } from "@/types/technician";
import { demoTechnicians } from "@/mocks/technicians";

export const useTechnicianAuthState = () => {
  const [technician, setTechnician] = useState<Technician | null>(null);

  useEffect(() => {
    const storedTechnician = localStorage.getItem("towbuddy_technician");
    if (storedTechnician) {
      setTechnician(JSON.parse(storedTechnician));
    }
  }, []);

  const login = async (email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const foundTechnician = demoTechnicians.find(
          (t) => t.email === email && t.password === password
        );
        
        if (foundTechnician) {
          const { password: _, ...technicianWithoutPassword } = foundTechnician;
          setTechnician(technicianWithoutPassword);
          localStorage.setItem("towbuddy_technician", JSON.stringify(technicianWithoutPassword));
          resolve();
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 500);
    });
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
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const existingTechnician = demoTechnicians.find((t) => t.email === email);
        
        if (existingTechnician) {
          reject(new Error("Email already in use"));
        } else {
          const newTechnician: TechnicianWithPassword = {
            id: (demoTechnicians.length + 1).toString(),
            name,
            email,
            password,
            phone,
            address,
            experience,
            specialties,
            verificationStatus: "pending",
          };
          
          demoTechnicians.push(newTechnician);
          
          const { password: _, ...technicianWithoutPassword } = newTechnician;
          setTechnician(technicianWithoutPassword);
          localStorage.setItem("towbuddy_technician", JSON.stringify(technicianWithoutPassword));
          resolve();
        }
      }, 500);
    });
  };

  const logout = () => {
    setTechnician(null);
    localStorage.removeItem("towbuddy_technician");
  };

  return {
    technician,
    isAuthenticated: !!technician,
    login,
    register,
    logout,
  };
};
