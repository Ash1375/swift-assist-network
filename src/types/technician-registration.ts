
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
  locality?: string;  // Add the locality field as optional
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
  "North Tamil Nadu", 
  "South Tamil Nadu", 
  "East Tamil Nadu", 
  "West Tamil Nadu", 
  "Central Tamil Nadu"
];

// Tamil Nadu districts
export const stateOptions = [
  "Tamil Nadu"
];

export const tamilNaduDistricts = [
  "Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", 
  "Dindigul", "Erode", "Kanchipuram", "Kanyakumari", "Karur", 
  "Krishnagiri", "Madurai", "Nagapattinam", "Namakkal", "Nilgiris",
  "Perambalur", "Pudukkottai", "Ramanathapuram", "Salem", "Sivaganga",
  "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
  "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
  "Viluppuram", "Virudhunagar"
];

// Major localities in Tamil Nadu districts
export const localityOptions: Record<string, string[]> = {
  "Chennai": [
    "T. Nagar", "Adyar", "Anna Nagar", "Velachery", "Mylapore", 
    "Tambaram", "Porur", "Guindy", "Egmore", "Chromepet", "Besant Nagar",
    "Kilpauk", "Kodambakkam", "Nungambakkam", "Sholinganallur"
  ],
  "Coimbatore": [
    "Peelamedu", "RS Puram", "Singanallur", "Saibaba Colony", "Ganapathy", 
    "Ramanathapuram", "Gandhipuram", "Ukkadam", "Hopes College", "Thudiyalur"
  ],
  "Madurai": [
    "Goripalayam", "Annanagar", "Teppakulam", "Arapalayam", "Pasumalai",
    "Mattuthavani", "KK Nagar", "Tirupparankundram", "Ellis Nagar", "Vilangudi"
  ],
  "Salem": [
    "Alagapuram", "Hasthampatti", "Kondalampatti", "Kitchipalayam", "Fairlands",
    "Shevapet", "Suramangalam", "Ammapet", "Gorimedu", "Kannankurichi"
  ],
  "Tiruchirappalli": [
    "Srirangam", "Thillai Nagar", "Woraiyur", "K.K. Nagar", "Thennur",
    "Palakkarai", "Cantonment", "Crawford", "Edamalaipatti Pudur", "Ariyamangalam"
  ]
};
