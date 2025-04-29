
export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  experience: number;
  specialties: string[];
  termsAccepted: boolean;
};

export const specialtiesOptions = [
  { id: "towing", label: "Towing" },
  { id: "tire-change", label: "Tire Change" },
  { id: "jump-start", label: "Jump Start" },
  { id: "fuel-delivery", label: "Fuel Delivery" },
  { id: "lockout", label: "Lockout Service" },
  { id: "winching", label: "Winching" },
];
