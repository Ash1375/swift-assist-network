import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import TechnicianCard from "./technician/TechnicianCard";
import SortControls from "./technician/SortControls";
import { Technician } from "./technician/types";
import defaultAvatar from "@/assets/default-avatar.png";
import { supabase } from "@/integrations/supabase/client";
import LoadingAnimation from "./LoadingAnimation";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle, Sparkles, Loader2 } from "lucide-react";
import { Card } from "./ui/card";

interface TechnicianSelectionProps {
  serviceType: string;
  onSelect: (technicianId: string) => void;
  vehicleType?: string;
  location?: string;
}

const TechnicianSelection = ({ serviceType, onSelect, vehicleType, location }: TechnicianSelectionProps) => {
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"price" | "rating" | "arrival">("arrival");
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiRecommendation, setAiRecommendation] = useState<string>("");
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    fetchTechnicians();
  }, [serviceType]);

  useEffect(() => {
    if (technicians.length > 0 && !aiRecommendation) {
      fetchAIRecommendation();
    }
  }, [technicians]);

  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('technicians')
        .select('*')
        .eq('verification_status', 'verified');

      if (fetchError) throw fetchError;

      // Transform Supabase data to match Technician interface
      const transformedTechnicians: Technician[] = data?.map((tech) => {
        // Get service price from pricing JSON
        const serviceKey = serviceType.toLowerCase().replace(' ', '-');
        const pricing = tech.pricing as any;
        const basePrice = pricing?.[serviceKey] || pricing?.['towing'] || 500;
        
        return {
          id: tech.id,
          name: tech.name,
          avatar: defaultAvatar,
          rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
          price: basePrice,
          currency: "₹",
          distance: calculateDistance(),
          estimatedArrival: calculateETA(),
          completedJobs: tech.experience * 50, // Estimate based on experience
          specialties: tech.specialties || [],
          verified: tech.verification_status === 'verified',
          badges: getBadges(tech)
        };
      }) || [];

      setTechnicians(transformedTechnicians);
    } catch (err) {
      console.error('Error fetching technicians:', err);
      setError('Failed to load available technicians. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAIRecommendation = async () => {
    if (!vehicleType || !location) return;
    
    setLoadingAI(true);
    try {
      const { data, error } = await supabase.functions.invoke('match-technician', {
        body: {
          serviceType,
          vehicleType,
          location,
          technicians: technicians.map(t => ({
            name: t.name,
            rating: t.rating,
            completedJobs: t.completedJobs,
            distance: t.distance,
            estimatedArrival: t.estimatedArrival,
            price: t.price,
            specialties: t.specialties
          }))
        }
      });

      if (error) throw error;
      setAiRecommendation(data.recommendation);
    } catch (err) {
      console.error('Error getting AI recommendation:', err);
    } finally {
      setLoadingAI(false);
    }
  };

  // Helper functions
  const calculateDistance = (): string => {
    // In a real app, calculate distance using user's location and technician's location
    // For now, return a random distance between 1-15 km
    const randomDistance = (Math.random() * 14 + 1).toFixed(1);
    return `${randomDistance} km`;
  };

  const calculateETA = (): string => {
    // In a real app, use Google Maps API or similar for accurate ETA
    // For now, estimate based on distance
    const distance = parseFloat(calculateDistance());
    const timeMin = Math.round(distance * 2 + Math.random() * 10);
    const timeMax = timeMin + 10;
    return `${timeMin}-${timeMax} min`;
  };

  const getBadges = (tech: any): string[] => {
    const badges = [];
    if (tech.experience >= 10) badges.push("Expert");
    if (tech.experience >= 5) badges.push("Experienced");
    if (tech.specialties?.length > 3) badges.push("Versatile");
    return badges;
  };

  const sortedTechnicians = [...technicians].sort((a, b) => {
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

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12 space-y-4">
        <LoadingAnimation />
        <p className="text-gray-600">Finding available technicians near you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchTechnicians}
            className="ml-2"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (technicians.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No technicians are currently available in your area. Please try again later or contact support.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-4">
        <h3 className="text-2xl font-bold text-center sm:text-left">Available Technicians Near You</h3>
        <p className="text-gray-600 text-center sm:text-left">
          Select a technician for your {serviceType} service
        </p>
        
        {aiRecommendation && (
          <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  AI-Powered Recommendations
                  {loadingAI && <Loader2 className="h-4 w-4 animate-spin" />}
                </h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{aiRecommendation}</p>
              </div>
            </div>
          </Card>
        )}
        
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
