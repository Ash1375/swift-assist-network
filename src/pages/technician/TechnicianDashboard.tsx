import React from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useTechnicianAuth } from "@/contexts/TechnicianAuthContext";
import { 
  Clock, 
  Settings, 
  MapPin, 
  Users, 
  Activity,
  Star
} from "lucide-react";
import TechnicianStats from "@/components/technician/dashboard/TechnicianStats";
import RevenueChart from "@/components/technician/dashboard/RevenueChart";

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
            <div className="grid gap-4 md:grid-cols-4">
              <RevenueChart data={mockRevenueData} />
              
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                  <CardDescription>Your latest customer feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
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
                    ].map((review, index) => (
                      <div key={index} className="border-b pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{review.name}</div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm">{review.comment}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Service Requests</CardTitle>
                <CardDescription>
                  View and respond to customer service requests
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No pending requests</h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    There are no service requests available at this moment. New requests will appear here when customers need assistance.
                  </p>
                  <Button variant="outline">Refresh</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle>Service Area</CardTitle>
                <CardDescription>
                  View and manage your service coverage area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] rounded-md border flex items-center justify-center bg-muted">
                  <div className="text-center p-6">
                    <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Map view unavailable</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      This feature will be available soon. You'll be able to set your service area and view requests on a map.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Customer History</CardTitle>
                <CardDescription>
                  View details of customers you've assisted
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No customer history</h3>
                  <p className="text-muted-foreground max-w-md">
                    Once you complete service requests, your customer history will appear here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>
                  Track your performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Activity className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No data available</h3>
                  <p className="text-muted-foreground max-w-md">
                    Analytics will be available after you complete some service requests.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your technician profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Profile Information</h3>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <p className="text-sm font-medium">Name:</p>
                      <p className="col-span-2 text-sm">{technician.name}</p>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <p className="text-sm font-medium">Email:</p>
                      <p className="col-span-2 text-sm">{technician.email}</p>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <p className="text-sm font-medium">Phone:</p>
                      <p className="col-span-2 text-sm">{technician.phone}</p>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <p className="text-sm font-medium">Experience:</p>
                      <p className="col-span-2 text-sm">{technician.experience} years</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Service Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {technician.specialties.map((specialty) => (
                      <div key={specialty} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        {specialty}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button>Edit Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
