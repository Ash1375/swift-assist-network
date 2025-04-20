import { useState } from "react";
import { Button } from "./ui/button";
import TechnicianCard from "./technician/TechnicianCard";
import SortControls from "./technician/SortControls";
import { Technician } from "./technician/types";

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

  return (
    <div className="w-full space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-4">
        <h3 className="text-2xl font-bold text-center sm:text-left">Available Technicians Near You</h3>
        <p className="text-gray-600 text-center sm:text-left">
          Select a technician for your {serviceType} service
        </p>
        
        <SortControls sortBy={sortBy} onSortChange={setSortBy} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedTechnicians.map((tech) => (
          <TechnicianCard
            key={tech.id}
            technician={tech}
            isSelected={selectedTechnician === tech.id}
            onSelect={handleTechnicianClick}
          />
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
