
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
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
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">Vehicle Information</h3>
        <p className="text-sm text-muted-foreground">Tell us about your vehicle for personalized service</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-semibold text-foreground">Vehicle Type</Label>
          <div className="grid grid-cols-3 gap-3">
            {vehicleTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                className={`group relative flex flex-col items-center gap-3 p-4 md:p-6 rounded-2xl border-2 transition-all duration-300 active:scale-95
                  ${formData.vehicleType === type.id 
                    ? 'border-primary bg-primary/10 shadow-lg' 
                    : 'border-border bg-card hover:border-primary/50 hover:bg-accent/50'}`}
                onClick={() => handleVehicleTypeChange(type.id)}
              >
                <div className={`p-3 md:p-4 rounded-xl transition-all duration-300 ${formData.vehicleType === type.id ? 'bg-primary text-primary-foreground' : 'bg-accent'}`}>
                  <type.icon className={`h-6 w-6 md:h-8 md:w-8 transition-colors duration-300 ${formData.vehicleType === type.id ? 'text-primary-foreground' : 'text-foreground'}`} />
                </div>
                <span className={`text-xs md:text-sm font-semibold text-center transition-colors duration-300 ${formData.vehicleType === type.id ? 'text-primary' : 'text-foreground'}`}>
                  {type.name}
                </span>
                
                {formData.vehicleType === type.id && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      
        {formData.vehicleType && (
          <div className="space-y-6 animate-in fade-in-50 duration-500">
            <div className="space-y-4">
              <Label className="text-base font-semibold text-foreground">Vehicle Subtype</Label>
              <div className="flex flex-wrap gap-2">
                {vehicleTypes.find(t => t.id === formData.vehicleType)?.subtypes.map((subtype) => (
                  <Button
                    key={subtype}
                    type="button"
                    variant={formData.vehicleSubtype === subtype ? "default" : "outline"}
                    className={`px-3 md:px-4 py-2 rounded-xl border-2 transition-all duration-300 active:scale-95 ${
                      formData.vehicleSubtype === subtype 
                        ? "shadow-md" 
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => onVehicleSubtypeSelect(subtype)}
                  >
                    {subtype}
                  </Button>
                ))}
              </div>
            </div>
            
            {formData.vehicleSubtype && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in-50 duration-500">
                <Card className="p-4 border-border/50 bg-accent/20">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Vehicle Brand</Label>
                    <Select onValueChange={handleBrandChange} value={selectedBrand}>
                      <SelectTrigger className="h-12 rounded-xl border-2 hover:border-primary/50 focus:border-primary bg-background">
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-2 shadow-xl max-h-[250px]">
                        {availableBrands.map((brand) => (
                          <SelectItem 
                            key={brand.id} 
                            value={brand.id}
                            className="py-3 px-4 hover:bg-accent rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <img 
                                src={brand.logo} 
                                alt={brand.name}
                                className="w-6 h-6 object-contain"
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
                </Card>
                
                {selectedBrand && (
                  <Card className="p-4 border-border/50 bg-accent/20 animate-in fade-in-50 duration-500">
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Vehicle Model</Label>
                      <Select onValueChange={handleModelChange} value={formData.vehicleModel}>
                        <SelectTrigger className="h-12 rounded-xl border-2 hover:border-primary/50 focus:border-primary bg-background">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-2 shadow-xl max-h-[250px]">
                          {availableModels.map((model) => (
                            <SelectItem 
                              key={model} 
                              value={model}
                              className="py-3 px-4 hover:bg-accent rounded-lg"
                            >
                              <span className="font-medium">{model}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </Card>
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
