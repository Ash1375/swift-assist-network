import { PhoneCall, Wrench, Anchor, Cog, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const MobileQuickActions = () => {
  return (
    <>
      {/* Chat Button - Positioned above bottom nav */}
      <div className="fixed bottom-20 right-4 z-50">
        <button className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-2xl w-12 h-12 flex items-center justify-center hover:scale-110 transition-all duration-300 lg:hidden">
          <MessageCircle className="h-5 w-5" />
        </button>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 lg:hidden">
        <div className="flex items-center justify-around py-3 px-4 safe-area-pb">
          <Link
            to="/request-service/towing"
            className="flex flex-col items-center justify-center py-2 px-3 text-gray-600 hover:text-primary transition-colors rounded-xl hover:bg-gray-50 active:scale-95"
          >
            <Anchor className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Towing</span>
          </Link>
          
          <Link
            to="/request-service/flat-tire"
            className="flex flex-col items-center justify-center py-2 px-3 text-gray-600 hover:text-primary transition-colors rounded-xl hover:bg-gray-50 active:scale-95"
          >
            <Wrench className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Tire Fix</span>
          </Link>
          
          <Link
            to="/request-service/mechanical"
            className="flex flex-col items-center justify-center py-2 px-3 text-gray-600 hover:text-primary transition-colors rounded-xl hover:bg-gray-50 active:scale-95"
          >
            <Cog className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Mechanical</span>
          </Link>
          
          <Link
            to="/services"
            className="flex flex-col items-center justify-center py-2 px-3 text-gray-600 hover:text-primary transition-colors rounded-xl hover:bg-gray-50 active:scale-95"
          >
            <Wrench className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Services</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default MobileQuickActions;