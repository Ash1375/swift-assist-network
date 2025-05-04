
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  loginAdmin: (email: string, password: string) => Promise<void>;
  logoutAdmin: () => Promise<void>;
  checkAdminAccess: () => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  adminUser: null,
  isAdminAuthenticated: false,
  isLoading: true,
  loginAdmin: async () => {},
  logoutAdmin: async () => {},
  checkAdminAccess: async () => false,
});

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing admin session
    const storedAdmin = localStorage.getItem("towbuddy_admin");
    if (storedAdmin) {
      setAdminUser(JSON.parse(storedAdmin));
    }
    
    // For a real application, here we would validate the admin token
    // with Supabase or another backend service
    
    setIsLoading(false);
  }, []);

  const loginAdmin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // For demo purposes, we're using a hardcoded admin
      // In a real app, this would validate against Supabase Auth
      if (email === "admin@towbuddy.com" && password === "adminpassword") {
        const adminData = {
          id: "admin-1",
          email: "admin@towbuddy.com",
          name: "Admin User",
          role: "admin"
        };
        
        setAdminUser(adminData);
        localStorage.setItem("towbuddy_admin", JSON.stringify(adminData));
        toast.success("Admin login successful");
        navigate("/admin/dashboard");
      } else {
        throw new Error("Invalid admin credentials");
      }
    } catch (error: any) {
      toast.error(error.message || "Admin login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutAdmin = async () => {
    setAdminUser(null);
    localStorage.removeItem("towbuddy_admin");
    toast.success("Admin logged out");
    navigate("/");
  };

  const checkAdminAccess = async () => {
    // This function would verify the admin's token/session
    // For now we just check if we have an admin user in state
    return !!adminUser;
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAdminAuthenticated: !!adminUser,
        isLoading,
        loginAdmin,
        logoutAdmin,
        checkAdminAccess,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdminAuthenticated, isLoading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAdminAuthenticated) {
      toast.error("Admin access required");
      navigate("/admin/login");
    }
  }, [isAdminAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return isAdminAuthenticated ? <>{children}</> : null;
};
