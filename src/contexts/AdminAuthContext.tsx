import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Session, User } from "@supabase/supabase-js";

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

  // Check if user has admin role using server-side validation
  const verifyAdminRole = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .rpc('has_role', { _user_id: userId, _role: 'admin' });
      
      if (error) {
        console.error("Error checking admin role:", error);
        return false;
      }
      
      return data === true;
    } catch (error) {
      console.error("Error verifying admin role:", error);
      return false;
    }
  };

  // Fetch user profile data
  const fetchUserProfile = async (user: User): Promise<AdminUser | null> => {
    const isAdmin = await verifyAdminRole(user.id);
    
    if (!isAdmin) {
      return null;
    }

    // Get user profile for display name (handle missing profile gracefully)
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('user_id', user.id)
      .maybeSingle();

    return {
      id: user.id,
      email: user.email || '',
      name: profile?.full_name || user.email?.split('@')[0] || 'Admin',
      role: 'admin'
    };
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Use setTimeout to avoid potential deadlocks with Supabase auth
          setTimeout(async () => {
            const adminData = await fetchUserProfile(session.user);
            setAdminUser(adminData);
            setIsLoading(false);
          }, 0);
        } else {
          setAdminUser(null);
          setIsLoading(false);
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const adminData = await fetchUserProfile(session.user);
        setAdminUser(adminData);
      }
      setIsLoading(false);
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loginAdmin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Use Supabase Auth for login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error("Login failed");
      }

      // Verify admin role server-side
      const isAdmin = await verifyAdminRole(authData.user.id);
      
      if (!isAdmin) {
        // Sign out if not an admin
        await supabase.auth.signOut();
        throw new Error("Access denied: Admin privileges required");
      }

      const adminData = await fetchUserProfile(authData.user);
      
      if (!adminData) {
        await supabase.auth.signOut();
        throw new Error("Access denied: Admin privileges required");
      }

      setAdminUser(adminData);
      toast.success("Admin login successful");
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Admin login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutAdmin = async () => {
    await supabase.auth.signOut();
    setAdminUser(null);
    toast.success("Admin logged out");
    navigate("/");
  };

  const checkAdminAccess = async (): Promise<boolean> => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return false;
    }

    return verifyAdminRole(session.user.id);
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
  const { isAdminAuthenticated, isLoading, checkAdminAccess } = useAdminAuth();
  const navigate = useNavigate();
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const verify = async () => {
      if (!isLoading) {
        // Always verify admin status server-side
        const hasAccess = await checkAdminAccess();
        setVerified(hasAccess);
        
        if (!hasAccess) {
          toast.error("Admin access required");
          navigate("/admin/login");
        }
      }
    };
    
    verify();
  }, [isLoading, isAdminAuthenticated, navigate, checkAdminAccess]);

  if (isLoading || verified === null) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return verified ? <>{children}</> : null;
};
