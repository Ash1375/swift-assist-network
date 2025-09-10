
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TechnicianAuthProvider } from "@/contexts/TechnicianAuthContext";
import { AdminAuthProvider, AdminProtectedRoute } from "@/contexts/AdminAuthContext";
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

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboardLayout from "./components/admin/AdminDashboardLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ApproveTechnician from "./pages/admin/ApproveTechnician";
import RejectTechnician from "./pages/admin/RejectTechnician";
import TechnicianManagement from "./pages/admin/TechnicianManagement";
import TechnicianDetails from "./pages/admin/TechnicianDetails";
import TechnicianApplications from "./pages/admin/TechnicianApplications";

// Marketplace pages
import Marketplace from "./pages/Marketplace";
import ProductDetail from "./pages/ProductDetail";
import ServiceCommunicationPage from "./pages/ServiceCommunicationPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AdminAuthProvider>
        <AuthProvider>
          <TechnicianAuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
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
                        <Route path="marketplace" element={<Marketplace />} />
                        <Route path="marketplace/product/:id" element={<ProductDetail />} />
                        <Route path="service-communication/:serviceId" element={<ServiceCommunicationPage />} />
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
                  <Route path="marketplace" element={<Marketplace />} />
                  <Route path="marketplace/product/:id" element={<ProductDetail />} />
                  <Route path="service-communication/:serviceId" element={<ServiceCommunicationPage />} />
                </Route>
                
                {/* Technician portal routes */}
                <Route path="/technician" element={<TechnicianLayout />}>
                  <Route path="login" element={<TechnicianLogin />} />
                  <Route path="register" element={<TechnicianRegister />} />
                  <Route path="verification" element={<TechnicianVerification />} />
                  <Route path="dashboard" element={<TechnicianDashboard />} />
                </Route>
                
                {/* Admin login route */}
                <Route path="/admin/login" element={<AdminLogin />} />
                
                {/* Admin routes with AdminDashboardLayout - protected by AdminProtectedRoute */}
                <Route path="/admin" element={
                  <AdminProtectedRoute>
                    <AdminDashboardLayout />
                  </AdminProtectedRoute>
                }>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="technicians" element={<TechnicianManagement />} />
                  <Route path="applications" element={<TechnicianApplications />} />
                  <Route path="technician/:technicianId" element={<TechnicianDetails />} />
                </Route>
                
                {/* Admin routes without layout (for approval/rejection processes) */}
                <Route path="/admin/approve-technician/:technicianId" element={
                  <AdminProtectedRoute>
                    <ApproveTechnician />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/reject-technician/:technicianId" element={
                  <AdminProtectedRoute>
                    <RejectTechnician />
                  </AdminProtectedRoute>
                } />
                
                {/* 404 page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </TechnicianAuthProvider>
        </AuthProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
