
import { Car, Bike, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const vehicleTypes = [
  {
    id: "car",
    name: "Cars",
    icon: Car,
    color: "bg-gradient-to-r from-blue-500 to-blue-600",
    description: "Service for all types of cars including SUVs, hatchbacks, sedans, and MPVs.",
    subtypes: ["SUV", "Hatchback", "Sedan", "MPV", "Other Cars"]
  },
  {
    id: "bike",
    name: "Bikes",
    icon: Bike,
    color: "bg-gradient-to-r from-green-500 to-green-600",
    description: "Assistance for all types of motorcycles and scooters.",
    subtypes: ["Sport Bike", "Cruiser", "Commuter", "Scooter", "Other Bikes"]
  },
  {
    id: "commercial",
    name: "Commercial Vehicles",
    icon: Truck,
    color: "bg-gradient-to-r from-orange-500 to-orange-600",
    description: "Support for trucks, vans, buses, and other commercial vehicles.",
    subtypes: ["Truck", "Van", "Bus", "Construction Vehicle", "Other Commercial"]
  },
];

const VehicleTypes = () => {
  const [hoveredType, setHoveredType] = useState<string | null>(null);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">
            Vehicles We Service
          </span>
        </h2>
        <p className="text-base sm:text-lg text-center text-gray-600 max-w-3xl mx-auto mb-12 px-4">
          Our roadside assistance covers all types of vehicles to ensure everyone gets the help they need.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {vehicleTypes.map((type) => (
            <div 
              key={type.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all service-card"
              onMouseEnter={() => setHoveredType(type.id)}
              onMouseLeave={() => setHoveredType(null)}
            >
              <div className={`h-2 ${type.color}`}></div>
              <div className="p-4 sm:p-6">
                <div className="flex flex-col items-center text-center">
                  <div className={`p-3 sm:p-4 rounded-full mb-4 ${hoveredType === type.id ? type.color + ' text-white' : 'bg-gray-100'} transition-colors duration-300`}>
                    <type.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3">{type.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">{type.description}</p>
                  
                  <div className="w-full mt-4">
                    <h4 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">Includes:</h4>
                    <div className="flex flex-wrap gap-2">
                      {type.subtypes.map((subtype) => (
                        <span 
                          key={subtype} 
                          className={`text-xs sm:text-sm ${hoveredType === type.id ? type.color + ' text-white' : 'bg-gray-100 text-gray-700'} px-2 sm:px-3 py-1 rounded-full transition-colors duration-300`}
                        >
                          {subtype}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VehicleTypes;
