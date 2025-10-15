import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { PhoneCall, Menu, X, User, Settings, MapPin } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MobileAppHeader = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (!isMobile) return null;

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-lg border-b border-border">
      <div className="flex h-14 items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <span className="text-lg font-bold text-primary">Towbuddy</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-primary to-primary/80 text-xs px-3 h-8" 
            asChild
          >
            <Link to="/request-service/emergency">
              <PhoneCall className="mr-1 h-3 w-3" />
              SOS
            </Link>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/map" className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  Interactive Map
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/services" className="flex items-center">
                  Services
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/technician/login" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Technician Portal
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/marketplace" className="flex items-center">
                  Marketplace
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default MobileAppHeader;