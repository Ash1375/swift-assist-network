
import { useState } from "react";
import { 
  Car, Bike, Truck, Wrench, Battery, Key, 
  Fuel, LifeBuoy, Anchor, MapPin, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const services = [
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
    ]
  },
];

const vehicleCategories = [
  { id: "all", name: "All Vehicles" },
  { id: "car", name: "Cars", icon: Car },
  { id: "bike", name: "Bikes", icon: Bike },
  { id: "commercial", name: "Commercial", icon: Truck }
];

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleServiceClick = (serviceId: string) => {
    setSelectedService(serviceId === selectedService ? null : serviceId);
  };

  // Filter services based on vehicle category (in a real app)
  // For now we'll just show all services regardless of category
  const filteredServices = services;

  return (
    <div className="min-h-screen">
      <div className="bg-red-600 text-white py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold text-center">Our Services</h1>
          <p className="text-xl text-center mt-4 max-w-3xl mx-auto">
            Fast, reliable roadside assistance services available 24/7, no matter where you are.
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="flex flex-wrap gap-4 mb-10 justify-center">
          {vehicleCategories.map((category) => (
            <button
              key={category.id}
              className={cn(
                "px-6 py-3 rounded-full text-sm font-medium transition-colors border flex items-center gap-2",
                selectedCategory === category.id
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-red-50 hover:border-red-100"
              )}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon && <category.icon className="h-4 w-4" />}
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div 
              key={service.id} 
              className={cn(
                "border rounded-xl overflow-hidden transition-all hover:shadow-md cursor-pointer",
                selectedService === service.id ? "border-red-500 ring-2 ring-red-100" : "border-gray-200"
              )}
              onClick={() => handleServiceClick(service.id)}
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className="p-3 bg-red-50 rounded-full mr-4">
                    <service.icon className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                  </div>
                </div>

                {selectedService === service.id && (
                  <div className="mt-4 animate-fade-in">
                    <div className="mt-4 mb-6">
                      <p className="text-gray-700 mb-4">{service.details}</p>
                      <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-600 mr-2">•</span>
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button className="w-full bg-red-600 hover:bg-red-700" asChild>
                      <Link to={`/request-service/${service.id}`}>
                        Request This Service <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
