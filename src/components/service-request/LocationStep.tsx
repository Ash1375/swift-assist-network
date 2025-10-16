
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { ServiceRequestFormData } from "./types";
import { MapPin, Navigation } from "lucide-react";

interface LocationStepProps {
  formData: ServiceRequestFormData;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
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
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputEvent = {
      target: {
        name: e.target.name,
        value: e.target.value
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(inputEvent);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">Location Details</h3>
        <p className="text-sm text-muted-foreground">Where should the technician meet you?</p>
      </div>
      
      <Card className="p-4 md:p-6 border-border/50 bg-accent/20 hover:bg-accent/30 transition-colors">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <Label className="text-base font-semibold">Your Location</Label>
            </div>
            <Button
              type="button"
              onClick={onGetCurrentLocation}
              disabled={isGettingLocation}
              size="sm"
              variant="outline"
              className="gap-2 h-9"
            >
              <Navigation className="h-3.5 w-3.5" />
              {isGettingLocation ? "Getting..." : "GPS"}
            </Button>
          </div>
          
          {currentLocation && (
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 mb-3">
              <p className="text-xs font-medium text-primary mb-1">📍 Detected Location:</p>
              <p className="text-sm text-foreground">{currentLocation}</p>
            </div>
          )}
          
          <Textarea 
            id="location" 
            name="location" 
            value={formData.location} 
            onChange={handleTextareaChange} 
            placeholder="Enter your address with nearby landmarks..."
            className="min-h-[100px] text-base border-2 focus:border-primary resize-none"
            required
          />
          <p className="text-xs text-muted-foreground">
            💡 Include landmarks, building name, or area name for faster service
          </p>
        </div>
      </Card>

      <Card className="p-4 md:p-6 border-border/50 bg-accent/20 hover:bg-accent/30 transition-colors">
        <div className="space-y-3">
          <Label htmlFor="details" className="text-base font-semibold">Additional Details (Optional)</Label>
          <Textarea
            id="details"
            name="details"
            placeholder="Gate code, parking instructions, or special notes..."
            value={formData.details}
            onChange={handleTextareaChange}
            rows={3}
            className="text-base border-2 focus:border-primary resize-none"
          />
        </div>
      </Card>
    </div>
  );
};

export default LocationStep;
