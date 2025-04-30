
import { TechnicianWithPassword } from "@/types/technician";

export const demoTechnicians: TechnicianWithPassword[] = [
  {
    id: "1",
    name: "John Smith",
    email: "tech@example.com",
    password: "password123",
    phone: "123-456-7890",
    address: "123 Main St, City, State",
    region: "Central",
    district: "Downtown",
    state: "California",
    serviceAreaRange: 25,
    experience: 5,
    specialties: ["Tire Change", "Jump Start", "Towing"],
    pricing: {
      towing: 80,
      tireChange: 40,
      jumpStart: 35
    },
    verification_status: "verified",
  },
];
