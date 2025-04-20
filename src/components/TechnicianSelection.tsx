
import { useState } from "react";
import { Star, ThumbsUp, MapPin, Clock, Award, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";

type Technician = {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  price: number;
  currency: string;
  distance: string;
  estimatedArrival: string;
  completedJobs: number;
  specialties: string[];
  verified: boolean;
  badges?: string[];
};

// Mock data - in a real app, this would come from an API
const mockTechnicians: Technician[] = [
  {
    id: "tech-1",
    name: "Rajesh Kumar",
    avatar: "/placeholder.svg",
    rating: 4.8,
    price: 599,
    currency: "₹",
    distance: "2.3 km",
    estimatedArrival: "15-20 min",
    completedJobs: 538,
    specialties: ["Towing", "Battery", "Flat Tire"],
    verified: true,
    badges: ["Premium", "Top Rated"]
  },
  {
    id: "tech-2",
    name: "Ananya Singh",
    avatar: "/placeholder.svg",
    rating: 4.6,
    price: 499,
    currency: "₹",
    distance: "3.8 km",
    estimatedArrival: "20-25 min",
    completedJobs: 287,
    specialties: ["Mechanical", "Lockout", "Fuel Delivery"],
    verified: true
  },
  {
    id: "tech-3",
    name: "Vikram Patel",
    avatar: "/placeholder.svg",
    rating: 4.9,
    price: 799,
    currency: "₹",
    distance: "1.5 km",
    estimatedArrival: "10-15 min",
    completedJobs: 712,
    specialties: ["All Services", "Emergency Response"],
    verified: true,
    badges: ["Premium", "Emergency Specialist"]
  },
  {
    id: "tech-4",
    name: "Priya Desai",
    avatar: "/placeholder.svg",
    rating: 4.5,
    price: 549,
    currency: "₹",
    distance: "4.2 km",
    estimatedArrival: "25-30 min",
    completedJobs: 195,
    specialties: ["Battery", "Flat Tire", "Fuel Delivery"],
    verified: true
  }
];

interface TechnicianSelectionProps {
  serviceType: string;
  onSelect: (technicianId: string) => void;
}

const TechnicianSelection = ({ serviceType, onSelect }: TechnicianSelectionProps) => {
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"price" | "rating" | "arrival">("arrival");

  const sortedTechnicians = [...mockTechnicians].sort((a, b) => {
    if (sortBy === "price") {
      return a.price - b.price;
    } else if (sortBy === "rating") {
      return b.rating - a.rating;
    } else {
      // Sort by estimated arrival (parsing the min values)
      const aTime = parseInt(a.estimatedArrival.split("-")[0]);
      const bTime = parseInt(b.estimatedArrival.split("-")[0]);
      return aTime - bTime;
    }
  });

  const handleTechnicianClick = (techId: string) => {
    setSelectedTechnician(techId);
  };

  const confirmSelection = () => {
    if (selectedTechnician) {
      onSelect(selectedTechnician);
    }
  };

  // Generate star display for ratings
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const starFill = i < Math.floor(rating) ? "text-yellow-500" : "text-gray-300";
      stars.push(
        <Star key={i} className={`h-4 w-4 ${starFill} inline-block`} fill={i < Math.floor(rating) ? "currentColor" : "none"} />
      );
    }
    return stars;
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-4">
        <h3 className="text-2xl font-bold text-center sm:text-left">Available Technicians Near You</h3>
        <p className="text-gray-600 text-center sm:text-left">
          Select a technician for your {serviceType} service
        </p>
        
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          <Button 
            variant={sortBy === "arrival" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setSortBy("arrival")}
            className={sortBy === "arrival" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            <Clock className="mr-1 h-4 w-4" />
            Fastest Arrival
          </Button>
          <Button 
            variant={sortBy === "price" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setSortBy("price")}
            className={sortBy === "price" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            Price: Low to High
          </Button>
          <Button 
            variant={sortBy === "rating" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setSortBy("rating")}
            className={sortBy === "rating" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            <Star className="mr-1 h-4 w-4" />
            Top Rated
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedTechnicians.map((tech) => (
          <Card 
            key={tech.id} 
            className={`cursor-pointer border-2 hover:shadow-md transition-all ${
              selectedTechnician === tech.id ? "border-red-500 ring-2 ring-red-100" : "border-gray-200"
            }`}
            onClick={() => handleTechnicianClick(tech.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 border-2 border-gray-100">
                    <AvatarImage src={tech.avatar} alt={tech.name} />
                    <AvatarFallback className="bg-red-100 text-red-800 font-semibold">
                      {tech.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {tech.name} 
                      {tech.verified && <Shield className="h-4 w-4 text-blue-500" fill="currentColor" />}
                    </CardTitle>
                    <div className="flex items-center mt-1">
                      {renderStars(tech.rating)}
                      <span className="ml-1 text-sm font-medium">{tech.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-red-600">{tech.currency}{tech.price}</div>
                  <div className="text-xs text-gray-500">Base Charge</div>
                </div>
              </div>
              
              {tech.badges && tech.badges.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tech.badges.map(badge => (
                    <Badge key={badge} variant="secondary" className="bg-red-50 text-red-700 hover:bg-red-100">
                      {badge === "Premium" && <Award className="h-3 w-3 mr-1" />}
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}
            </CardHeader>
            
            <CardContent className="pb-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                  <span>{tech.distance} away</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-1" />
                  <span>ETA: {tech.estimatedArrival}</span>
                </div>
                <div className="flex items-center col-span-2">
                  <ThumbsUp className="h-4 w-4 text-gray-500 mr-1" />
                  <span>{tech.completedJobs} jobs completed</span>
                </div>
              </div>
              
              <div className="mt-3">
                <CardDescription className="text-xs text-gray-500 mb-1">Specialties:</CardDescription>
                <div className="flex flex-wrap gap-1">
                  {tech.specialties.map(specialty => (
                    <Badge key={specialty} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                variant={selectedTechnician === tech.id ? "default" : "outline"} 
                className={`w-full ${selectedTechnician === tech.id ? "bg-red-600 hover:bg-red-700" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTechnicianClick(tech.id);
                }}
              >
                {selectedTechnician === tech.id ? "Selected" : "Select"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end pt-4">
        <Button 
          className="bg-red-600 hover:bg-red-700" 
          disabled={!selectedTechnician}
          onClick={confirmSelection}
        >
          Continue with Selected Technician
        </Button>
      </div>
    </div>
  );
};

export default TechnicianSelection;
