
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ServiceRequestFormData, VehicleType } from "./types";
import { Car, Bike, Truck } from "lucide-react";

const vehicleTypes: VehicleType[] = [
  { 
    id: "car",
    name: "Cars", 
    icon: Car,
    subtypes: ["SUV", "Hatchback", "Sedan", "MPV", "Other Cars"] 
  },
  { 
    id: "bike",
    name: "Motorcycles/Bikes", 
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

interface VehicleInfoStepProps {
  formData: ServiceRequestFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVehicleTypeSelect: (type: string) => void;
  onVehicleSubtypeSelect: (subtype: string) => void;
}

const VehicleInfoStep = ({ 
  formData, 
  onInputChange, 
  onVehicleTypeSelect, 
  onVehicleSubtypeSelect 
}: VehicleInfoStepProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Vehicle Information</h2>
      
      <div className="space-y-4">
        <Label>Vehicle Type</Label>
        <div className="grid grid-cols-3 gap-4">
          {vehicleTypes.map((type) => (
            <div
              key={type.id}
              className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                ${formData.vehicleType === type.id 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 hover:border-red-300 hover:bg-red-50/30'}`}
              onClick={() => onVehicleTypeSelect(type.id)}
            >
              <div className={`p-3 rounded-full ${formData.vehicleType === type.id ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                <type.icon className="h-6 w-6" />
              </div>
              <span className="font-medium text-center">{type.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      {formData.vehicleType && (
        <div className="space-y-4 animate-fade-in">
          <Label>Vehicle Subtype</Label>
          <div className="flex flex-wrap gap-2">
            {vehicleTypes.find(t => t.id === formData.vehicleType)?.subtypes.map((subtype) => (
              <Button
                key={subtype}
                type="button"
                variant={formData.vehicleSubtype === subtype ? "default" : "outline"}
                className={formData.vehicleSubtype === subtype ? "bg-red-600 hover:bg-red-700" : ""}
                onClick={() => onVehicleSubtypeSelect(subtype)}
              >
                {subtype}
              </Button>
            ))}
          </div>
          
          <div className="space-y-2 mt-6">
            <Label htmlFor="vehicleModel">Vehicle Make & Model</Label>
            <Input 
              id="vehicleModel" 
              name="vehicleModel" 
              value={formData.vehicleModel} 
              onChange={onInputChange} 
              placeholder="e.g., Toyota Camry, Honda CBR"
              className="border-gray-300 focus:border-red-500 focus:ring focus:ring-red-200"
              required
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleInfoStep;
