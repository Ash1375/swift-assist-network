
import { Button } from "./ui/button";
import { ArrowRight, PhoneCall, MapPin, Wrench, Anchor, Battery, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary via-accent to-primary text-white overflow-hidden">
      <div className="container px-4 py-16 md:py-20 lg:py-32 flex flex-col items-center relative z-10">
        {/* Animated background elements */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse opacity-40"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse opacity-40" style={{animationDelay: '2s'}}></div>
        
        {/* 24/7 Badge */}
        <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-xl px-4 md:px-6 py-3 md:py-4 rounded-full mb-6 md:mb-8 animate-fade-in border border-white/20">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <PhoneCall className="h-4 w-4 md:h-5 md:w-5 text-green-300" />
          <span className="text-xs md:text-sm font-semibold">24/7 Emergency Service</span>
        </div>
        
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-center mb-6 md:mb-8 drop-shadow-2xl px-4 tracking-tight leading-tight">
          <span className="block">Roadside Assistance</span>
          <span className="block mt-2 bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
            When You Need It Most
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl lg:text-2xl max-w-4xl text-center mb-8 md:mb-12 text-white/90 px-4 leading-relaxed font-medium">
          Fast, reliable roadside assistance available 24/7. 
          <span className="block mt-2 text-white/80">We're just a click away.</span>
        </p>
        
        {/* Main CTA */}
        <div className="flex flex-col gap-4 w-full max-w-md mx-auto px-4 mb-8 md:mb-12">
          <Button 
            size="xl" 
            className="bg-white text-primary hover:bg-white/95 hover:scale-105 shadow-2xl group w-full rounded-2xl transition-all duration-300 font-bold text-lg h-16 md:h-14" 
            asChild
          >
            <Link to="/emergency">
              <PhoneCall className="mr-3 h-6 w-6 group-hover:animate-pulse" />
              Emergency Call
            </Link>
          </Button>
        </div>

        {/* Quick Service Access - Enhanced */}
        <div className="w-full max-w-5xl mx-auto px-4">
          <p className="text-center text-white/80 mb-6 text-base md:text-lg font-medium">Quick service access:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Link to="/request-service/towing" className="group">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 md:p-6 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <Anchor className="h-6 w-6 md:h-8 md:w-8 text-yellow-300 mx-auto mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-white text-sm md:text-base font-semibold block">Towing</span>
                <span className="text-white/70 text-xs md:text-sm">Most Popular</span>
              </div>
            </Link>
            <Link to="/request-service/flat-tire" className="group">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 md:p-6 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <Wrench className="h-6 w-6 md:h-8 md:w-8 text-blue-300 mx-auto mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-white text-sm md:text-base font-semibold block">Tire Fix</span>
                <span className="text-white/70 text-xs md:text-sm">Fast Service</span>
              </div>
            </Link>
            <Link to="/request-service/battery" className="group">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 md:p-6 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <Battery className="h-6 w-6 md:h-8 md:w-8 text-green-300 mx-auto mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-white text-sm md:text-base font-semibold block">Battery</span>
                <span className="text-white/70 text-xs md:text-sm">Quick Fix</span>
              </div>
            </Link>
            <Link to="#services" className="group">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 md:p-6 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <ArrowRight className="h-6 w-6 md:h-8 md:w-8 text-purple-300 mx-auto mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-white text-sm md:text-base font-semibold block">All Services</span>
                <span className="text-white/70 text-xs md:text-sm">View All</span>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Marketplace CTA */}
        <div className="mt-8 md:mt-12 w-full max-w-2xl mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center">
            <h3 className="text-xl md:text-2xl font-bold mb-3">
              Auto Parts Marketplace
            </h3>
            <p className="text-white/80 mb-6 text-sm md:text-base">
              Premium tyres and automobile spares at wholesale & retail prices
            </p>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:scale-105 transition-all duration-300" 
              asChild
            >
              <Link to="/marketplace">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Shop Now
              </Link>
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 md:mt-16 flex items-center gap-4 md:gap-8 justify-center flex-wrap px-4">
          <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-xl px-4 md:px-6 py-3 md:py-4 rounded-2xl border border-white/20">
            <MapPin className="h-5 w-5 md:h-6 md:w-6 text-green-300" />
            <span className="text-sm md:text-base font-semibold">Fast Response</span>
          </div>
          <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-xl px-4 md:px-6 py-3 md:py-4 rounded-2xl border border-white/20">
            <Wrench className="h-5 w-5 md:h-6 md:w-6 text-blue-300" />
            <span className="text-sm md:text-base font-semibold">Expert Technicians</span>
          </div>
        </div>
      </div>
      
      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-background clip-path-hero"></div>
    </section>
  );
};

export default Hero;
