
import { useState } from "react";
import { 
  Car, Bike, Truck, Wrench, Battery, Key, 
  Fuel, LifeBuoy, Anchor, MapPin, ArrowRight, Zap, PhoneCall,
  Truck as TowTruck, Gauge, Settings, Unlock, Droplets, ShieldCheck, BatteryCharging, ChevronRight
} from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const services = [
  {
    id: "towing",
    name: "Towing Services",
    icon: TowTruck,
    color: "bg-gradient-to-br from-red-500 to-red-600",
    badge: "badge-red",
    badgeText: "Most Popular",
    description: "Vehicle breakdown? Our towing service quickly transports your vehicle to the nearest repair shop or your preferred location.",
    details: "Our professional towing services use modern equipment to safely transport all vehicle types. Available 24/7 with quick response times and competitive rates."
  },
  {
    id: "flat-tire",
    name: "Flat Tire Repair",
    icon: Gauge,
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    badge: "badge-blue",
    badgeText: "Fast Service",
    description: "Experienced technicians will fix or replace your flat tire on the spot to get you back on the road quickly.",
    details: "We'll replace your flat tire with your spare or repair it if possible. If you don't have a spare tire, we can tow your vehicle to the nearest tire shop. Our technicians are trained to handle all types of tires and wheels."
  },
  {
    id: "battery",
    name: "Battery Jumpstart",
    icon: BatteryCharging,
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    badge: "badge-purple",
    badgeText: "Quick Fix",
    description: "Dead battery? Our technicians will jumpstart your vehicle or provide a replacement battery if needed.",
    details: "Our battery jumpstart service includes testing your vehicle's charging system to identify any underlying issues. We also offer battery replacement services if your battery is beyond repair."
  },
  {
    id: "mechanical",
    name: "Mechanical Issues",
    icon: Settings,
    color: "bg-gradient-to-br from-orange-500 to-orange-600",
    badge: "badge-orange",
    badgeText: "Expert Help",
    description: "Our skilled mechanics can diagnose and fix common mechanical problems on the spot.",
    details: "From engine trouble to transmission problems, our mobile mechanics can perform diagnostics and minor repairs at your location. For more complex issues, we'll help arrange towing to a specialized repair facility."
  },
  {
    id: "fuel",
    name: "Fuel Delivery",
    icon: Droplets,
    color: "bg-gradient-to-br from-green-500 to-green-600",
    badge: "badge-green",
    badgeText: "Quick Relief",
    description: "Run out of fuel? We'll deliver the fuel you need to get back on the road.",
    details: "Whether you need petrol, diesel, or electric charging, our fuel delivery service ensures you won't be stranded due to an empty tank. Our quick response team will bring fuel directly to your location."
  },
  {
    id: "lockout",
    name: "Lockout Assistance",
    icon: Unlock,
    color: "bg-gradient-to-br from-yellow-500 to-yellow-600",
    badge: "badge-yellow",
    badgeText: "Safe Entry",
    description: "Locked your keys inside? Our specialists will help you regain access to your vehicle safely.",
    details: "Our trained technicians use specialized tools to safely unlock your vehicle without causing damage. We can handle all types of vehicles and lock systems, including advanced electronic locks."
  },
  {
    id: "winching",
    name: "Winching Services",
    icon: ShieldCheck,
    color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    badge: "badge-blue",
    badgeText: "Heavy Duty",
    description: "Vehicle stuck in mud, snow, or a ditch? Our winching service will pull you out safely.",
    details: "Using professional-grade winches and equipment, we can recover vehicles from difficult situations like mud, snow, sand, or ditches. Our technicians are trained in proper recovery techniques to prevent damage to your vehicle."
  },
  {
    id: "ev-charging",
    name: "EV Portable Charger",
    icon: Zap,
    color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    badge: "badge-emerald",
    badgeText: "Eco-Friendly",
    description: "Electric vehicle running low on battery? Our portable EV charger service will get you charged up and back on the road.",
    details: "We provide emergency portable charging for electric vehicles when you're stranded with low battery. Our high-capacity portable chargers work with all EV models and can provide enough charge to reach the nearest charging station."
  },
  {
    id: "other",
    name: "Other Services",
    icon: Wrench,
    color: "bg-gradient-to-br from-gray-500 to-gray-600",
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
  {
    id: "ev",
    name: "Electric Vehicles",
    icon: Zap,
    subtypes: ["Electric Cars", "Electric Bikes", "Electric Scooters", "Electric Auto"]
  },
];

const Services = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleSelectService = (serviceId: string) => {
    setSelectedService(serviceId === selectedService ? null : serviceId);
  };

  return (
    <section className={cn(
      "bg-gradient-to-b from-background to-gray-50/50",
      isMobile ? "py-6 pb-24" : "py-16"
    )} id="services">
      <div className={cn("container", isMobile ? "px-3" : "px-4")}>
        {/* Modern Header */}
        <div className={cn("mb-6", isMobile ? "text-left px-1" : "text-center mb-12")}>
          {!isMobile && (
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-3xl mb-6 shadow-lg">
              <ArrowRight className="h-8 w-8 text-white" />
            </div>
          )}
          <h2 className={cn(
            "font-bold text-gray-800",
            isMobile ? "text-xl mb-2" : "text-3xl md:text-4xl mb-4"
          )}>
            {isMobile ? "Quick Services" : "Our Professional Services"}
          </h2>
          <p className={cn(
            "text-gray-600",
            isMobile ? "text-sm" : "text-lg max-w-2xl mx-auto"
          )}>
            {isMobile ? "Available 24/7 near you" : "Comprehensive roadside assistance available 24/7 across all locations"}
          </p>
        </div>

        {/* App-Style Services Grid for Mobile, Modern Grid for Desktop */}
        <div className={cn(
          isMobile 
            ? "flex flex-col gap-3" 
            : "grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        )}>
          {services.slice(0, 8).map((service, index) => (
            <Link 
              key={service.id}
              to={`/request-service/${service.id}`}
              className={cn(
                "group relative animate-fade-in",
                isMobile && "active:scale-98 transition-transform"
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {isMobile ? (
                // Swiggy/Zomato style card for mobile
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 active:shadow-lg transition-all duration-200">
                  <div className="flex items-center gap-4">
                    {/* Icon with gradient background */}
                    <div className={cn(
                      "flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center",
                      service.color
                    )}>
                      <service.icon className="h-7 w-7 text-white" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-800 text-base leading-tight">
                          {service.name}
                        </h3>
                        {/* Popular Badge */}
                        {index < 3 && (
                          <span className="inline-flex items-center bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {service.description}
                      </p>
                    </div>
                    
                    {/* Arrow */}
                    <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              ) : (
                // Original desktop card
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
                  {/* Popular Badge */}
                  {index < 3 && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-primary to-accent px-2 py-1 rounded-full shadow-lg">
                      <span className="text-xs font-bold text-white">
                        Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-primary/10 group-hover:to-accent/10 transition-all duration-300 mb-4">
                      <service.icon className="h-8 w-8 text-gray-600 group-hover:text-primary transition-colors duration-300" />
                    </div>
                    <h3 className="font-bold text-gray-800 group-hover:text-primary transition-colors duration-300 text-sm leading-tight">
                      {service.name}
                    </h3>
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Emergency CTA */}
        {!isMobile && (
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-primary to-accent text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden max-w-2xl mx-auto">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-4 right-4 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">
                  Need Immediate Help?
                </h3>
                <p className="text-white/90 mb-6 text-lg">
                  Our emergency response team is ready 24/7
                </p>
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 px-8"
                  asChild
                >
                  <Link to="/emergency">
                    <PhoneCall className="mr-2 h-5 w-5" />
                    Call Emergency Line
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
