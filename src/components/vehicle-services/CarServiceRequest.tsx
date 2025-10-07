import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Car, MapPin, Phone, User, Clock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getCarBrands, getBrandModels } from "@/data/indianVehicles";

const services = {
  "towing": { name: "Car Towing Service", price: "₹599 - ₹1,499" },
  "flat-tire": { name: "Car Tire Repair", price: "₹349 - ₹699" },
  "battery": { name: "Car Battery Service", price: "₹399 - ₹899" },
  "mechanical": { name: "Car Mechanical Issues", price: "₹499 - ₹1,299" },
  "fuel": { name: "Car Fuel Delivery", price: "₹299 - ₹599" },
  "lockout": { name: "Car Lockout Assistance", price: "₹399 - ₹799" },
  "winching": { name: "Car Winching Service", price: "₹599 - ₹1,499" },
  "other": { name: "Other Car Service", price: "Varies" }
};

const carSubtypes = ["SUV", "Hatchback", "Sedan", "MPV", "Other Cars"];

const CarServiceRequest = () => {
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
    location: "",
    landmark: "",
    details: "",
    urgency: "normal"
  });

  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const carBrands = getCarBrands();
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
    
    // Validation
    if (!formData.name || !formData.phone || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const serviceData = {
        service_type: `car-${serviceId}`,
        vehicle_info: {
          type: 'car',
          subtype: formData.vehicleSubtype,
          brand: formData.vehicleBrand,
          model: formData.vehicleModel,
          year: formData.vehicleYear
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
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10 py-4 md:py-8 pb-24 md:pb-8">
      <div className="container max-w-3xl px-3 md:px-4">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center gap-3">
              <Car className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl">{service.name}</CardTitle>
                <p className="text-blue-100">Estimated: {service.price}</p>
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
                  <Car className="h-5 w-5" />
                  Car Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Car Type</Label>
                    <Select onValueChange={(value) => handleSelectChange("vehicleSubtype", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select car type" />
                      </SelectTrigger>
                      <SelectContent>
                        {carSubtypes.map((subtype) => (
                          <SelectItem key={subtype} value={subtype}>
                            {subtype}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Car Brand</Label>
                    <Select onValueChange={(value) => handleSelectChange("vehicleBrand", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select car brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {carBrands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Car Model</Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange("vehicleModel", value)}
                      disabled={!formData.vehicleBrand}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select car model" />
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

              <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t md:relative md:border-t-0 md:p-0 z-10">
                <Button 
                  type="submit" 
                  className="w-full py-6 text-lg shadow-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting Request..." : "Submit Service Request"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CarServiceRequest;