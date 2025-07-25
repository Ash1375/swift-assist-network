
import { useState } from "react";
import { 
  Car, Bike, Truck, Wrench, Battery, Key, 
  Fuel, LifeBuoy, Anchor, MapPin, ArrowRight, Zap
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
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden" id="services">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-red-100 to-red-200 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-200 rounded-full blur-3xl opacity-20"></div>
      
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-6 shadow-lg">
            <ArrowRight className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-500 to-orange-500">
              Our Premium Services
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Experience world-class roadside assistance with our comprehensive range of services, 
            designed to get you back on the road quickly and safely, anytime, anywhere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={service.id}
              className={cn(
                "group relative rounded-2xl border border-gray-200/50 p-8 hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white/80 backdrop-blur-sm hover-scale",
                "hover:border-red-300/50 hover:-translate-y-2",
                selectedService === service.id ? "border-red-500/50 ring-4 ring-red-100/50 shadow-xl scale-105" : ""
              )}
              onClick={() => handleSelectService(service.id)}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-50/0 to-red-100/0 group-hover:from-red-50/30 group-hover:to-red-100/10 rounded-2xl transition-all duration-500"></div>
              
              {service.badge && (
                <div className="absolute -top-3 -right-3 z-10">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse ${service.badge}`}>
                    {service.badgeText}
                  </span>
                </div>
              )}
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`relative p-4 rounded-2xl mb-6 ${service.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <service.icon className="h-8 w-8 text-white drop-shadow-sm" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-red-600 transition-colors duration-300">
                  {service.name}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed text-base">
                  {service.description}
                </p>
                
                {selectedService === service.id && (
                  <div className="w-full animate-fade-in">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-6 border border-gray-200/50">
                      <p className="text-gray-700 leading-relaxed text-sm mb-4">
                        {service.details}
                      </p>
                    </div>
                    
                    <Button 
                      asChild 
                      className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-700 hover:via-red-600 hover:to-orange-600 w-full group/btn shadow-lg hover:shadow-xl transition-all duration-300 py-6 rounded-xl text-base font-semibold"
                    >
                      <Link to={`/request-service/${service.id}`} className="flex items-center justify-center">
                        <span className="mr-3">Request This Service</span>
                        <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </Button>
                  </div>
                )}
                
                {selectedService !== service.id && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl px-6 py-2">
                      Learn More
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-4">
                Need Immediate Assistance?
              </h3>
              <p className="text-red-100 mb-6 text-lg">
                Our 24/7 emergency hotline is always ready to help you
              </p>
              <Button 
                size="lg" 
                className="bg-white text-red-600 hover:bg-gray-100 font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Call Emergency Line
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
