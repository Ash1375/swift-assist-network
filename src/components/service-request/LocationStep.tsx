
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ServiceRequestFormData } from "./types";
import { Info, MapPin } from "lucide-react";

interface LocationStepProps {
  formData: ServiceRequestFormData;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  currentLocation: string;
  isGettingLocation: boolean;
  onGetCurrentLocation: () => void;
}

const LocationStep = ({
  formData,
  onInputChange,
  currentLocation,
  isGettingLocation,
  onGetCurrentLocation
}: LocationStepProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Your Location</h2>
      <div className="flex items-center gap-4 mb-4">
        <Button 
          type="button" 
          onClick={onGetCurrentLocation}
          disabled={isGettingLocation}
          className="bg-red-600 hover:bg-red-700"
        >
          <MapPin className="mr-2 h-4 w-4" />
          {isGettingLocation ? "Getting Location..." : "Use Current Location"}
        </Button>
        <span className="text-sm text-gray-500">or enter manually</span>
      </div>
      
      {currentLocation && (
        <div className="p-4 bg-red-50 rounded-md mb-4 border border-red-100">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Detected Location:</p>
              <p className="text-gray-700">{currentLocation}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="location">Address/Location Description</Label>
        <Textarea 
          id="location" 
          name="location" 
          value={formData.location} 
          onChange={onInputChange} 
          placeholder="Enter your precise location, nearby landmarks, or full address with pincode"
          className="min-h-[100px] border-gray-300 focus:border-red-500 focus:ring focus:ring-red-200"
          required
        />
        <p className="text-xs text-gray-500">Please provide nearby landmarks and locality name to help the technician find you quickly in Tamil Nadu</p>
      </div>
    </div>
  );
};

export default LocationStep;
