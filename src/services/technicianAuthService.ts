
import { Technician, TechnicianWithPassword } from "@/types/technician";
import { demoTechnicians } from "@/mocks/technicians";

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
    experience: number,
    specialties: string[]
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
            experience,
            specialties,
            verificationStatus: "pending",
          };
          
          demoTechnicians.push(newTechnician);
          
          const { password: _, ...technicianWithoutPassword } = newTechnician;
          resolve(technicianWithoutPassword);
        }
      }, 500);
    });
  },

  logout: () => {
    localStorage.removeItem("towbuddy_technician");
  }
};

