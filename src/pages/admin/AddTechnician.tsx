import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { ArrowLeft, UserPlus, Save } from "lucide-react";
import { services } from "@/components/services-page/ServicesData";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const AddTechnician = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    district: "",
    region: "",
    locality: "",
    serviceAreaRange: 10,
    experience: 0,
    specialties: [] as string[],
    pricing: {
      towing: 0,
      tireChange: 0,
      jumpStart: 0,
      fuelDelivery: 0,
      lockout: 0,
      winching: 0,
      evCharging: 0
    },
    verificationStatus: "verified" as "pending" | "verified"
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePricingChange = (service: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [service]: value
      }
    }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.specialties.length === 0) {
      toast.error("Please select at least one specialty");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('technicians')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          state: formData.state,
          district: formData.district,
          region: formData.region,
          locality: formData.locality,
          service_area_range: formData.serviceAreaRange,
          experience: formData.experience,
          specialties: formData.specialties,
          pricing: formData.pricing,
          verification_status: formData.verificationStatus,
          rating: 0,
          completed_jobs: 0
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Technician added successfully!");
      navigate("/admin/technicians");
    } catch (error: any) {
      console.error("Error adding technician:", error);
      toast.error(error.message || "Failed to add technician");
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableServices = services.filter(s => s.id !== 'other').map(s => ({
    id: s.id,
    name: s.name
  }));

  return (
    <div className="container py-6 max-w-4xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/admin/technicians")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Technicians
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Technician
          </CardTitle>
          <CardDescription>
            Manually add a technician to the platform with their services and pricing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter technician's full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="technician@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+91 XXXXXXXXXX"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    value={formData.experience}
                    onChange={(e) => handleChange("experience", parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Service Area</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select 
                    value={formData.state} 
                    onValueChange={(value) => handleChange("state", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => handleChange("district", e.target.value)}
                    placeholder="Enter district"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) => handleChange("region", e.target.value)}
                    placeholder="Enter region"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="locality">Locality</Label>
                  <Input
                    id="locality"
                    value={formData.locality}
                    onChange={(e) => handleChange("locality", e.target.value)}
                    placeholder="Enter locality"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Enter full address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceAreaRange">Service Area Range (km)</Label>
                  <Input
                    id="serviceAreaRange"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.serviceAreaRange}
                    onChange={(e) => handleChange("serviceAreaRange", parseInt(e.target.value) || 10)}
                  />
                </div>
              </div>
            </div>

            {/* Services / Specialties */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Services Offered *</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableServices.map(service => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={service.id}
                      checked={formData.specialties.includes(service.name)}
                      onCheckedChange={() => handleSpecialtyToggle(service.name)}
                    />
                    <Label htmlFor={service.id} className="text-sm cursor-pointer">
                      {service.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Service Pricing (₹)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price-towing">Towing</Label>
                  <Input
                    id="price-towing"
                    type="number"
                    min="0"
                    value={formData.pricing.towing}
                    onChange={(e) => handlePricingChange("towing", parseInt(e.target.value) || 0)}
                    placeholder="₹"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price-tire">Tire Change</Label>
                  <Input
                    id="price-tire"
                    type="number"
                    min="0"
                    value={formData.pricing.tireChange}
                    onChange={(e) => handlePricingChange("tireChange", parseInt(e.target.value) || 0)}
                    placeholder="₹"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price-jump">Jump Start</Label>
                  <Input
                    id="price-jump"
                    type="number"
                    min="0"
                    value={formData.pricing.jumpStart}
                    onChange={(e) => handlePricingChange("jumpStart", parseInt(e.target.value) || 0)}
                    placeholder="₹"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price-fuel">Fuel Delivery</Label>
                  <Input
                    id="price-fuel"
                    type="number"
                    min="0"
                    value={formData.pricing.fuelDelivery}
                    onChange={(e) => handlePricingChange("fuelDelivery", parseInt(e.target.value) || 0)}
                    placeholder="₹"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price-lockout">Lockout</Label>
                  <Input
                    id="price-lockout"
                    type="number"
                    min="0"
                    value={formData.pricing.lockout}
                    onChange={(e) => handlePricingChange("lockout", parseInt(e.target.value) || 0)}
                    placeholder="₹"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price-winching">Winching</Label>
                  <Input
                    id="price-winching"
                    type="number"
                    min="0"
                    value={formData.pricing.winching}
                    onChange={(e) => handlePricingChange("winching", parseInt(e.target.value) || 0)}
                    placeholder="₹"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price-ev">EV Charging</Label>
                  <Input
                    id="price-ev"
                    type="number"
                    min="0"
                    value={formData.pricing.evCharging}
                    onChange={(e) => handlePricingChange("evCharging", parseInt(e.target.value) || 0)}
                    placeholder="₹"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Verification Status</h3>
              <Select 
                value={formData.verificationStatus} 
                onValueChange={(value: "pending" | "verified") => handleChange("verificationStatus", value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="verified">Verified (Active)</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/admin/technicians")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Adding...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Add Technician
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTechnician;
