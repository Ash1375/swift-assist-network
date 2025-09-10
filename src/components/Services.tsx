
import { useState } from "react";
import { 
  Car, Bike, Truck, Wrench, Battery, Key, 
  Fuel, LifeBuoy, Anchor, MapPin, ArrowRight, Zap, PhoneCall,
  Truck as TowTruck, Gauge, Settings, Unlock, Droplets, ShieldCheck, BatteryCharging
} from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

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

  const handleSelectService = (serviceId: string) => {
    setSelectedService(serviceId === selectedService ? null : serviceId);
  };

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-background to-accent/20 relative overflow-hidden" id="services">
      {/* Elegant background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full blur-3xl opacity-60"></div>
      
      <div className="container relative z-10 px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-3xl mb-6 shadow-xl">
            <ArrowRight className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Our Services
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional roadside assistance available 24/7
          </p>
        </div>

        {/* Services Grid - More Elegant Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {services.slice(0, 8).map((service, index) => (
            <Link 
              key={service.id}
              to={`/request-service/${service.id}`}
              className="group relative"
            >
              <div className="relative bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-card/80 overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                
                {/* Badge for featured services */}
                {service.badge && index < 4 && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <div className="bg-gradient-to-r from-primary to-accent px-3 py-1 rounded-full shadow-lg">
                      <span className="text-xs font-bold text-white">
                        {service.badgeText}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className={`p-4 rounded-2xl mb-1 bg-gradient-to-br from-primary/20 to-accent/20 group-hover:scale-110 transition-all duration-500 shadow-lg ${service.color}`}>
                      <service.icon className="h-8 w-8 text-white drop-shadow-sm" />
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                    {service.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Detailed Service View - Enhanced */}
        {selectedService && (
          <div className="mb-16">
            {(() => {
              const service = services.find(s => s.id === selectedService);
              if (!service) return null;
              
              return (
                <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-border/50 max-w-3xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl ${service.color} shadow-xl`}>
                        <service.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">{service.name}</h3>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedService(null)}
                      className="text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-full w-10 h-10"
                    >
                      ×
                    </Button>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed text-lg">{service.details}</p>
                  
                  <Button 
                    asChild 
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 w-full py-6 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <Link to={`/request-service/${service.id}`}>
                      Request This Service
                      <ArrowRight className="ml-2 h-6 w-6" />
                    </Link>
                  </Button>
                </div>
              );
            })()}
          </div>
        )}

        {/* Emergency CTA - More Elegant */}
        <div className="text-center">
          <div className="relative bg-gradient-to-r from-primary via-accent to-primary rounded-3xl p-8 shadow-2xl overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/90"></div>
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <div className="absolute top-4 left-4 w-20 h-20 bg-white/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-4 right-4 w-16 h-16 bg-white/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-3">
                Need Emergency Help?
              </h3>
              <p className="text-primary-foreground/80 mb-6 text-lg">
                24/7 support available - We're just one call away
              </p>
              <Button 
                size="lg" 
                className="bg-white/95 text-primary hover:bg-white hover:scale-105 font-bold px-8 py-4 rounded-2xl shadow-xl text-lg backdrop-blur-sm transition-all duration-300"
                asChild
              >
                <Link to="/emergency">
                  <PhoneCall className="mr-3 h-6 w-6" />
                  Emergency Call
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
