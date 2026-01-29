import { Technician } from "@/types/technician";
import { supabase } from "@/integrations/supabase/client";

export const technicianAuthService = {
  fetchTechnicianProfile: async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('technicians')
        .select('*')
        .eq('email', email)
        .maybeSingle();
        
      if (error) throw error;
      if (!data) {
        throw new Error("Technician profile not found");
      }
      
      return mapTechnicianData(data);
    } catch (error) {
      console.error("Error fetching technician profile:", error);
      throw error;
    }
  },
  
  validateStoredTechnician: async (technicianId: string) => {
    try {
      const { data, error } = await supabase
        .from('technicians')
        .select('verification_status')
        .eq('id', technicianId)
        .maybeSingle();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error validating stored technician:", error);
      throw error;
    }
  },
  
  login: async (email: string, password: string) => {
    try {
      // Use Supabase Auth for login - passwords are managed by Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (authError) throw authError;
      
      // Fetch technician profile from technicians table
      const { data: technicianData, error: techFetchError } = await supabase
        .from('technicians')
        .select('*')
        .eq('email', email)
        .single();

      if (techFetchError) {
        throw new Error("Email not registered as a technician. Please use the technician registration page.");
      }

      const technician = mapTechnicianData(technicianData);

      // Only allow login when status is APPROVED and is_approved is true (verification_status === 'verified')
      const isApproved = (technicianData as { is_approved?: boolean })?.is_approved;
      if (technician.verification_status !== 'verified' || isApproved === false) {
        await supabase.auth.signOut();
        if (technician.verification_status === 'rejected') {
          throw new Error("Your application was not approved. Please contact support for more information.");
        }
        throw new Error("Your application is under review. You will receive an email after admin approval.");
      }

      return technician;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
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
    locality: string,
    serviceAreaRange: number,
    experience: number,
    specialties: string[],
    pricing: Record<string, number>
  ) => {
    // No Edge Function: registration uses Supabase Auth signUp + direct insert into technicians
    const normalizedEmail = (email || "").trim().toLowerCase();
    const trimmedName = (name || "").trim();

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: { 
          data: { name: trimmedName },
          emailRedirectTo: `${window.location.origin}/technician/login`,
        },
      });

      if (signUpError) {
        const msg = (signUpError.message || "").toLowerCase();
        if (msg.includes("already") || msg.includes("already been registered")) {
          throw new Error("This email is already registered. Please log in or use a different email.");
        }
        if (msg.includes("invalid") && msg.includes("email")) {
          throw new Error("Please enter a valid email address.");
        }
        if (msg.includes("password") || msg.includes("weak")) {
          throw new Error("Password must be at least 8 characters. Please choose a stronger password.");
        }
        throw new Error(signUpError.message || "Registration failed. Please try again.");
      }

      if (!authData?.user) {
        throw new Error("Account could not be created. Please try again.");
      }

      // Ensure session is available for RLS (if email confirmation is disabled, session is set)
      // If session exists, use it; otherwise the policy "Allow technician application with user_id" will allow insert
      if (authData.session) {
        // Session is available, RLS will use auth.uid() = user_id policy
        await supabase.auth.setSession(authData.session);
      }

      const { data: technicianRow, error: insertError } = await supabase
        .from("technicians")
        .insert({
          user_id: authData.user.id,
          name: trimmedName,
          email: normalizedEmail,
          phone: (phone || "").trim(),
          address: (address || "").trim(),
          region: (region || "").trim(),
          district: (district || "").trim(),
          state: (state || "").trim(),
          locality: (locality || "").trim(),
          service_area_range: Number(serviceAreaRange) || 10,
          experience: Number(experience) || 0,
          specialties: Array.isArray(specialties) ? specialties : [],
          pricing: pricing && typeof pricing === "object" ? pricing : {},
          verification_status: "pending",
          status: "PENDING",
          is_approved: false,
          email_verified: false,
        })
        .select()
        .single();

      if (insertError) {
        console.error("[TechnicianRegister] Insert error:", insertError.message, insertError);
        const code = (insertError as { code?: string }).code;
        const msg = (insertError.message || "").toLowerCase();
        if (code === "23505") {
          throw new Error("This email or phone is already registered. Please use different details.");
        }
        if (msg.includes("row-level security") || msg.includes("policy") || msg.includes("violates")) {
          throw new Error("Registration could not be completed. Please try again or contact support.");
        }
        if (msg.includes("column") && msg.includes("does not exist")) {
          throw new Error("Server schema is outdated. Please ask support to run the latest database migrations.");
        }
        throw new Error(insertError.message || "Could not save your application. Please try again.");
      }

      const t = technicianRow as { id: string; name: string; email: string; verification_status: string };
      return {
        id: t.id,
        name: t.name,
        email: t.email,
        phone: phone || "",
        address: address || "",
        region: region || "",
        district: district || "",
        state: state || "",
        locality: locality || "",
        serviceAreaRange: Number(serviceAreaRange) || 10,
        experience: Number(experience) || 0,
        specialties: Array.isArray(specialties) ? specialties : [],
        pricing: pricing && typeof pricing === "object" ? pricing : {},
        verification_status: (t.verification_status || "pending") as "pending" | "verified" | "rejected",
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error("[TechnicianRegister] Registration error:", error.message, error);
        throw error;
      }
      console.error("[TechnicianRegister] Unknown registration error:", error);
      throw new Error("Registration failed. Please try again.");
    }
  },
  
  logout: async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("resqnow_technician");
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }
};

