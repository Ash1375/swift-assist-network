import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Zap, MapPin, Phone, User, Clock, ArrowLeft, Battery } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const services = {
  "ev-charging": { name: "EV Charging Service", price: "₹299 - ₹899" },
  "towing": { name: "EV Towing Service", price: "₹799 - ₹1,999" },
  "battery": { name: "EV Battery Service", price: "₹599 - ₹1,499" },
  "mechanical": { name: "EV Technical Issues", price: "₹699 - ₹1,799" },
  "other": { name: "Other EV Service", price: "Varies" }
};

const evSubtypes = ["Electric Cars", "Electric Bikes", "Electric Scooters", "Electric Auto"];

const evBrands = [
  { id: "tata", name: "Tata", models: ["Nexon EV", "Tigor EV", "Tiago EV"] },
  { id: "mahindra", name: "Mahindra", models: ["e2o Plus", "eKUV100", "eXUV300"] },
  { id: "mg", name: "MG Motor", models: ["ZS EV", "Comet EV"] },
  { id: "hyundai", name: "Hyundai", models: ["Kona Electric", "Ioniq 5"] },
  { id: "bajaj", name: "Bajaj", models: ["Chetak Electric"] },
  { id: "ather", name: "Ather", models: ["450X", "450 Plus"] },
  { id: "ola", name: "Ola Electric", models: ["S1", "S1 Pro"] },
  { id: "tvs", name: "TVS", models: ["iQube Electric"] },
  { id: "hero", name: "Hero Electric", models: ["Photon", "Optima"] }
];

const EVServiceRequest = () => {
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
    batteryCapacity: "",
    chargingType: "",
    currentBatteryLevel: "",
    location: "",
    landmark: "",
    details: "",
    urgency: "normal"
  });

  const [availableModels, setAvailableModels] = useState<string[]>([]);
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
      const brand = evBrands.find(b => b.id === value);
      setAvailableModels(brand?.models || []);
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
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please login to submit a service request");
        navigate('/login');
        return;
      }

      const serviceData = {
        user_id: user.id,
        service_type: `ev-${serviceId}`,
        vehicle_type: 'ev',
        vehicle_model: `${formData.vehicleBrand} ${formData.vehicleModel} ${formData.vehicleYear}`.trim(),
        address: `${formData.location}${formData.landmark ? ' - ' + formData.landmark : ''}`,
        description: `${formData.details || ''}\nSubtype: ${formData.vehicleSubtype}\nBattery: ${formData.batteryCapacity}\nCharging: ${formData.chargingType}\nCurrent Level: ${formData.currentBatteryLevel}\nUrgency: ${formData.urgency}`,
        contact_name: formData.name,
        contact_phone: formData.phone,
        contact_email: formData.email || '',
        status: 'pending',
        payment_status: 'pending'
      };

      const { data: result, error } = await supabase
        .from('service_requests')
        .insert(serviceData)
        .select()
        .single();

      if (error) throw error;

      toast.success("Service request submitted successfully!");
      navigate(`/request-tracking/${result.id}`);
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
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl">{service.name}</CardTitle>
                <p className="text-purple-100">Estimated: {service.price}</p>
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
                  <Zap className="h-5 w-5" />
                  Electric Vehicle Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>EV Type</Label>
                    <Select onValueChange={(value) => handleSelectChange("vehicleSubtype", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select EV type" />
                      </SelectTrigger>
                      <SelectContent>
                        {evSubtypes.map((subtype) => (
                          <SelectItem key={subtype} value={subtype}>
                            {subtype}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>EV Brand</Label>
                    <Select onValueChange={(value) => handleSelectChange("vehicleBrand", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select EV brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {evBrands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>EV Model</Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange("vehicleModel", value)}
                      disabled={!formData.vehicleBrand}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select EV model" />
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
                      placeholder="e.g., 2023"
                    />
                  </div>
                </div>
              </div>

              {/* Battery Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Battery className="h-5 w-5" />
                  Battery & Charging Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="batteryCapacity">Battery Capacity (kWh)</Label>
                    <Input
                      id="batteryCapacity"
                      name="batteryCapacity"
                      value={formData.batteryCapacity}
                      onChange={handleInputChange}
                      placeholder="e.g., 30.2 kWh"
                    />
                  </div>
                  <div>
                    <Label>Charging Type</Label>
                    <Select onValueChange={(value) => handleSelectChange("chargingType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select charging type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="type1">Type 1 (AC)</SelectItem>
                        <SelectItem value="type2">Type 2 (AC)</SelectItem>
                        <SelectItem value="ccs">CCS (DC Fast)</SelectItem>
                        <SelectItem value="chademo">CHAdeMO (DC)</SelectItem>
                        <SelectItem value="bharat">Bharat AC001</SelectItem>
                        <SelectItem value="bharat-dc">Bharat DC001</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="currentBatteryLevel">Current Battery %</Label>
                    <Input
                      id="currentBatteryLevel"
                      name="currentBatteryLevel"
                      value={formData.currentBatteryLevel}
                      onChange={handleInputChange}
                      placeholder="e.g., 15%"
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
                      placeholder="e.g., Near EV Charging Station"
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
                    placeholder="Describe the issue, preferred charging speed, any error messages..."
                    rows={4}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full py-6 text-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
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

export default EVServiceRequest;