
import { Car, Bike, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

const vehicleTypes = [
  {
    id: "car",
    name: "Cars",
    icon: Car,
    description: "Service for all types of cars including SUVs, hatchbacks, sedans, and MPVs.",
    subtypes: ["SUV", "Hatchback", "Sedan", "MPV", "Other Cars"]
  },
  {
    id: "bike",
    name: "Bikes",
    icon: Bike,
    description: "Assistance for all types of motorcycles and scooters.",
    subtypes: ["Sport Bike", "Cruiser", "Commuter", "Scooter", "Other Bikes"]
  },
  {
    id: "commercial",
    name: "Commercial Vehicles",
    icon: Truck,
    description: "Support for trucks, vans, buses, and other commercial vehicles.",
    subtypes: ["Truck", "Van", "Bus", "Construction Vehicle", "Other Commercial"]
  },
];

const VehicleTypes = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Vehicles We Service</h2>
        <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Our roadside assistance covers all types of vehicles to ensure everyone gets the help they need.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {vehicleTypes.map((type) => (
            <div 
              key={type.id}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-red-50 rounded-full mb-4">
                  <type.icon className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{type.name}</h3>
                <p className="text-gray-600 mb-4">{type.description}</p>
                
                <div className="w-full mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Includes:</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {type.subtypes.map((subtype) => (
                      <li 
                        key={subtype} 
                        className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full"
                      >
                        {subtype}
                      </li>
                    ))}
                  </ul>
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
