
import { useState } from "react";
import { 
  Car, Bike, Truck, Wrench, Battery, Key, 
  Fuel, LifeBuoy, Anchor, MapPin, ArrowRight
} from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const services = [
  {
    id: "towing",
    name: "Towing Services",
    icon: Anchor,
    color: "icon-bg-red",
    badge: "badge-red",
    badgeText: "Most Popular",
    description: "Vehicle breakdown? Our towing service quickly transports your vehicle to the nearest repair shop or your preferred location.",
    details: "Our professional towing services use modern equipment to safely transport all vehicle types. Available 24/7 with quick response times and competitive rates."
  },
  {
    id: "flat-tire",
    name: "Flat Tire Repair",
    icon: Wrench,
    color: "icon-bg-blue",
    badge: "badge-blue",
    badgeText: "Fast Service",
    description: "Experienced technicians will fix or replace your flat tire on the spot to get you back on the road quickly.",
    details: "We'll replace your flat tire with your spare or repair it if possible. If you don't have a spare tire, we can tow your vehicle to the nearest tire shop. Our technicians are trained to handle all types of tires and wheels."
  },
  {
    id: "battery",
    name: "Battery Jumpstart",
    icon: Battery,
    color: "icon-bg-purple",
    badge: "badge-purple",
    badgeText: "Quick Fix",
    description: "Dead battery? Our technicians will jumpstart your vehicle or provide a replacement battery if needed.",
    details: "Our battery jumpstart service includes testing your vehicle's charging system to identify any underlying issues. We also offer battery replacement services if your battery is beyond repair."
  },
  {
    id: "mechanical",
    name: "Mechanical Issues",
    icon: Wrench,
    color: "icon-bg-orange",
    badge: "badge-orange",
    badgeText: "Expert Help",
    description: "Our skilled mechanics can diagnose and fix common mechanical problems on the spot.",
    details: "From engine trouble to transmission problems, our mobile mechanics can perform diagnostics and minor repairs at your location. For more complex issues, we'll help arrange towing to a specialized repair facility."
  },
  {
    id: "fuel",
    name: "Fuel Delivery",
    icon: Fuel,
    color: "icon-bg-green",
    badge: "badge-green",
    badgeText: "Quick Relief",
    description: "Run out of fuel? We'll deliver the fuel you need to get back on the road.",
    details: "Whether you need petrol, diesel, or electric charging, our fuel delivery service ensures you won't be stranded due to an empty tank. Our quick response team will bring fuel directly to your location."
  },
  {
    id: "lockout",
    name: "Lockout Assistance",
    icon: Key,
    color: "icon-bg-yellow",
    badge: "badge-yellow",
    badgeText: "Safe Entry",
    description: "Locked your keys inside? Our specialists will help you regain access to your vehicle safely.",
    details: "Our trained technicians use specialized tools to safely unlock your vehicle without causing damage. We can handle all types of vehicles and lock systems, including advanced electronic locks."
  },
  {
    id: "winching",
    name: "Winching Services",
    icon: LifeBuoy,
    color: "icon-bg-blue",
    badge: "badge-blue",
    badgeText: "Heavy Duty",
    description: "Vehicle stuck in mud, snow, or a ditch? Our winching service will pull you out safely.",
    details: "Using professional-grade winches and equipment, we can recover vehicles from difficult situations like mud, snow, sand, or ditches. Our technicians are trained in proper recovery techniques to prevent damage to your vehicle."
  },
  {
    id: "other",
    name: "Other Services",
    icon: Wrench,
    color: "icon-bg-purple",
    badge: "badge-purple",
    badgeText: "Custom Help",
    description: "Need another type of assistance? Contact us for any roadside emergency.",
    details: "From electrical problems to fluid leaks, overheating, or any other roadside emergency, our skilled technicians are ready to help. We offer a wide range of services to address various vehicle-related issues."
  },
];

const vehicleTypes = [
  {
    id: "car",
    name: "Cars",
    icon: Car,
    subtypes: ["SUV", "Hatchback", "Sedan", "MPV", "Other Cars"]
  },
  {
    id: "bike",
    name: "Bikes",
    icon: Bike,
    subtypes: ["Sport Bike", "Cruiser", "Commuter", "Scooter", "Other Bikes"]
  },
  {
    id: "commercial",
    name: "Commercial Vehicles",
    icon: Truck,
    subtypes: ["Truck", "Van", "Bus", "Construction Vehicle", "Other Commercial"]
  },
];

const Services = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleSelectService = (serviceId: string) => {
    setSelectedService(serviceId === selectedService ? null : serviceId);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50" id="services">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-700">
            Our Services
          </span>
        </h2>
        <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-12">
          We offer a comprehensive range of roadside assistance services to help you get back on the road quickly and safely.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div 
              key={service.id}
              className={cn(
                "rounded-xl border p-6 hover:shadow-lg transition-all cursor-pointer service-card bg-white relative",
                selectedService === service.id ? "border-red-600 ring-2 ring-red-100" : "border-gray-200"
              )}
              onClick={() => handleSelectService(service.id)}
            >
              {service.badge && (
                <span className={`absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full ${service.badge}`}>
                  {service.badgeText}
                </span>
              )}
              <div className="flex flex-col items-center text-center">
                <div className={`p-3 rounded-full mb-4 ${service.color}`}>
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                {selectedService === service.id && (
                  <div className="mt-4 animate-fade-in">
                    <p className="text-sm text-gray-700 mb-4">{service.details}</p>
                    <Button asChild className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 w-full group">
                      <Link to={`/request-service/${service.id}`} className="flex items-center justify-center">
                        Request This Service
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
