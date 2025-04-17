
import React, { createContext, useContext, useState, useEffect } from "react";

// Define the user type
type User = {
  id: string;
  name: string;
  email: string;
  subscription: "none" | "basic" | "premium" | "enterprise";
};

// Define the auth context type
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateSubscription: (plan: "none" | "basic" | "premium" | "enterprise") => void;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateSubscription: () => {},
});

// Demo users for our mock authentication
const demoUsers = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
    password: "password123",
    subscription: "none" as const,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("towbuddy_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function - simulates authentication
  const login = async (email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        const foundUser = demoUsers.find(
          (u) => u.email === email && u.password === password
        );
        
        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          localStorage.setItem("towbuddy_user", JSON.stringify(userWithoutPassword));
          resolve();
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 500);
    });
  };

  // Register function - simulates user registration
  const register = async (name: string, email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        const existingUser = demoUsers.find((u) => u.email === email);
        
        if (existingUser) {
          reject(new Error("Email already in use"));
        } else {
          const newUser = {
            id: (demoUsers.length + 1).toString(),
            name,
            email,
            password,
            subscription: "none" as const,
          };
          
          demoUsers.push(newUser);
          
          const { password: _, ...userWithoutPassword } = newUser;
          setUser(userWithoutPassword);
          localStorage.setItem("towbuddy_user", JSON.stringify(userWithoutPassword));
          resolve();
        }
      }, 500);
    });
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("towbuddy_user");
  };

  // Update subscription
  const updateSubscription = (plan: "none" | "basic" | "premium" | "enterprise") => {
    if (user) {
      const updatedUser = { ...user, subscription: plan };
      setUser(updatedUser);
      localStorage.setItem("towbuddy_user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
