import { Technician } from "@/types/technician";
import { apiFetch, setTechnicianToken } from "@/lib/api";

const BASE = "/api/technicians";

function mapTechnicianData(data: Record<string, unknown>): Technician {
  return {
    id: String(data.id),
    name: String(data.name),
    email: String(data.email),
    phone: String(data.phone ?? ""),
    address: String(data.address ?? ""),
    region: String(data.region ?? ""),
    district: String(data.district ?? ""),
    state: String(data.state ?? ""),
    locality: data.locality != null ? String(data.locality) : undefined,
    serviceAreaRange: Number(data.serviceAreaRange ?? 0),
    experience: Number(data.experience ?? 0),
    specialties: Array.isArray(data.specialties) ? data.specialties as string[] : [],
    pricing: data.pricing && typeof data.pricing === "object" ? data.pricing as Record<string, number> : {},
    verification_status: (data.verification_status as "pending" | "verified" | "rejected") || "pending",
  };
}

export const technicianAuthService = {
  fetchTechnicianProfile: async (email: string): Promise<Technician> => {
    const res = await apiFetch(`${BASE}/me`, { method: "GET", technician: true });
    if (!res.ok) {
      if (res.status === 401) throw new Error("Session expired. Please log in again.");
      throw new Error("Technician profile not found");
    }
    const data = await res.json();
    return mapTechnicianData(data);
  },

  validateStoredTechnician: async (technicianId: string) => {
    const res = await apiFetch(`${BASE}/me`, { method: "GET", technician: true });
    if (!res.ok) return null;
    const data = await res.json();
    if (String(data.id) !== String(technicianId)) return null;
    return { verification_status: data.verification_status };
  },

  login: async (email: string, password: string): Promise<Technician> => {
    const res = await apiFetch(`${BASE}/login`, {
      method: "POST",
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const msg = body.error || "Login failed.";
      throw new Error(msg);
    }
    const { token, technician } = await res.json();
    setTechnicianToken(token);
    return mapTechnicianData(technician);
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
    const normalizedEmail = (email || "").trim().toLowerCase();
    const trimmedName = (name || "").trim();
    const res = await apiFetch(`${BASE}/register`, {
      method: "POST",
      body: JSON.stringify({
        name: trimmedName,
        email: normalizedEmail,
        password,
        phone: (phone || "").trim(),
        address: (address || "").trim(),
        region: (region || "").trim(),
        district: (district || "").trim(),
        state: (state || "").trim(),
        locality: (locality || "").trim(),
        serviceAreaRange: Number(serviceAreaRange) || 10,
        experience: Number(experience) || 0,
        specialties: Array.isArray(specialties) ? specialties : [],
        pricing: pricing && typeof pricing === "object" ? pricing : {},
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const msg = body.error || "Registration failed. Please try again.";
      throw new Error(msg);
    }
    const data = await res.json();
    return {
      id: String(data.id),
      name: data.name,
      email: data.email,
      phone: phone || "",
      address,
      region,
      district,
      state,
      locality,
      serviceAreaRange: Number(serviceAreaRange) || 10,
      experience: Number(experience) || 0,
      specialties: Array.isArray(specialties) ? specialties : [],
      pricing: pricing && typeof pricing === "object" ? pricing : {},
      verification_status: "pending" as const,
    };
  },

  logout: async () => {
    setTechnicianToken(null);
    localStorage.removeItem("resqnow_technician");
    return true;
  },
};
