
import { Technician, TechnicianWithPassword } from "@/types/technician";
import { demoTechnicians } from "@/mocks/technicians";
import { emailService } from "./emailService";

export const technicianAuthService = {
  login: async (email: string, password: string): Promise<Technician> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundTechnician = demoTechnicians.find(
          (t) => t.email === email && t.password === password
        );
        
        if (foundTechnician) {
          const { password: _, ...technicianWithoutPassword } = foundTechnician;
          resolve(technicianWithoutPassword);
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 500);
    });
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
    serviceAreaRange: number,
    experience: number,
    specialties: string[],
    pricing: Record<string, number>
  ): Promise<Technician> => {
    return new Promise((resolve, reject) => {
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
            region,
            district,
            state,
            serviceAreaRange,
            experience,
            specialties,
            pricing,
            verification_status: "pending",
          };
          
          demoTechnicians.push(newTechnician);
          
          const { password: _, ...technicianWithoutPassword } = newTechnician;
          resolve(technicianWithoutPassword);
        }
      }, 500);
    });
  },

  approveTechnician: async (technicianId: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const technicianIndex = demoTechnicians.findIndex(t => t.id === technicianId);
        
        if (technicianIndex === -1) {
          reject(new Error("Technician not found"));
          return;
        }
        
        demoTechnicians[technicianIndex].verification_status = "verified";
        
        // Send approval email to technician
        emailService.sendTechnicianStatusEmail(
          demoTechnicians[technicianIndex].email,
          demoTechnicians[technicianIndex].name,
          true
        );
        
        resolve(true);
      }, 500);
    });
  },

  rejectTechnician: async (technicianId: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const technicianIndex = demoTechnicians.findIndex(t => t.id === technicianId);
        
        if (technicianIndex === -1) {
          reject(new Error("Technician not found"));
          return;
        }
        
        demoTechnicians[technicianIndex].verification_status = "rejected";
        
        // Send rejection email to technician
        emailService.sendTechnicianStatusEmail(
          demoTechnicians[technicianIndex].email,
          demoTechnicians[technicianIndex].name,
          false
        );
        
        resolve(true);
      }, 500);
    });
  },

  logout: () => {
    localStorage.removeItem("towbuddy_technician");
  }
};
