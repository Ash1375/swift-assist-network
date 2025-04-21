
import { useState, useEffect } from "react";
import { Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const LoadingAnimation = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide loading animation after content has loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500",
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="relative">
        <div className="w-32 h-32 flex items-center justify-center">
          <Wrench 
            className="h-16 w-16 text-red-600 animate-spin" 
            strokeWidth={1.5}
          />
        </div>
        <h1 className="text-3xl font-bold text-center mt-4 text-red-600">TowBuddy</h1>
        <p className="text-center text-gray-600 mt-2">Your Roadside Assistance Partner</p>
      </div>
    </div>
  );
};

export default LoadingAnimation;
