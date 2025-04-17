import { useState } from "react";
import { 
  Car, Bike, Truck, Wrench, Battery, Key, 
  Fuel, LifeBuoy, Anchor, MapPin, ArrowRight,
  CheckCircle2, ChevronDown, ChevronUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";

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
  { id: "car", name: "Cars", icon: Car, subtypes: ["SUV", "Hatchback", "Sedan", "MPV", "Other Cars"] },
  { id: "bike", name: "Bikes", icon: Bike, subtypes: ["Sport Bike", "Cruiser", "Commuter", "Scooter", "Other Bikes"] },
  { id: "commercial", name: "Commercial", icon: Truck, subtypes: ["Truck", "Van", "Bus", "Construction Vehicle", "Other Commercial"] }
];

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showVehicleSelect, setShowVehicleSelect] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState<string | null>(null);
  const [selectedVehicleSubtype, setSelectedVehicleSubtype] = useState<string | null>(null);
  
  const form = useForm({
    defaultValues: {
      vehicleType: "",
      vehicleSubtype: "",
      location: "",
      contactNumber: "",
      additionalInfo: "",
      agreeTOS: false,
    }
  });

  const handleServiceClick = (serviceId: string) => {
    if (serviceId === selectedService) {
      setSelectedService(null);
      setShowVehicleSelect(false);
    } else {
      setSelectedService(serviceId);
      setShowVehicleSelect(false);
    }
  };

  const handleRequestService = () => {
    setShowVehicleSelect(true);
  };

  const handleVehicleTypeSelect = (vehicleType: string) => {
    setSelectedVehicleType(vehicleType);
    setSelectedVehicleSubtype(null);
  };

  const filteredServices = services;
  const currentService = filteredServices.find(service => service.id === selectedService);

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
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
                      
                      <Collapsible className="w-full">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 mb-2">Service Features:</h4>
                          <CollapsibleTrigger className="rounded-full hover:bg-gray-100 p-1">
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent>
                          <ul className="space-y-2 mb-4">
                            {service.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                                <span className="text-gray-700 text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CollapsibleContent>
                      </Collapsible>
                      
                      <Collapsible className="w-full mt-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 mb-2">How We Do It:</h4>
                          <CollapsibleTrigger className="rounded-full hover:bg-gray-100 p-1">
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent>
                          <ol className="space-y-2 mb-4">
                            {service.process.map((step, index) => (
                              <li key={index} className="flex items-start">
                                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-red-100 text-red-600 text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                                  {index + 1}
                                </span>
                                <span className="text-gray-700 text-sm">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                    
                    {!showVehicleSelect && (
                      <Button 
                        className="w-full bg-red-600 hover:bg-red-700" 
                        onClick={handleRequestService}
                      >
                        Request This Service <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                    
                    {showVehicleSelect && selectedService === service.id && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg animate-fade-in">
                        <h4 className="font-medium text-lg mb-4">Select Vehicle & Details</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                            <div className="grid grid-cols-3 gap-3">
                              {vehicleCategories.slice(1).map((category) => (
                                <div
                                  key={category.id}
                                  className={cn(
                                    "flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-all",
                                    selectedVehicleType === category.id
                                      ? "border-red-500 bg-red-50"
                                      : "border-gray-200 hover:border-red-200"
                                  )}
                                  onClick={() => handleVehicleTypeSelect(category.id)}
                                >
                                  <category.icon className="h-8 w-8 mb-2 text-gray-700" />
                                  <span className="text-sm text-center">{category.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {selectedVehicleType && (
                            <div className="animate-fade-in">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Subtype</label>
                              <Select onValueChange={setSelectedVehicleSubtype}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select vehicle subtype" />
                                </SelectTrigger>
                                <SelectContent>
                                  {vehicleCategories
                                    .find(c => c.id === selectedVehicleType)
                                    ?.subtypes?.map((subtype) => (
                                      <SelectItem key={subtype} value={subtype}>
                                        {subtype}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          
                          {selectedVehicleSubtype && (
                            <form className="space-y-4 animate-fade-in">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Location</label>
                                <div className="flex gap-2">
                                  <Input placeholder="Enter your location" />
                                  <Button type="button" variant="outline" size="icon">
                                    <MapPin className="h-4 w-4" />
                                  </Button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Click the location icon to use your current location</p>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                <Input type="tel" placeholder="Enter contact number" />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information (Optional)</label>
                                <Input placeholder="Describe your situation" />
                              </div>
                              
                              <div className="flex items-start gap-2">
                                <Checkbox id="terms" />
                                <div className="grid gap-1.5 leading-none">
                                  <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    I agree to terms and conditions
                                  </label>
                                  <p className="text-xs text-gray-500">
                                    You will be charged only after service completion.
                                  </p>
                                </div>
                              </div>
                              
                              <Button className="w-full bg-red-600 hover:bg-red-700" asChild>
                                <Link to={`/request-service/${service.id}`}>
                                  Confirm Request <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                              </Button>
                            </form>
                          )}
                        </div>
                      </div>
                    )}
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
