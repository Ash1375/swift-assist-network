
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TechnicianAuthProvider } from "@/contexts/TechnicianAuthContext";
import Index from "./pages/Index";
import ServicesPage from "./pages/ServicesPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Subscription from "./pages/Subscription";
import ServiceRequest from "./components/ServiceRequest";
import RequestTracking from "./components/RequestTracking";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Chatbot from "@/components/Chatbot";
import LoadingAnimation from "@/components/LoadingAnimation";
import Emergency from "./pages/Emergency";
import Settings from "./pages/Settings";

// Technician pages
import TechnicianLayout from "./components/technician/TechnicianLayout";
import TechnicianLogin from "./pages/technician/TechnicianLogin";
import TechnicianRegister from "./pages/technician/TechnicianRegister";
import TechnicianVerification from "./pages/technician/TechnicianVerification";
import TechnicianDashboard from "./pages/technician/TechnicianDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TechnicianAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <LoadingAnimation />
            <Routes>
              {/* Main app routes */}
              <Route path="/" element={
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow">
                    <Index />
                  </main>
                  <Footer />
                  <Chatbot />
                </div>
              } />
              
              {/* Standard routes with Header/Footer */}
              <Route path="/" element={
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/services" element={<ServicesPage />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/subscription" element={<Subscription />} />
                      <Route path="/emergency" element={<Emergency />} />
                      <Route path="/request-service/:serviceId" element={<ServiceRequest />} />
                      <Route path="/request-tracking/:requestId" element={<RequestTracking />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </main>
                  <Footer />
                  <Chatbot />
                </div>
              }>
                <Route path="services" element={<ServicesPage />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="subscription" element={<Subscription />} />
                <Route path="emergency" element={<Emergency />} />
                <Route path="request-service/:serviceId" element={<ServiceRequest />} />
                <Route path="request-tracking/:requestId" element={<RequestTracking />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              
              {/* Technician portal routes */}
              <Route path="/technician" element={<TechnicianLayout />}>
                <Route path="login" element={<TechnicianLogin />} />
                <Route path="register" element={<TechnicianRegister />} />
                <Route path="verification" element={<TechnicianVerification />} />
                <Route path="dashboard" element={<TechnicianDashboard />} />
              </Route>
              
              {/* 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TechnicianAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
