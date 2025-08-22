
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ServiceRequestFormData } from "./types";
import { User, Phone, Star, Clock } from "lucide-react";

interface PersonalInfoStepProps {
  formData: ServiceRequestFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoStep = ({ formData, onInputChange }: PersonalInfoStepProps) => {
  const [selectedTitle, setSelectedTitle] = useState("");
  const [isQuickName, setIsQuickName] = useState(false);
  
  const titleOptions = ["Mr.", "Ms.", "Mrs.", "Dr."];
  const quickContactMethods = [
    { icon: Phone, label: "Call me", description: "Preferred contact method" },
    { icon: Star, label: "VIP Service", description: "Priority support" },
    { icon: Clock, label: "Standard", description: "Regular service" }
  ];

  const handleTitleSelect = (title: string) => {
    setSelectedTitle(title);
    const currentName = formData.name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.)\s*/, "");
    const event = {
      target: {
        name: "name",
        value: `${title} ${currentName}`.trim()
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(event);
  };

  const handleQuickNameToggle = () => {
    setIsQuickName(!isQuickName);
    if (!isQuickName) {
      // Focus on name input when switching to quick entry
      setTimeout(() => {
        document.getElementById("name")?.focus();
      }, 100);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Let's get you started</h2>
        <p className="text-muted-foreground">Quick setup - just a few clicks!</p>
      </div>
      
      <div className="space-y-6">
        {/* Name Section */}
        <Card className="p-6 border-0 bg-accent/30">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <Label className="text-base font-medium">How should we address you?</Label>
            </div>
            
            {/* Title Selection */}
            <div className="flex flex-wrap gap-2 mb-4">
              {titleOptions.map((title) => (
                <Button
                  key={title}
                  type="button"
                  variant={selectedTitle === title ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTitleSelect(title)}
                  className="transition-all duration-200 hover:scale-105"
                >
                  {title}
                </Button>
              ))}
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={onInputChange} 
                placeholder="Your full name"
                className="text-base p-4 border-2 focus:border-primary transition-colors"
                required
              />
            </div>
          </div>
        </Card>

        {/* Phone Section */}
        <Card className="p-6 border-0 bg-accent/30">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="h-5 w-5 text-primary" />
              <Label className="text-base font-medium">Contact Information</Label>
            </div>
            
            {/* Phone Input with Country Code */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline" 
                className="px-4 py-6 text-base font-medium"
                disabled
              >
                +91
              </Button>
              <Input 
                id="phone" 
                name="phone" 
                value={formData.phone} 
                onChange={onInputChange} 
                placeholder="Your mobile number"
                type="tel"
                className="text-base p-4 border-2 focus:border-primary transition-colors flex-1"
                required
              />
            </div>
            
            <p className="text-sm text-muted-foreground bg-background/50 p-3 rounded-lg border">
              📱 We'll send you real-time updates about your service request
            </p>
          </div>
        </Card>

        {/* Quick Contact Preferences */}
        <Card className="p-6 border-0 bg-accent/30">
          <div className="space-y-4">
            <Label className="text-base font-medium">Service Priority</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {quickContactMethods.map((method, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
                >
                  <method.icon className="h-6 w-6 text-primary" />
                  <div className="text-center">
                    <div className="font-medium">{method.label}</div>
                    <div className="text-xs text-muted-foreground">{method.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
