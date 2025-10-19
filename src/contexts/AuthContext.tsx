
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  subscription: "free" | "basic" | "premium" | "enterprise" | "none";
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<any>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateSubscription: (subscription: "free" | "basic" | "premium" | "enterprise" | "none") => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAuthenticated: false,
  loading: true,
  login: async () => ({}),
  register: async () => ({}),
  logout: () => {},
  updateProfile: async () => {},
  updateSubscription: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const setupAuth = async () => {
      // Set up auth state listener FIRST
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          setSession(newSession);
          
          if (event === 'SIGNED_IN' && newSession) {
            localStorage.setItem('isAuthenticated', 'true');
            try {
              // Query by user_id since profiles table uses that column
              const { data: profile, error } = await supabase
                .from('profiles' as any)
                .select('*')
                .eq('user_id', newSession.user.id)
                .maybeSingle();
              
              if (error && error.code !== 'PGRST116') {
                console.error("Error fetching user profile:", error);
              }
              
              if (profile) {
                setUser({
                  id: newSession.user.id,
                  name: (profile as any).full_name || newSession.user.email?.split('@')[0] || 'User',
                  email: newSession.user.email || '',
                  subscription: (profile as any).subscription_tier || 'free',
                });
              } else {
                // Create profile if it doesn't exist
                const { error: insertError } = await supabase
                  .from('profiles' as any)
                  .insert({
                    user_id: newSession.user.id,
                    full_name: newSession.user.user_metadata?.full_name || newSession.user.email?.split('@')[0] || 'User',
                    email: newSession.user.email,
                    subscription_tier: 'free'
                  });
                
                if (insertError) {
                  console.error("Error creating profile:", insertError);
                }
                
                setUser({
                  id: newSession.user.id,
                  name: newSession.user.user_metadata?.full_name || newSession.user.email?.split('@')[0] || 'User',
                  email: newSession.user.email || '',
                  subscription: 'free',
                });
              }
            } catch (error) {
              console.error("Error in auth state change:", error);
              // Set user anyway with basic info
              setUser({
                id: newSession.user.id,
                name: newSession.user.email?.split('@')[0] || 'User',
                email: newSession.user.email || '',
                subscription: 'free',
              });
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            localStorage.removeItem('isAuthenticated');
          }
        }
      );
      
      // THEN check for existing session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      
      if (currentSession?.user) {
        localStorage.setItem('isAuthenticated', 'true');
        try {
          // Query by user_id since profiles table uses that column
          const { data: profile, error } = await supabase
            .from('profiles' as any)
            .select('*')
            .eq('user_id', currentSession.user.id)
            .maybeSingle();
          
          if (error && error.code !== 'PGRST116') {
            console.error("Error fetching user profile:", error);
          }
          
          if (profile) {
            setUser({
              id: currentSession.user.id,
              name: (profile as any).full_name || currentSession.user.email?.split('@')[0] || 'User',
              email: currentSession.user.email || '',
              subscription: (profile as any).subscription_tier || 'free',
            });
          } else {
            // Set user with basic info, profile will be created on next sign in
            setUser({
              id: currentSession.user.id,
              name: currentSession.user.email?.split('@')[0] || 'User',
              email: currentSession.user.email || '',
              subscription: 'free',
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Set user anyway with basic info
          setUser({
            id: currentSession.user.id,
            name: currentSession.user.email?.split('@')[0] || 'User',
            email: currentSession.user.email || '',
            subscription: 'free',
          });
        }
      }
      
      setLoading(false);
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    setupAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };
  
  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      if (!user?.id) throw new Error("Not authenticated");
      
      // Use a type assertion to bypass type checking for the profiles table
      const { error } = await supabase
        .from('profiles' as any)
        .update({
          full_name: data.name,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setUser(prev => prev ? { ...prev, ...data } : null);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
      throw error;
    }
  };

  const updateSubscription = async (subscription: "free" | "basic" | "premium" | "enterprise" | "none") => {
    try {
      if (!user?.id) throw new Error("Not authenticated");
      
      // Use a type assertion to bypass type checking for the profiles table
      const { error } = await supabase
        .from('profiles' as any)
        .update({
          subscription_tier: subscription,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setUser(prev => prev ? { ...prev, subscription } : null);
      toast.success(`Subscription updated to ${subscription} successfully`);
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error("Failed to update subscription");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        updateSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
