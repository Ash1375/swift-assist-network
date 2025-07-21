
import { ServiceType, ServiceRequestFormData } from "./types";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AlertCircle, Star } from "lucide-react";
import defaultAvatar from "@/assets/default-avatar.png";

interface ConfirmationStepProps {
  service: ServiceType;
  formData: ServiceRequestFormData;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ConfirmationStep = ({ service, formData, onInputChange }: ConfirmationStepProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Request Summary</h2>
      
      <Card className="bg-red-50 border-red-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-red-700">Service Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Service:</span>
              <span>{service.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Estimated Price:</span>
              <span>{service.estimatedPrice}</span>
            </div>
            <p className="text-sm text-red-600/80 mt-1">Final price may vary based on specific requirements</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Selected Technician</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-gray-100">
              <AvatarImage src={defaultAvatar} alt="Technician" />
              <AvatarFallback className="bg-red-100 text-red-800 font-semibold">
                RT
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">Rajesh Kumar</h4>
              <div className="flex items-center text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-3 w-3" fill="currentColor" />
                ))}
                <span className="ml-1 text-xs text-gray-600">4.8 (538 jobs)</span>
              </div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-xl font-bold text-red-600">₹599</div>
              <div className="text-xs text-gray-500">Base Charge</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{formData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{formData.phone}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Vehicle</p>
              <p className="font-medium">
                {formData.vehicleSubtype} {formData.vehicleModel}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{formData.location}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div>
        <Label htmlFor="details">Additional Details (Optional)</Label>
        <Textarea 
          id="details" 
          name="details" 
          value={formData.details} 
          onChange={onInputChange} 
          placeholder="Any additional information about your situation that might help our technician"
          className="min-h-[80px] border-gray-300 focus:border-red-500 focus:ring focus:ring-red-200"
        />
      </div>
      
      <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
        <p className="text-sm text-yellow-700">
          By submitting this request, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </div>
  );
};

export default ConfirmationStep;
