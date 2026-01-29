
import { Technician } from "@/types/technician";

// Helper function to map database fields to our Technician type
export const mapTechnicianData = (data: any): Technician => {
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
    serviceAreaRange: data.service_area_range ?? 0,
    experience: data.experience ?? 0,
    specialties: data.specialties || [],
    pricing: data.pricing ? (data.pricing as Record<string, number>) : {},
    verification_status: data.verification_status as "pending" | "verified" | "rejected"
  };
};
