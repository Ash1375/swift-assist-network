
import React from "react";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTechnicianAuth } from "@/contexts/TechnicianAuthContext";
import { Activity, Clock, MapPin, Users, Settings } from "lucide-react";
import TechnicianStats from "@/components/technician/dashboard/TechnicianStats";
import OverviewTab from "@/components/technician/dashboard/OverviewTab";
import ServiceRequestsTab from "@/components/technician/dashboard/ServiceRequestsTab";
import ServiceAreaTab from "@/components/technician/dashboard/ServiceAreaTab";
import CustomersTab from "@/components/technician/dashboard/CustomersTab";
import AccountTab from "@/components/technician/dashboard/AccountTab";

const TechnicianDashboard = () => {
  const { technician, isAuthenticated } = useTechnicianAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/technician/login" replace />;
  }
  
  if (technician?.verification_status !== "verified") {
    return <Navigate to="/technician/verification" replace />;
  }

  // Mock data for demonstration
  const mockStats = {
    activeRequests: 2,
    completedJobs: 150,
    totalEarnings: 15000,
    rating: 4.8
  };

  const mockRevenueData = [
    { date: "Jan", amount: 1000 },
    { date: "Feb", amount: 1500 },
    { date: "Mar", amount: 1200 },
    { date: "Apr", amount: 1800 },
    { date: "May", amount: 2000 },
    { date: "Jun", amount: 2400 }
  ];

  const mockReviews = [
    {
      name: "John D.",
      rating: 5,
      comment: "Excellent service! Very professional and quick.",
      date: "2024-04-20"
    },
    {
      name: "Sarah M.",
      rating: 4,
      comment: "Great work, helped me out of a tough situation.",
      date: "2024-04-18"
    }
  ];

  return (
    <div className="container py-6 md:py-12">
      <div className="flex flex-col space-y-6">
        <div className="px-4 md:px-0">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Technician Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {technician.name}!</p>
        </div>
        
        <div className="px-4 md:px-0">
          <TechnicianStats stats={mockStats} />
        </div>
        
        <div className="px-4 md:px-0">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-1 md:gap-0">
              <TabsTrigger value="overview" className="gap-1 md:gap-2 text-xs md:text-sm">
                <Activity size={14} className="md:w-4 md:h-4" />
                <span className="hidden sm:inline">Overview</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
              <TabsTrigger value="requests" className="gap-1 md:gap-2 text-xs md:text-sm">
                <Clock size={14} className="md:w-4 md:h-4" />
                <span className="hidden sm:inline">Requests</span>
                <span className="sm:hidden">Jobs</span>
              </TabsTrigger>
              <TabsTrigger value="map" className="gap-1 md:gap-2 text-xs md:text-sm">
                <MapPin size={14} className="md:w-4 md:h-4" />
                <span className="hidden sm:inline">Service Area</span>
                <span className="sm:hidden">Area</span>
              </TabsTrigger>
              <TabsTrigger value="customers" className="gap-1 md:gap-2 text-xs md:text-sm">
                <Users size={14} className="md:w-4 md:h-4" />
                <span className="hidden sm:inline">Customers</span>
                <span className="sm:hidden">Users</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="gap-1 md:gap-2 text-xs md:text-sm">
                <Settings size={14} className="md:w-4 md:h-4" />
                <span className="hidden sm:inline">Account</span>
                <span className="sm:hidden">Settings</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <OverviewTab revenueData={mockRevenueData} reviews={mockReviews} />
            </TabsContent>
            
            <TabsContent value="requests">
              <ServiceRequestsTab />
            </TabsContent>
            
            <TabsContent value="map">
              <ServiceAreaTab />
            </TabsContent>
            
            <TabsContent value="customers">
              <CustomersTab />
            </TabsContent>
            
            <TabsContent value="account">
              <AccountTab technician={technician} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
