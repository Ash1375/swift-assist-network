
import { useState } from "react";
import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { VehicleCategory } from "./types";

type ServiceVehicleSelectorProps = {
  vehicleCategories: VehicleCategory[];
  selectedVehicleType: string | null;
  selectedVehicleSubtype: string | null;
  serviceId: string;
  onVehicleTypeSelect: (type: string) => void;
  onVehicleSubtypeSelect: (subtype: string) => void;
};

const ServiceVehicleSelector = ({
  vehicleCategories,
  selectedVehicleType,
  selectedVehicleSubtype,
  serviceId,
  onVehicleTypeSelect,
  onVehicleSubtypeSelect,
}: ServiceVehicleSelectorProps) => {
  // Get the selected vehicle category
  const selectedVehicleCategory = selectedVehicleType 
    ? vehicleCategories.find(c => c.id === selectedVehicleType) 
    : null;
  
  // Make sure subtypes exist before trying to map over them
  const vehicleSubtypes = selectedVehicleCategory?.subtypes || [];

  return (
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
                onClick={() => onVehicleTypeSelect(category.id)}
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
            <Select onValueChange={onVehicleSubtypeSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle subtype" />
              </SelectTrigger>
              <SelectContent>
                {vehicleSubtypes.map((subtype) => (
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
              <Link to={`/request-service/${serviceId}`}>
                Confirm Request <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ServiceVehicleSelector;
