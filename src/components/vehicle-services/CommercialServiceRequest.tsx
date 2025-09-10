import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Truck, MapPin, Phone, User, Clock, ArrowLeft, Building } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getCommercialBrands, getBrandModels } from "@/data/indianVehicles";

const services = {
  "towing": { name: "Commercial Towing Service", price: "₹1,299 - ₹3,999" },
  "flat-tire": { name: "Commercial Tire Service", price: "₹799 - ₹1,499" },
  "battery": { name: "Commercial Battery Service", price: "₹899 - ₹1,799" },
  "mechanical": { name: "Commercial Mechanical Issues", price: "₹1,299 - ₹2,999" },
  "fuel": { name: "Commercial Fuel Delivery", price: "₹599 - ₹1,299" },
  "lockout": { name: "Commercial Lockout Assistance", price: "₹799 - ₹1,299" },
  "winching": { name: "Commercial Winching Service", price: "₹1,599 - ₹3,999" },
  "other": { name: "Other Commercial Service", price: "Varies" }
};

const commercialSubtypes = ["Truck", "Van", "Bus", "Construction Vehicle", "Other Commercial"];

const CommercialServiceRequest = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    companyName: "",
    vehicleSubtype: "",
    vehicleBrand: "",
    vehicleModel: "",
    vehicleYear: "",
    vehicleCapacity: "",
    location: "",
    landmark: "",
    details: "",
    urgency: "normal"
  });

  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const commercialBrands = getCommercialBrands();
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
        service_type: `commercial-${serviceId}`,
        vehicle_info: {
          type: 'commercial',
          subtype: formData.vehicleSubtype,
          brand: formData.vehicleBrand,
          model: formData.vehicleModel,
          year: formData.vehicleYear,
          capacity: formData.vehicleCapacity
        },
        location_info: {
          address: formData.location,
          landmark: formData.landmark
        },
        personal_info: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          companyName: formData.companyName
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
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="flex items-center gap-3">
              <Truck className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl">{service.name}</CardTitle>
                <p className="text-green-100">Estimated: {service.price}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div>
                    <Label htmlFor="companyName">Company Name (Optional)</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Enter company name"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Commercial Vehicle Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Vehicle Type</Label>
                    <Select onValueChange={(value) => handleSelectChange("vehicleSubtype", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        {commercialSubtypes.map((subtype) => (
                          <SelectItem key={subtype} value={subtype}>
                            {subtype}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Vehicle Brand</Label>
                    <Select onValueChange={(value) => handleSelectChange("vehicleBrand", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {commercialBrands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Vehicle Model</Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange("vehicleModel", value)}
                      disabled={!formData.vehicleBrand}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle model" />
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
                    <Label htmlFor="vehicleCapacity">Capacity/Tonnage</Label>
                    <Input
                      id="vehicleCapacity"
                      name="vehicleCapacity"
                      value={formData.vehicleCapacity}
                      onChange={handleInputChange}
                      placeholder="e.g., 10 tons, 32 seater"
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
                      placeholder="e.g., Near Industrial Area Gate 5"
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
                        <SelectItem value="low">Low - Within 3 hours</SelectItem>
                        <SelectItem value="normal">Normal - Within 2 hours</SelectItem>
                        <SelectItem value="high">High - Within 1 hour</SelectItem>
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
                    placeholder="Describe the issue, cargo details, special requirements..."
                    rows={4}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full py-6 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
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

export default CommercialServiceRequest;