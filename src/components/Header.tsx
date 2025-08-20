
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { PhoneCall, Menu, X } from "lucide-react";
import UserMenu from "./UserMenu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100" 
          : "bg-white border-b border-gray-200"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-700">Towbuddy</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`font-medium transition-colors ${
              isActive('/') 
                ? "text-primary" 
                : "text-gray-700 hover:text-primary"
            }`}
          >
            Home
          </Link>
          <Link 
            to="/services" 
            className={`font-medium transition-colors ${
              isActive('/services') 
                ? "text-primary" 
                : "text-gray-700 hover:text-primary"
            }`}
          >
            Services
          </Link>
          <Link 
            to="/about" 
            className={`font-medium transition-colors ${
              isActive('/about') 
                ? "text-primary" 
                : "text-gray-700 hover:text-primary"
            }`}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className={`font-medium transition-colors ${
              isActive('/contact') 
                ? "text-primary" 
                : "text-gray-700 hover:text-primary"
            }`}
          >
            Contact
          </Link>
          <Link 
            to="/subscription" 
            className={`font-medium transition-colors ${
              isActive('/subscription') 
                ? "text-primary" 
                : "text-gray-700 hover:text-primary"
            }`}
          >
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button className="bg-gradient-to-r from-primary to-blue-700 hover:from-blue-700 hover:to-blue-800 hidden md:flex animate-pulse-blue" asChild>
            <Link to="/request-service/emergency">
              <PhoneCall className="mr-2 h-4 w-4" />
              Emergency Call
            </Link>
          </Button>
          
          <div className="hidden md:block">
            <UserMenu />
          </div>
          
          <button className="md:hidden text-gray-700" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg animate-fade-in">
          <div className="container py-4 flex flex-col gap-4">
            <Link 
              to="/" 
              className={`font-medium py-3 text-base transition-colors ${
                isActive('/') 
                  ? "text-primary" 
                  : "text-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className={`font-medium py-3 text-base transition-colors ${
                isActive('/services') 
                  ? "text-primary" 
                  : "text-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className={`font-medium py-3 text-base transition-colors ${
                isActive('/about') 
                  ? "text-primary" 
                  : "text-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`font-medium py-3 text-base transition-colors ${
                isActive('/contact') 
                  ? "text-primary" 
                  : "text-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              to="/subscription" 
              className={`font-medium py-3 text-base transition-colors ${
                isActive('/subscription') 
                  ? "text-primary" 
                  : "text-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            
            <div className="py-2">
              <UserMenu />
            </div>
            
            <Button className="bg-gradient-to-r from-primary to-blue-700 hover:from-blue-700 hover:to-blue-800 w-full mt-4 py-3 text-base" asChild>
              <Link 
                to="/request-service/emergency"
                onClick={() => setMobileMenuOpen(false)}
              >
                <PhoneCall className="mr-2 h-4 w-4" />
                Emergency Call
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
