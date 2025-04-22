
import React, { createContext, useContext } from "react";
import { TechnicianAuthContextType } from "@/types/technician";
import { useTechnicianAuthState } from "@/hooks/useTechnicianAuthState";

const TechnicianAuthContext = createContext<TechnicianAuthContextType>({
  technician: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const TechnicianAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authState = useTechnicianAuthState();

  return (
    <TechnicianAuthContext.Provider value={authState}>
      {children}
    </TechnicianAuthContext.Provider>
  );
};

export const useTechnicianAuth = () => useContext(TechnicianAuthContext);
