
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { PhoneCall } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-red-600">SwiftAssist</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-red-600 transition-colors">
            Home
          </Link>
          <Link to="/services" className="text-gray-700 hover:text-red-600 transition-colors">
            Services
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-red-600 transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-red-600 transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button className="bg-red-600 hover:bg-red-700">
            <PhoneCall className="mr-2 h-4 w-4" />
            Emergency Call
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
