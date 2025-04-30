
export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  region: string;
  district: string;
  state: string;
  serviceAreaRange: number;
  experience: number;
  specialties: string[];
  pricing: {
    towing: number;
    tireChange: number;
    jumpStart: number;
    fuelDelivery: number;
    lockout: number;
    winching: number;
  };
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

export const regionOptions = [
  "North", "South", "East", "West", "Central", 
  "Northeast", "Northwest", "Southeast", "Southwest"
];

export const stateOptions = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California",
  "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
  "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];
