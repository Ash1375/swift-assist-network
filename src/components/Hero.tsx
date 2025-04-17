
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-red-600 to-red-700 text-white">
      <div className="container px-4 py-20 md:py-32 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
          Roadside Assistance When You Need It Most
        </h1>
        <p className="text-xl md:text-2xl max-w-3xl text-center mb-10">
          Fast, reliable roadside assistance and puncture repair services available 24/7. 
          We're just a click away.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-6 text-lg" size="lg" asChild>
            <Link to="/services">
              View Services <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg" size="lg" asChild>
            <Link to="/contact">
              Contact Us
            </Link>
          </Button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white clip-path-hero"></div>
    </section>
  );
};

export default Hero;
