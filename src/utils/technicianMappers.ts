
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
    serviceAreaRange: data.service_area_range, // map from snake_case to camelCase
    experience: data.experience,
    specialties: data.specialties || [],
    pricing: data.pricing ? (data.pricing as Record<string, number>) : {},
    verification_status: data.verification_status as "pending" | "verified" | "rejected"
  };
};
