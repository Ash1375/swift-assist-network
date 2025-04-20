
import { Star, ThumbsUp, MapPin, Clock, Award, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Technician } from "./types";

interface TechnicianCardProps {
  technician: Technician;
  isSelected: boolean;
  onSelect: (techId: string) => void;
}

export const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    const starFill = i < Math.floor(rating) ? "text-yellow-500" : "text-gray-300";
    stars.push(
      <Star 
        key={i} 
        className={`h-4 w-4 ${starFill} inline-block`} 
        fill={i < Math.floor(rating) ? "currentColor" : "none"} 
      />
    );
  }
  return stars;
};

const TechnicianCard = ({ technician, isSelected, onSelect }: TechnicianCardProps) => {
  return (
    <Card 
      className={`cursor-pointer border-2 hover:shadow-md transition-all ${
        isSelected ? "border-red-500 ring-2 ring-red-100" : "border-gray-200"
      }`}
      onClick={() => onSelect(technician.id)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 border-2 border-gray-100">
              <AvatarImage src={technician.avatar} alt={technician.name} />
              <AvatarFallback className="bg-red-100 text-red-800 font-semibold">
                {technician.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {technician.name} 
                {technician.verified && <Shield className="h-4 w-4 text-blue-500" fill="currentColor" />}
              </CardTitle>
              <div className="flex items-center mt-1">
                {renderStars(technician.rating)}
                <span className="ml-1 text-sm font-medium">{technician.rating}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-red-600">{technician.currency}{technician.price}</div>
            <div className="text-xs text-gray-500">Base Charge</div>
          </div>
        </div>
        
        {technician.badges && technician.badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {technician.badges.map(badge => (
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
            <span>{technician.distance} away</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-500 mr-1" />
            <span>ETA: {technician.estimatedArrival}</span>
          </div>
          <div className="flex items-center col-span-2">
            <ThumbsUp className="h-4 w-4 text-gray-500 mr-1" />
            <span>{technician.completedJobs} jobs completed</span>
          </div>
        </div>
        
        <div className="mt-3">
          <CardDescription className="text-xs text-gray-500 mb-1">Specialties:</CardDescription>
          <div className="flex flex-wrap gap-1">
            {technician.specialties.map(specialty => (
              <Badge key={specialty} variant="outline" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant={isSelected ? "default" : "outline"} 
          className={`w-full ${isSelected ? "bg-red-600 hover:bg-red-700" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(technician.id);
          }}
        >
          {isSelected ? "Selected" : "Select"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TechnicianCard;
