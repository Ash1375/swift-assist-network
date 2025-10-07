import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Car, Bike, Truck, Zap, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const vehicleCategories = [
  {
    id: "car",
    name: "Cars",
    icon: Car,
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    description: "Sedan, Hatchback, SUV, MPV",
    subtypes: ["SUV", "Hatchback", "Sedan", "MPV", "Other Cars"]
  },
  {
    id: "bike", 
    name: "Motorcycles & Bikes",
    icon: Bike,
    color: "bg-gradient-to-br from-orange-500 to-orange-600",
    description: "Sport, Cruiser, Commuter, Scooter",
    subtypes: ["Sport Bike", "Cruiser", "Commuter", "Scooter", "Other Bikes"]
  },
  {
    id: "commercial",
    name: "Commercial Vehicles",
    icon: Truck, 
    color: "bg-gradient-to-br from-green-500 to-green-600",
    description: "Trucks, Vans, Buses",
    subtypes: ["Truck", "Van", "Bus", "Construction Vehicle", "Other Commercial"]
  },
  {
    id: "ev",
    name: "Electric Vehicles",
    icon: Zap,
    color: "bg-gradient-to-br from-purple-500 to-purple-600", 
    description: "Electric Cars, E-Bikes, E-Scooters",
    subtypes: ["Electric Cars", "Electric Bikes", "Electric Scooters", "Electric Auto"]
  }
];

const services: Record<string, { name: string; description: string }> = {
  "towing": { name: "Towing Service", description: "Vehicle breakdown assistance" },
  "flat-tire": { name: "Flat Tire Repair", description: "Quick tire replacement" },
  "battery": { name: "Battery Jumpstart", description: "Dead battery assistance" },
  "mechanical": { name: "Mechanical Issues", description: "On-spot repairs" },
  "fuel": { name: "Fuel Delivery", description: "Emergency fuel delivery" },
  "lockout": { name: "Lockout Assistance", description: "Vehicle access help" },
  "winching": { name: "Winching Services", description: "Vehicle recovery" },
  "ev-charging": { name: "EV Charging", description: "Electric vehicle charging" },
  "other": { name: "Other Services", description: "Custom assistance" }
};

const VehicleServiceSelector = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  const service = serviceId && services[serviceId] ? services[serviceId] : services.other;

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
  };

  const handleContinue = () => {
    if (selectedVehicle && serviceId) {
      navigate(`/request-service/${serviceId}/${selectedVehicle}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10 py-4 md:py-8 pb-20 md:pb-8">
      <div className="container max-w-4xl px-3 md:px-4">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
            Select Your Vehicle Type
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-2">
            For <span className="text-primary font-semibold">{service.name}</span>
          </p>
          <p className="text-sm md:text-base text-muted-foreground">
            {service.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {vehicleCategories.map((category) => (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedVehicle === category.id 
                  ? 'ring-2 ring-primary bg-primary/5 scale-105' 
                  : 'hover:bg-accent/50'
              }`}
              onClick={() => handleVehicleSelect(category.id)}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${category.color}`}>
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {category.subtypes.slice(0, 4).map((subtype) => (
                    <span 
                      key={subtype}
                      className="text-xs bg-accent/50 px-2 py-1 rounded-full"
                    >
                      {subtype}
                    </span>
                  ))}
                  {category.subtypes.length > 4 && (
                    <span className="text-xs bg-accent/50 px-2 py-1 rounded-full">
                      +{category.subtypes.length - 4} more
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t md:relative md:border-t-0 md:p-0 md:text-center z-10">
          <Button 
            onClick={handleContinue}
            disabled={!selectedVehicle}
            size="lg"
            className="w-full md:w-auto px-8 py-6 md:py-4 text-lg shadow-lg"
          >
            Continue with {selectedVehicle ? vehicleCategories.find(v => v.id === selectedVehicle)?.name : 'Vehicle'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VehicleServiceSelector;