import { PhoneCall, Wrench, Anchor, Battery, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const MobileQuickActions = () => {
  return (
    <>
      {/* Floating Emergency Button */}
      <Link to="/emergency" className="mobile-fab animate-bounce-in">
        <PhoneCall className="h-6 w-6" />
      </Link>

      {/* Bottom Navigation for Mobile */}
      <div className="mobile-bottom-nav lg:hidden">
        <div className="flex items-center justify-around py-2 px-4">
          <Link
            to="/request-service/towing"
            className="mobile-nav-item text-gray-600 hover:text-primary transition-colors"
          >
            <Anchor className="h-5 w-5 mb-1" />
            <span>Towing</span>
          </Link>
          
          <Link
            to="/request-service/flat-tire"
            className="mobile-nav-item text-gray-600 hover:text-primary transition-colors"
          >
            <Wrench className="h-5 w-5 mb-1" />
            <span>Tire Fix</span>
          </Link>
          
          <Link
            to="/request-service/battery"
            className="mobile-nav-item text-gray-600 hover:text-primary transition-colors"
          >
            <Battery className="h-5 w-5 mb-1" />
            <span>Battery</span>
          </Link>
          
          <Link
            to="/marketplace"
            className="mobile-nav-item text-gray-600 hover:text-primary transition-colors"
          >
            <MapPin className="h-5 w-5 mb-1" />
            <span>Shop</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default MobileQuickActions;