
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
  
  if (technician?.verificationStatus !== "verified") {
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
    <div className="container py-12">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Technician Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {technician.name}!</p>
        </div>
        
        <TechnicianStats stats={mockStats} />
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <Activity size={16} />
              Overview
            </TabsTrigger>
            <TabsTrigger value="requests" className="gap-2">
              <Clock size={16} />
              Service Requests
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2">
              <MapPin size={16} />
              Service Area
            </TabsTrigger>
            <TabsTrigger value="customers" className="gap-2">
              <Users size={16} />
              Customers
            </TabsTrigger>
            <TabsTrigger value="account" className="gap-2">
              <Settings size={16} />
              Account
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
  );
};

export default TechnicianDashboard;
