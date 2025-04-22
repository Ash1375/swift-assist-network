
import React, { createContext, useContext, useState, useEffect } from "react";

// Define the technician type
type Technician = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  experience: number;
  specialties: string[];
  verificationStatus: "pending" | "verified" | "rejected";
};

// Define the technician auth context type
type TechnicianAuthContextType = {
  technician: Technician | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string, 
    email: string, 
    password: string, 
    phone: string, 
    address: string,
    experience: number,
    specialties: string[]
  ) => Promise<void>;
  logout: () => void;
};

// Create the context with a default value
const TechnicianAuthContext = createContext<TechnicianAuthContextType>({
  technician: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// Demo technicians for our mock authentication
const demoTechnicians: Array<Omit<Technician, 'verificationStatus'> & { password: string, verificationStatus: "pending" | "verified" | "rejected" }> = [
  {
    id: "1",
    name: "John Smith",
    email: "tech@example.com",
    password: "password123",
    phone: "123-456-7890",
    address: "123 Main St, City, State",
    experience: 5,
    specialties: ["Tire Change", "Jump Start", "Towing"],
    verificationStatus: "verified",
  },
];

export const TechnicianAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [technician, setTechnician] = useState<Technician | null>(null);

  // Check if technician is already logged in from localStorage
  useEffect(() => {
    const storedTechnician = localStorage.getItem("towbuddy_technician");
    if (storedTechnician) {
      setTechnician(JSON.parse(storedTechnician));
    }
  }, []);

  // Login function - simulates authentication
  const login = async (email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        const foundTechnician = demoTechnicians.find(
          (t) => t.email === email && t.password === password
        );
        
        if (foundTechnician) {
          const { password, ...technicianWithoutPassword } = foundTechnician;
          setTechnician(technicianWithoutPassword);
          localStorage.setItem("towbuddy_technician", JSON.stringify(technicianWithoutPassword));
          resolve();
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 500);
    });
  };

  // Register function - simulates technician registration
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
      // Simulate API call delay
      setTimeout(() => {
        const existingTechnician = demoTechnicians.find((t) => t.email === email);
        
        if (existingTechnician) {
          reject(new Error("Email already in use"));
        } else {
          // Create new technician with pending status
          const newTechnician = {
            id: (demoTechnicians.length + 1).toString(),
            name,
            email,
            password,
            phone,
            address,
            experience,
            specialties,
            verificationStatus: "pending" as const,
          };
          
          // Add to demo technicians array
          demoTechnicians.push(newTechnician);
          
          // Set the current technician without the password
          const { password: _, ...technicianWithoutPassword } = newTechnician;
          // The type issue is fixed by ensuring technicianWithoutPassword matches the Technician type
          setTechnician(technicianWithoutPassword);
          localStorage.setItem("towbuddy_technician", JSON.stringify(technicianWithoutPassword));
          resolve();
        }
      }, 500);
    });
  };

  // Logout function
  const logout = () => {
    setTechnician(null);
    localStorage.removeItem("towbuddy_technician");
  };

  return (
    <TechnicianAuthContext.Provider
      value={{
        technician,
        isAuthenticated: !!technician,
        login,
        register,
        logout,
      }}
    >
      {children}
    </TechnicianAuthContext.Provider>
  );
};

// Custom hook to use the technician auth context
export const useTechnicianAuth = () => useContext(TechnicianAuthContext);
