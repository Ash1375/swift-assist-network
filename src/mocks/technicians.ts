
import { TechnicianWithPassword } from "@/types/technician";

export const demoTechnicians: TechnicianWithPassword[] = [
  {
    id: "1",
    name: "John Smith",
    email: "tech@example.com",
    password: "password123",
    phone: "123-456-7890",
    address: "123 Main St, City, State",
    experience: 5,
    specialties: ["Tire Change", "Jump Start", "Towing"],
    verificationStatus: "verified",
  },
];
