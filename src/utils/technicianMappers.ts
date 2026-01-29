
import { Technician } from "@/types/technician";

// Helper function to map database/API fields to our Technician type
export const mapTechnicianData = (data: any): Technician => {
  return {
    id: String(data.id),
    name: data.name,
    email: data.email,
    phone: data.phone ?? "",
    address: data.address ?? "",
    region: data.region ?? "",
    district: data.district ?? "",
    state: data.state ?? "",
    locality: data.locality,
    serviceAreaRange: data.serviceAreaRange ?? data.service_area_range ?? 0,
    experience: data.experience ?? 0,
    specialties: Array.isArray(data.specialties) ? data.specialties : [],
    pricing: data.pricing && typeof data.pricing === "object" ? (data.pricing as Record<string, number>) : {},
    verification_status: (data.verification_status || "pending") as "pending" | "verified" | "rejected"
  };
};
