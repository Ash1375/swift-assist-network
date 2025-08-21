
import { useState } from "react";
import { 
  Car, Bike, Truck, Wrench, Battery, Key, 
  Fuel, LifeBuoy, Anchor, MapPin, ArrowRight, Zap, PhoneCall
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
    id: "ev-charging",
    name: "EV Portable Charger",
    icon: Zap,
    color: "icon-bg-emerald",
    badge: "badge-emerald",
    badgeText: "Eco-Friendly",
    description: "Electric vehicle running low on battery? Our portable EV charger service will get you charged up and back on the road.",
    details: "We provide emergency portable charging for electric vehicles when you're stranded with low battery. Our high-capacity portable chargers work with all EV models and can provide enough charge to reach the nearest charging station."
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
    <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden" id="services">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-200 rounded-full blur-3xl opacity-20"></div>
      
      <div className="container relative z-10 px-4">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl mb-4 sm:mb-6 shadow-lg">
            <ArrowRight className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-600 to-blue-700">
              Our Services
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Professional roadside assistance available 24/7
          </p>
        </div>

        {/* Popular Services - Mobile Optimized */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {services.slice(0, 8).map((service, index) => (
            <Link 
              key={service.id}
              to={`/request-service/${service.id}`}
              className="group relative rounded-xl border border-gray-200/50 p-3 sm:p-4 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-primary/50 hover:scale-105"
            >
              {service.badge && index < 4 && (
                <div className="absolute -top-2 -right-2 z-10">
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-bold shadow-sm ${service.badge}`}>
                    {service.badgeText}
                  </span>
                </div>
              )}
              
              <div className="flex flex-col items-center text-center">
                <div className={`relative p-2 sm:p-3 rounded-xl mb-2 sm:mb-3 ${service.color} group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  <service.icon className="h-4 w-4 sm:h-6 sm:w-6 text-white drop-shadow-sm" />
                </div>
                
                <h3 className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-primary transition-colors duration-300 leading-tight">
                  {service.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Detailed Service View */}
        {selectedService && (
          <div className="mb-8 sm:mb-12">
            {(() => {
              const service = services.find(s => s.id === selectedService);
              if (!service) return null;
              
              return (
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200/50 max-w-2xl mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${service.color} shadow-lg`}>
                        <service.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{service.name}</h3>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedService(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </Button>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">{service.details}</p>
                  
                  <Button 
                    asChild 
                    className="bg-gradient-to-r from-primary to-blue-700 hover:from-blue-700 hover:to-blue-800 w-full py-4 rounded-xl text-base font-semibold"
                  >
                    <Link to={`/request-service/${service.id}`}>
                      Request This Service
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              );
            })()}
          </div>
        )}

        {/* Emergency CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              Need Emergency Help?
            </h3>
            <p className="text-blue-100 mb-4 text-sm sm:text-base">
              24/7 support available
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100 font-bold px-6 py-3 rounded-xl shadow-lg text-sm sm:text-base"
              asChild
            >
              <Link to="/emergency">
                <PhoneCall className="mr-2 h-4 w-4" />
                Emergency Call
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
