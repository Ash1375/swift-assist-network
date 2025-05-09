
export type VerificationStatus = "pending" | "verified" | "rejected";

export type Technician = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  region: string;
  district: string;
  state: string;
  locality?: string; // Added locality field
  serviceAreaRange: number;
  experience: number;
  specialties: string[];
  pricing: Record<string, number>;
  verification_status: VerificationStatus;
};

export type TechnicianWithPassword = Technician & {
  password: string;
};

export interface TechnicianAuthContextType {
  technician: Technician | null;
  isAuthenticated: boolean;
  isLoading: boolean;  // Added this line to fix the TypeScript error
  login: (email: string, password: string) => Promise<any>;
  register: (
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
  ) => Promise<any>;
  approveTechnician: (technicianId: string) => Promise<boolean>;
  rejectTechnician: (technicianId: string) => Promise<boolean>;
  logout: () => void;
}
