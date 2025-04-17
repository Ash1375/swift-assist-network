
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { PhoneCall, Menu, X } from "lucide-react";

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
          <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700">SwiftAssist</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`font-medium transition-colors ${
              isActive('/') 
                ? "text-red-600" 
                : "text-gray-700 hover:text-red-600"
            }`}
          >
            Home
          </Link>
          <Link 
            to="/services" 
            className={`font-medium transition-colors ${
              isActive('/services') 
                ? "text-red-600" 
                : "text-gray-700 hover:text-red-600"
            }`}
          >
            Services
          </Link>
          <Link 
            to="/about" 
            className={`font-medium transition-colors ${
              isActive('/about') 
                ? "text-red-600" 
                : "text-gray-700 hover:text-red-600"
            }`}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className={`font-medium transition-colors ${
              isActive('/contact') 
                ? "text-red-600" 
                : "text-gray-700 hover:text-red-600"
            }`}
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hidden md:flex animate-pulse-red" asChild>
            <Link to="/request-service/emergency">
              <PhoneCall className="mr-2 h-4 w-4" />
              Emergency Call
            </Link>
          </Button>
          
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
              className={`font-medium py-2 transition-colors ${
                isActive('/') 
                  ? "text-red-600" 
                  : "text-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className={`font-medium py-2 transition-colors ${
                isActive('/services') 
                  ? "text-red-600" 
                  : "text-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className={`font-medium py-2 transition-colors ${
                isActive('/about') 
                  ? "text-red-600" 
                  : "text-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`font-medium py-2 transition-colors ${
                isActive('/contact') 
                  ? "text-red-600" 
                  : "text-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            
            <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 w-full mt-2" asChild>
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
