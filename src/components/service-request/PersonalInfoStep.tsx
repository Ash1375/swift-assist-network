
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ServiceRequestFormData } from "./types";

interface PersonalInfoStepProps {
  formData: ServiceRequestFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoStep = ({ formData, onInputChange }: PersonalInfoStepProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={onInputChange} 
            placeholder="Enter your full name"
            className="border-gray-300 focus:border-red-500 focus:ring focus:ring-red-200"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone" 
            name="phone" 
            value={formData.phone} 
            onChange={onInputChange} 
            placeholder="Enter your phone number"
            className="border-gray-300 focus:border-red-500 focus:ring focus:ring-red-200"
            required
          />
          <p className="text-xs text-gray-500">We'll send updates about your service request to this number</p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
