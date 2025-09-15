
import { Button } from "./ui/button";
import { ArrowRight, PhoneCall, MapPin, Wrench, Anchor, Battery, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="mobile-hero-compact relative overflow-hidden">
      <div className="container px-4 py-8 flex flex-col items-center relative z-10">
        {/* Animated background elements */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse opacity-40"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse opacity-40" style={{animationDelay: '2s'}}></div>
        
        {/* 24/7 Badge */}
        <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-xl px-3 py-2 rounded-full mb-4 animate-fade-in border border-white/20">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <PhoneCall className="h-4 w-4 text-green-300" />
          <span className="text-xs font-semibold">24/7 Emergency</span>
        </div>
        
        {/* Main Heading - Compact */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-center mb-4 drop-shadow-2xl px-4 tracking-tight leading-tight">
          <span className="block">Quick Roadside Help</span>
          <span className="block mt-1 bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent text-xl sm:text-2xl">
            Available 24/7
          </span>
        </h1>
        
        {/* Subtitle - Compact */}
        <p className="text-sm md:text-base max-w-2xl text-center mb-6 text-white/90 px-4 leading-relaxed">
          Fast, reliable assistance when you need it most.
        </p>
        
        {/* Main CTA - Prominent */}
        <div className="flex flex-col gap-3 w-full max-w-sm mx-auto px-4 mb-6">
          <Button 
            size="xl" 
            className="bg-white text-primary hover:bg-white/95 hover:scale-105 shadow-2xl group w-full rounded-2xl transition-all duration-300 font-bold h-14" 
            asChild
          >
            <Link to="/emergency">
              <PhoneCall className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Emergency Call Now
            </Link>
          </Button>
        </div>

        {/* Quick Service Grid - Mobile Optimized */}
        <div className="w-full max-w-5xl mx-auto px-4">
          <p className="text-center text-white/80 mb-4 text-sm font-medium">Quick Access:</p>
          <div className="mobile-service-grid gap-2 md:gap-4">
            <Link to="/request-service/towing" className="group">
              <div className="mobile-glass-card p-3 md:p-6 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <Anchor className="h-5 w-5 md:h-8 md:w-8 text-yellow-300 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-white text-xs md:text-base font-semibold block">Towing</span>
                <span className="text-white/70 text-xs hidden md:block">Popular</span>
              </div>
            </Link>
            <Link to="/request-service/flat-tire" className="group">
              <div className="mobile-glass-card p-3 md:p-6 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <Wrench className="h-5 w-5 md:h-8 md:w-8 text-blue-300 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-white text-xs md:text-base font-semibold block">Tire Fix</span>
                <span className="text-white/70 text-xs hidden md:block">Fast</span>
              </div>
            </Link>
            <Link to="/request-service/battery" className="group">
              <div className="mobile-glass-card p-3 md:p-6 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <Battery className="h-5 w-5 md:h-8 md:w-8 text-green-300 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-white text-xs md:text-base font-semibold block">Battery</span>
                <span className="text-white/70 text-xs hidden md:block">Quick</span>
              </div>
            </Link>
            <Link to="#services" className="group">
              <div className="mobile-glass-card p-3 md:p-6 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <ArrowRight className="h-5 w-5 md:h-8 md:w-8 text-purple-300 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-white text-xs md:text-base font-semibold block">All Services</span>
                <span className="text-white/70 text-xs hidden md:block">View</span>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Marketplace CTA - Compact */}
        <div className="mt-6 w-full max-w-lg mx-auto px-4">
          <div className="mobile-glass-card p-4 text-center">
            <h3 className="text-lg font-bold mb-2">
              Auto Parts Store
            </h3>
            <p className="text-white/80 mb-4 text-sm">
              Premium parts at great prices
            </p>
            <Button 
              variant="outline" 
              size="default"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:scale-105 transition-all duration-300 text-sm" 
              asChild
            >
              <Link to="/marketplace">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Shop Now
              </Link>
            </Button>
          </div>
        </div>

        {/* Trust Indicators - Compact */}
        <div className="mt-6 flex items-center gap-4 justify-center flex-wrap px-4">
          <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-xl px-3 py-2 rounded-xl border border-white/20">
            <MapPin className="h-4 w-4 text-green-300" />
            <span className="text-xs font-semibold">Fast Response</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-xl px-3 py-2 rounded-xl border border-white/20">
            <Wrench className="h-4 w-4 text-blue-300" />
            <span className="text-xs font-semibold">Expert Help</span>
          </div>
        </div>
      </div>
      
      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-background clip-path-hero"></div>
    </section>
  );
};

export default Hero;