// Parse Supabase Auth errors into user-friendly messages
function getAuthErrorMessage(error: { message?: string; status?: number }): Error {
  const msg = (error.message || "").toLowerCase();
  if (msg.includes("already registered") || msg.includes("user already exists") || msg.includes("already been registered")) {
    return new Error("This email is already registered. Please log in or use a different email.");
  }
  if (msg.includes("invalid email") || msg.includes("email")) {
    return new Error("Please enter a valid email address.");
  }
  if (msg.includes("password") || msg.includes("weak")) {
    return new Error("Password must be at least 8 characters. Please choose a stronger password.");
  }
  if (msg.includes("signup_disabled") || msg.includes("sign up")) {
    return new Error("Registration is temporarily disabled. Please contact support.");
  }
  return new Error(error.message || "Could not create account. Please try again.");
}

// Parse Supabase/Postgres errors into user-friendly messages
function getDbErrorMessage(error: { message?: string; code?: string; details?: string }): Error {
  const code = error.code || "";
  const msg = (error.message || "").toLowerCase();
  // 23505 = unique_violation
  if (code === "23505" || msg.includes("unique") || msg.includes("duplicate")) {
    if (msg.includes("email")) {
      return new Error("This email is already registered. Please log in or use a different email.");
    }
    if (msg.includes("phone")) {
      return new Error("This phone number is already in use. Please use a different number.");
    }
    return new Error("This email or phone is already registered. Please log in or use different details.");
  }
  // 23503 = foreign_key_violation
  if (code === "23503") {
    return new Error("Registration could not be completed. Please try again or contact support.");
  }
  // RLS policy violation
  if (msg.includes("row-level security") || msg.includes("policy") || msg.includes("violates")) {
    return new Error("Your account was created but we couldn't complete registration. Please confirm your email (check your inbox) and try logging in. If the problem persists, contact support.");
  }
  return new Error(error.message || "Could not save your application. Please try again.");
}

// Helper function to map database fields to our Technician type
const mapTechnicianData = (data: any): Technician => {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    region: data.region,
    district: data.district,
    state: data.state,
    locality: data.locality,
    serviceAreaRange: data.service_area_range,
    experience: data.experience,
    specialties: data.specialties || [],
    pricing: data.pricing ? (data.pricing as Record<string, number>) : {},
    verification_status: data.verification_status as "pending" | "verified" | "rejected"
  };
};
