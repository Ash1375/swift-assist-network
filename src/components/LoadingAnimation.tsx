
import { useState, useEffect } from "react";
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
      <div className="relative flex flex-col items-center">
        {/* Tow truck burnout animation */}
        <div className="w-36 h-24 md:w-48 md:h-28 relative flex items-end justify-center">
          <svg
            viewBox="0 0 220 80"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Truck body */}
            <rect x="45" y="30" width="110" height="30" rx="8" className="fill-red-600" />
            {/* Cabin */}
            <rect x="130" y="18" width="38" height="28" rx="6" className="fill-yellow-300 stroke-gray-400" strokeWidth="2"/>
            {/* Windows */}
            <rect x="140" y="22" width="14" height="14" rx="2" className="fill-sky-100"/>
            {/* Tire 1 (rear, burning out) */}
            <g>
              <circle cx="62" cy="63" r="15" className="fill-gray-800 animate-burnout-tire" />
              <circle cx="62" cy="63" r="8" className="fill-gray-400 opacity-60" />
              {/* Smoke group */}
              <g className="animate-burnout-smoke">
                <ellipse cx="44" cy="63" rx="8" ry="4" fill="#d1d5db" opacity="0.5" />
                <ellipse cx="35" cy="60" rx="8" ry="6" fill="#e5e7eb" opacity="0.28" />
                <ellipse cx="54" cy="65" rx="7" ry="3.5" fill="#f3f4f6" opacity="0.24" />
                <ellipse cx="28" cy="62" rx="6" ry="3" fill="#e5e7eb" opacity="0.16" />
              </g>
            </g>
            {/* Tire 2 (front) */}
            <g>
              <circle cx="145" cy="63" r="11" className="fill-gray-800" />
              <circle cx="145" cy="63" r="5" className="fill-gray-500 opacity-50" />
            </g>
            {/* Hook/arm */}
            <rect x="50" y="22" width="7" height="18" rx="2" className="fill-gray-400" />
            <rect x="44" y="18" width="25" height="6" rx="2.5" transform="rotate(-22 44 18)" className="fill-gray-400" />
            {/* Small lights */}
            <circle cx="168" cy="32" r="3" className="fill-red-500" />
            <circle cx="173" cy="32" r="2" className="fill-yellow-400" />
            {/* Wheel burnout lines */}
            <g>
              <rect x="40" y="69" width="3" height="18" rx="1.5" fill="#e2e8f0" className="opacity-50 animate-burnout-lines" />
              <rect x="50" y="70" width="3" height="13" rx="1.5" fill="#f3f4f6" className="opacity-60 animate-burnout-lines" />
            </g>
          </svg>
        </div>
        <style>
          {`
            @keyframes burnout-tire {
              0% { transform: rotate(0deg);}
              100% { transform: rotate(360deg);}
            }
            .animate-burnout-tire {
              transform-box: fill-box;
              transform-origin: 62px 63px;
              animation: burnout-tire 0.7s linear infinite;
            }
            @keyframes burnout-smoke {
              0% { opacity: 0.17; transform: translateX(0) scale(1);}
              10% { opacity: 0.26; }
              35% { opacity: 0.65; transform: translateX(-8px) scale(1.12);}
              65% { opacity: 0.19; transform: translateX(-18px) scale(1.22);}
              100% { opacity: 0.01; transform: translateX(-33px) scale(1.4);}
            }
            .animate-burnout-smoke {
              animation: burnout-smoke 1.7s ease-in-out infinite;
              will-change: opacity, transform;
            }
            @keyframes burnout-lines {
              0% { opacity: 0.12; }
              18% { opacity: 0.42; }
              36% { opacity: 0.7;}
              80% { opacity: 0; }
              100% { opacity: 0;}
            }
            .animate-burnout-lines {
              animation: burnout-lines 0.8s linear infinite;
              will-change: opacity;
            }
          `}
        </style>
        <h1 className="text-3xl font-bold text-center mt-4 text-red-600">TowBuddy</h1>
        <p className="text-center text-gray-600 mt-2">Your Roadside Assistance Partner</p>
      </div>
    </div>
  );
};

export default LoadingAnimation;
