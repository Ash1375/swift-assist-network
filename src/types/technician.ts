
export type Technician = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  experience: number;
  specialties: string[];
  verificationStatus: "pending" | "verified" | "rejected";
};

export type TechnicianWithPassword = Omit<Technician, 'verificationStatus'> & {
  password: string;
  verificationStatus: "pending" | "verified" | "rejected";
};

export type TechnicianAuthContextType = {
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
