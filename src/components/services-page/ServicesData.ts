
import { 
  Anchor, Wrench, Battery, Key, 
  Fuel, LifeBuoy, Car, Bike, Truck, 
  Circle // Added Circle icon for the "All Vehicles" category
} from "lucide-react";
import { ServiceDetails, VehicleCategory } from "./types";

export const services: ServiceDetails[] = [
  {
    id: "towing",
    name: "Towing Services",
    icon: Anchor,
    description: "Vehicle breakdown? Our towing service quickly transports your vehicle to the nearest repair shop or your preferred location.",
    details: "Our professional towing services use modern equipment to safely transport all vehicle types. Available 24/7 with quick response times and competitive rates.",
    features: [
      "Available 24/7 for emergency situations",
      "Experienced operators to handle your vehicle safely",
      "Flatbed towing for all vehicle types",
      "Long-distance towing available",
      "Transparent pricing with no hidden fees"
    ],
    process: [
      "Initial assessment of vehicle condition",
      "Selection of appropriate towing equipment",
      "Secure attachment of vehicle to towing equipment",
      "Safe transport to desired location",
      "Final inspection upon delivery"
    ]
  },
  {
    id: "flat-tire",
    name: "Flat Tire Repair",
    icon: Wrench,
    description: "Experienced technicians will fix or replace your flat tire on the spot to get you back on the road quickly.",
    details: "We'll replace your flat tire with your spare or repair it if possible. If you don't have a spare tire, we can tow your vehicle to the nearest tire shop. Our technicians are trained to handle all types of tires and wheels.",
    features: [
      "Tire changes with your spare tire",
      "Temporary tire repairs for small punctures",
      "Proper torque and pressure checks",
      "Advice on tire condition and potential replacement needs",
      "Service for all vehicle types including cars, SUVs, and motorcycles"
    ],
    process: [
      "Assess tire damage and determine repair possibility",
      "Safely jack up vehicle using proper equipment",
      "Remove damaged tire and inspect wheel",
      "Replace with spare or perform temporary repair",
      "Check tire pressure and properly torque lug nuts",
      "Advise on permanent repair options if needed"
    ]
  },
  {
    id: "battery",
    name: "Battery Jumpstart",
    icon: Battery,
    description: "Dead battery? Our technicians will jumpstart your vehicle or provide a replacement battery if needed.",
    details: "Our battery jumpstart service includes testing your vehicle's charging system to identify any underlying issues. We also offer battery replacement services if your battery is beyond repair.",
    features: [
      "Professional jumpstart service using proper equipment",
      "Battery and charging system testing",
      "Replacement batteries available if needed",
      "Works with all vehicle types and battery systems",
      "Advice on preventing future battery issues"
    ],
    process: [
      "Assess battery condition",
      "Perform jumpstart with professional equipment",
      "Check charging system health",
      "Test battery performance",
      "Provide recommendations for battery maintenance"
    ]
  },
  {
    id: "mechanical",
    name: "Mechanical Issues",
    icon: Wrench,
    description: "Our skilled mechanics can diagnose and fix common mechanical problems on the spot.",
    details: "From engine trouble to transmission problems, our mobile mechanics can perform diagnostics and minor repairs at your location. For more complex issues, we'll help arrange towing to a specialized repair facility.",
    features: [
      "On-site diagnostics for various mechanical issues",
      "Minor repairs performed at your location",
      "Expert advice on next steps for complex problems",
      "ASE-certified mechanics with extensive experience",
      "Service for all types of vehicles and common mechanical problems"
    ],
    process: [
      "Initial diagnosis of the mechanical issue",
      "Determine if on-site repair is possible",
      "Perform necessary repairs if feasible",
      "Test vehicle operation after repair",
      "Provide recommendations for future maintenance"
    ]
  },
  {
    id: "fuel",
    name: "Fuel Delivery",
    icon: Fuel,
    description: "Run out of fuel? We'll deliver the fuel you need to get back on the road.",
    details: "Whether you need petrol, diesel, or electric charging, our fuel delivery service ensures you won't be stranded due to an empty tank. Our quick response team will bring fuel directly to your location.",
    features: [
      "Fast delivery of petrol or diesel",
      "Emergency fuel to get you to the nearest station",
      "Available in all service areas",
      "Enough fuel to reach your destination or nearest gas station",
      "Service available 24/7 for emergencies"
    ],
    process: [
      "Confirm fuel type needed",
      "Dispatch nearest technician with fuel",
      "Deliver and add fuel to vehicle",
      "Ensure vehicle starts properly",
      "Provide guidance to nearest gas station if needed"
    ]
  },
  {
    id: "lockout",
    name: "Lockout Assistance",
    icon: Key,
    description: "Locked your keys inside? Our specialists will help you regain access to your vehicle safely.",
    details: "Our trained technicians use specialized tools to safely unlock your vehicle without causing damage. We can handle all types of vehicles and lock systems, including advanced electronic locks.",
    features: [
      "Professional tools to unlock your vehicle without damage",
      "Service for all vehicle makes and models",
      "Trained technicians with expertise in various lock systems",
      "Fast response times to minimize your inconvenience",
      "Affordable alternative to dealership services"
    ],
    process: [
      "Verify vehicle ownership",
      "Select appropriate tools for vehicle make/model",
      "Safely unlock vehicle without damage",
      "Test locks and doors after entry",
      "Provide access to vehicle contents"
    ]
  },
  {
    id: "winching",
    name: "Winching Services",
    icon: LifeBuoy,
    description: "Vehicle stuck in mud, snow, or a ditch? Our winching service will pull you out safely.",
    details: "Using professional-grade winches and equipment, we can recover vehicles from difficult situations like mud, snow, sand, or ditches. Our technicians are trained in proper recovery techniques to prevent damage to your vehicle.",
    features: [
      "Recovery from mud, snow, sand, or ditches",
      "Professional equipment for safe extraction",
      "Works with all vehicle types",
      "Trained operators to prevent vehicle damage",
      "Available in difficult terrains and weather conditions"
    ],
    process: [
      "Assess vehicle position and terrain",
      "Select appropriate recovery technique",
      "Safely attach winch and recovery equipment",
      "Extract vehicle with controlled force",
      "Inspect vehicle for any damage after recovery"
    ]
  },
  {
    id: "other",
    name: "Other Services",
    icon: Wrench,
    description: "Need another type of assistance? Contact us for any roadside emergency.",
    details: "From electrical problems to fluid leaks, overheating, or any other roadside emergency, our skilled technicians are ready to help. We offer a wide range of services to address various vehicle-related issues.",
    features: [
      "Assistance with electrical system issues",
      "Help with fluid leaks or overheating",
      "Tire pressure services",
      "General roadside assistance for unexpected problems",
      "Custom solutions for unique roadside emergencies"
    ],
    process: [
      "Assess specific issue over the phone",
      "Dispatch technician with appropriate equipment",
      "Diagnose problem on-site",
      "Implement solution or recommend next steps",
      "Ensure safety before leaving"
    ]
  }
];

export const vehicleCategories: VehicleCategory[] = [
  { id: "all", name: "All Vehicles", icon: Circle }, // Added icon property
  { id: "car", name: "Cars", icon: Car, subtypes: ["SUV", "Hatchback", "Sedan", "MPV", "Other Cars"] },
  { id: "bike", name: "Bikes", icon: Bike, subtypes: ["Sport Bike", "Cruiser", "Commuter", "Scooter", "Other Bikes"] },
  { id: "commercial", name: "Commercial", icon: Truck, subtypes: ["Truck", "Van", "Bus", "Construction Vehicle", "Other Commercial"] }
];
