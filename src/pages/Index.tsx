
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import VehicleTypes from "@/components/VehicleTypes";
import Testimonials from "@/components/Testimonials";
import TechnicianCTA from "@/components/TechnicianCTA";
import Map from "@/components/Map";
import MobileQuickActions from "@/components/MobileQuickActions";

const Index = () => {
  return (
    <div className="mobile-compact">
      <Hero />
      <div className="mobile-section">
        <Services />
      </div>
      <div className="hidden md:block">
        <Map />
      </div>
      <div className="mobile-section">
        <HowItWorks />
      </div>
      <div className="mobile-section">
        <VehicleTypes />
      </div>
      <div className="mobile-section">
        <Testimonials />
      </div>
      <div className="mobile-section">
        <TechnicianCTA />
      </div>
      <MobileQuickActions />
    </div>
  );
};

export default Index;
