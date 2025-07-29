
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ServiceRequestFormData, VehicleType } from "./types";
import { Car, Bike, Truck, ChevronDown } from "lucide-react";
import { getCarBrands, getBikeBrands, getCommercialBrands, getBrandModels, VehicleBrand } from "../../data/indianVehicles";
import { useState } from "react";

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

interface ExtendedFormData extends ServiceRequestFormData {
  vehicleBrand?: string;
}

const VehicleInfoStep = ({ 
  formData, 
  onInputChange, 
  onVehicleTypeSelect, 
  onVehicleSubtypeSelect 
}: VehicleInfoStepProps) => {
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [availableBrands, setAvailableBrands] = useState<VehicleBrand[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  const handleVehicleTypeChange = (type: string) => {
    onVehicleTypeSelect(type);
    setSelectedBrand("");
    setAvailableModels([]);
    
    // Set available brands based on vehicle type
    if (type === "car") {
      setAvailableBrands(getCarBrands());
    } else if (type === "bike") {
      setAvailableBrands(getBikeBrands());
    } else if (type === "commercial") {
      setAvailableBrands(getCommercialBrands());
    }
  };

  const handleBrandChange = (brandId: string) => {
    setSelectedBrand(brandId);
    const models = getBrandModels(brandId);
    setAvailableModels(models);
    
    // Clear the selected model when brand changes
    const event = {
      target: { name: 'vehicleModel', value: '' }
    } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(event);
  };

  const handleModelChange = (model: string) => {
    const event = {
      target: { name: 'vehicleModel', value: model }
    } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(event);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">Vehicle Information</h2>
        <p className="text-gray-600">Tell us about your vehicle for personalized assistance</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-gray-800">Vehicle Type</Label>
          <div className="grid grid-cols-3 gap-4">
            {vehicleTypes.map((type) => (
              <div
                key={type.id}
                className={`group relative flex flex-col items-center gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover-scale
                  ${formData.vehicleType === type.id 
                    ? 'border-red-400 bg-gradient-to-br from-red-50 to-red-100 shadow-lg scale-105' 
                    : 'border-gray-200 bg-white hover:border-red-200 hover:bg-red-50/50 hover:shadow-md'}`}
                onClick={() => handleVehicleTypeChange(type.id)}
              >
                <div className={`p-4 rounded-xl transition-all duration-300 ${formData.vehicleType === type.id ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-lg' : 'bg-gray-100 group-hover:bg-red-100'}`}>
                  <type.icon className={`h-8 w-8 transition-colors duration-300 ${formData.vehicleType === type.id ? 'text-white' : 'text-gray-600 group-hover:text-red-600'}`} />
                </div>
                <span className={`text-sm font-semibold text-center transition-colors duration-300 ${formData.vehicleType === type.id ? 'text-red-700' : 'text-gray-700 group-hover:text-red-600'}`}>
                  {type.name}
                </span>
                
                {formData.vehicleType === type.id && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      
        {formData.vehicleType && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-800">Vehicle Subtype</Label>
              <div className="flex flex-wrap gap-3">
                {vehicleTypes.find(t => t.id === formData.vehicleType)?.subtypes.map((subtype) => (
                  <Button
                    key={subtype}
                    type="button"
                    variant={formData.vehicleSubtype === subtype ? "default" : "outline"}
                    className={`px-4 py-2 rounded-xl border-2 transition-all duration-300 ${
                      formData.vehicleSubtype === subtype 
                        ? "bg-gradient-to-r from-red-600 to-red-700 border-red-600 text-white shadow-lg hover:shadow-xl" 
                        : "border-gray-200 hover:border-red-300 hover:bg-red-50"
                    }`}
                    onClick={() => onVehicleSubtypeSelect(subtype)}
                  >
                    {subtype}
                  </Button>
                ))}
              </div>
            </div>
            
            {formData.vehicleSubtype && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                <div className="space-y-3">
                  <Label className="text-lg font-semibold text-gray-800">Vehicle Brand</Label>
                  <Select onValueChange={handleBrandChange} value={selectedBrand}>
                    <SelectTrigger className="h-14 rounded-xl border-2 border-gray-200 hover:border-red-300 focus:border-red-400 bg-white shadow-sm">
                      <SelectValue placeholder="Select your vehicle brand" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2 border-gray-200 shadow-xl bg-white/95 backdrop-blur-sm max-h-[300px]">
                      {availableBrands.map((brand) => (
                        <SelectItem 
                          key={brand.id} 
                          value={brand.id}
                          className="py-3 px-4 hover:bg-red-50 focus:bg-red-50 rounded-lg margin-1"
                        >
                          <div className="flex items-center gap-3">
                            <img 
                              src={brand.logo} 
                              alt={brand.name}
                              className="w-8 h-8 object-contain rounded"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <span className="font-medium">{brand.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedBrand && (
                  <div className="space-y-3 animate-fade-in">
                    <Label className="text-lg font-semibold text-gray-800">Vehicle Model</Label>
                    <Select onValueChange={handleModelChange} value={formData.vehicleModel}>
                      <SelectTrigger className="h-14 rounded-xl border-2 border-gray-200 hover:border-red-300 focus:border-red-400 bg-white shadow-sm">
                        <SelectValue placeholder="Select your vehicle model" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-2 border-gray-200 shadow-xl bg-white/95 backdrop-blur-sm max-h-[300px]">
                        {availableModels.map((model) => (
                          <SelectItem 
                            key={model} 
                            value={model}
                            className="py-3 px-4 hover:bg-red-50 focus:bg-red-50 rounded-lg margin-1"
                          >
                            <span className="font-medium">{model}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleInfoStep;
