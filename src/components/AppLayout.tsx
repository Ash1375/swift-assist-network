import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import MobileQuickActions from "./MobileQuickActions";
import MobileAppHeader from "./MobileAppHeader";
import Chatbot from "./Chatbot";
import { useIsMobile } from "@/hooks/use-mobile";

const AppLayout = () => {
  const isMobile = useIsMobile();

  return (
    <div className={`flex flex-col min-h-screen ${isMobile ? 'mobile-app-layout' : ''}`}>
      {/* Conditional header for mobile vs desktop */}
      {isMobile ? <MobileAppHeader /> : <Header />}
      
      {/* Main content with app-like styling on mobile */}
      <main className={`flex-grow ${isMobile ? 'mobile-main' : ''}`}>
        <Outlet />
      </main>
      
      {/* Footer - hidden on mobile for app-like experience */}
      <div className={isMobile ? 'hidden' : 'block'}>
        <Footer />
      </div>
      
      {/* Mobile-specific features */}
      {isMobile && <MobileQuickActions />}
      
      {/* Chatbot - positioned differently on mobile */}
      <div className={isMobile ? 'mobile-chatbot' : ''}>
        <Chatbot />
      </div>
    </div>
  );
};

export default AppLayout;