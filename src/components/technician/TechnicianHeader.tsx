
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Menu, User, Settings } from "lucide-react";
import { useTechnicianAuth } from "@/contexts/TechnicianAuthContext";

const TechnicianHeader = () => {
  const { technician, isAuthenticated, logout } = useTechnicianAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate("/technician/login");
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: "/technician/dashboard", label: "Dashboard" },
    { path: "/technician/profile", label: "Profile" },
    { path: "/technician/help", label: "Help" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/technician/dashboard" className="flex items-center">
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
              Towbuddy Technician
            </span>
          </Link>
          
          <nav className="ml-10 hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-muted">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {technician ? getInitials(technician.name) : "?"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{technician?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {technician?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/technician/profile" className="cursor-pointer flex w-full items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/technician/settings" className="cursor-pointer flex w-full items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu size={24} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link to="/technician/login">Log in</Link>
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link to="/technician/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b shadow-lg animate-fade-in">
          <div className="container py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium py-2 transition-colors ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button 
              variant="ghost" 
              className="flex justify-start pl-0" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default TechnicianHeader;
