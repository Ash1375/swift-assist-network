
import { Button } from "./ui/button";
import { ArrowRight, PhoneCall, MapPin, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative hero-bg text-white overflow-hidden">
      <div className="container px-4 py-20 md:py-32 flex flex-col items-center relative z-10">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-red-500/20 rounded-full blur-3xl"></div>
        
        <div className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8 animate-float">
          <PhoneCall className="h-4 w-4 text-yellow-300" />
          <span className="text-sm font-medium">24/7 Emergency Service Available</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-6 drop-shadow-md">
          <span className="block">Roadside Assistance</span>
          <span className="block mt-2 text-yellow-300">When You Need It Most</span>
        </h1>
        
        <p className="text-xl md:text-2xl max-w-3xl text-center mb-10 text-white/90">
          Fast, reliable roadside assistance and puncture repair services available 24/7. 
          We're just a click away.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-6 text-lg btn-glow group" size="lg" asChild>
            <Link to="/services">
              View Services <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button className="bg-red-700 border-2 border-white text-white hover:bg-red-800 px-8 py-6 text-lg animate-pulse-red" size="lg" asChild>
            <Link to="/request-service/emergency">
              <PhoneCall className="mr-2 h-5 w-5" />
              Emergency Call
            </Link>
          </Button>
        </div>
        
        <div className="mt-12 flex items-center gap-6 justify-center flex-wrap">
          <div className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <MapPin className="h-4 w-4 text-yellow-300" />
            <span className="text-sm">Fast response times</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <Wrench className="h-4 w-4 text-yellow-300" />
            <span className="text-sm">Expert technicians</span>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-white clip-path-hero"></div>
      
      <div className="absolute top-1/2 left-10 w-20 h-20 bg-red-300/20 rounded-full blur-md animate-float"></div>
      <div className="absolute top-1/3 right-10 w-16 h-16 bg-yellow-300/20 rounded-full blur-md animate-float" style={{animationDelay: '1s'}}></div>
    </section>
  );
};

export default Hero;
