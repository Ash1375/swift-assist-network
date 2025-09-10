import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Bike, MapPin, Phone, User, Clock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getBikeBrands, getBrandModels } from "@/data/indianVehicles";

const services = {
  "towing": { name: "Bike Towing Service", price: "₹299 - ₹799" },
  "flat-tire": { name: "Bike Tire Repair", price: "₹149 - ₹399" },
  "battery": { name: "Bike Battery Service", price: "₹199 - ₹499" },
  "mechanical": { name: "Bike Mechanical Issues", price: "₹299 - ₹899" },
  "fuel": { name: "Bike Fuel Delivery", price: "₹199 - ₹399" },
  "lockout": { name: "Bike Key Issues", price: "₹299 - ₹599" },
  "other": { name: "Other Bike Service", price: "Varies" }
};

const bikeSubtypes = ["Sport Bike", "Cruiser", "Commuter", "Scooter", "Other Bikes"];

const BikeServiceRequest = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    vehicleSubtype: "",
    vehicleBrand: "",
    vehicleModel: "",
    vehicleYear: "",
    engineCapacity: "",
    location: "",
    landmark: "",
    details: "",
    urgency: "normal"
  });

  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const bikeBrands = getBikeBrands();
  const service = serviceId && services[serviceId as keyof typeof services] 
    ? services[serviceId as keyof typeof services] 
    : services.other;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "vehicleBrand") {
      const models = getBrandModels(value);
      setAvailableModels(models);
      setFormData(prev => ({ ...prev, vehicleModel: "" }));
    }
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationText = `${position.coords.latitude}, ${position.coords.longitude}`;
          setFormData(prev => ({ ...prev, location: locationText }));
          setIsGettingLocation(false);
          toast.success("Location detected successfully!");
        },
        (error) => {
          console.error("Location error:", error);
          toast.error("Unable to get location. Please enter manually.");
          setIsGettingLocation(false);
        }
      );
    } else {
      toast.error("Geolocation not supported by this browser.");
      setIsGettingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const serviceData = {
        user_id: 'temp-user-id',
        service_type: `bike-${serviceId}`,
        vehicle_info: {
          type: 'bike',
          subtype: formData.vehicleSubtype,
          brand: formData.vehicleBrand,
          model: formData.vehicleModel,
          year: formData.vehicleYear,
          engineCapacity: formData.engineCapacity
        },
        location_info: {
          address: formData.location,
          landmark: formData.landmark
        },
        personal_info: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email
        },
        details: formData.details,
        urgency: formData.urgency,
        status: 'pending'
      };

      const { error } = await supabase
        .from('service_requests')
        .insert(serviceData);

      if (error) throw error;

      toast.success("Service request submitted successfully!");
      navigate(`/request-tracking/temp-request-id`);
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10 py-8">
      <div className="container max-w-3xl px-4">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="flex items-center gap-3">
              <Bike className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl">{service.name}</CardTitle>
                <p className="text-orange-100">Estimated: {service.price}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Bike className="h-5 w-5" />
                  Bike/Motorcycle Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Bike Type</Label>
                    <Select onValueChange={(value) => handleSelectChange("vehicleSubtype", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bike type" />
                      </SelectTrigger>
                      <SelectContent>
                        {bikeSubtypes.map((subtype) => (
                          <SelectItem key={subtype} value={subtype}>
                            {subtype}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Bike Brand</Label>
                    <Select onValueChange={(value) => handleSelectChange("vehicleBrand", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bike brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {bikeBrands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Bike Model</Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange("vehicleModel", value)}
                      disabled={!formData.vehicleBrand}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select bike model" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableModels.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="engineCapacity">Engine CC (Optional)</Label>
                    <Input
                      id="engineCapacity"
                      name="engineCapacity"
                      value={formData.engineCapacity}
                      onChange={handleInputChange}
                      placeholder="e.g., 150cc"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicleYear">Year (Optional)</Label>
                    <Input
                      id="vehicleYear"
                      name="vehicleYear"
                      value={formData.vehicleYear}
                      onChange={handleInputChange}
                      placeholder="e.g., 2020"
                    />
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="location">Current Location *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Enter your current location"
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={getCurrentLocation}
                        disabled={isGettingLocation}
                      >
                        {isGettingLocation ? "Getting..." : "Use GPS"}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="landmark">Nearby Landmark</Label>
                    <Input
                      id="landmark"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      placeholder="e.g., Near XYZ Mall"
                    />
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Service Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Urgency Level</Label>
                    <Select onValueChange={(value) => handleSelectChange("urgency", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Within 2 hours</SelectItem>
                        <SelectItem value="normal">Normal - Within 1 hour</SelectItem>
                        <SelectItem value="high">High - Within 30 minutes</SelectItem>
                        <SelectItem value="emergency">Emergency - ASAP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="details">Additional Details</Label>
                  <Textarea
                    id="details"
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    placeholder="Describe the issue or any specific requirements..."
                    rows={4}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full py-6 text-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting Request..." : "Submit Service Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BikeServiceRequest;