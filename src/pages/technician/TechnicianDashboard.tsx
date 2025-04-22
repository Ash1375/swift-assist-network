import React from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useTechnicianAuth } from "@/contexts/TechnicianAuthContext";
import { 
  BarChart, 
  Clock, 
  Settings, 
  Car, 
  MapPin, 
  Users, 
  Activity,
  CheckCircle,
  DollarSign,
  Star
} from "lucide-react";

const TechnicianDashboard = () => {
  const { technician, isAuthenticated } = useTechnicianAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/technician/login" replace />;
  }
  
  if (technician?.verificationStatus !== "verified") {
    return <Navigate to="/technician/verification" replace />;
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Technician Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {technician.name}!</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">No active requests</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">+0% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0.00</div>
              <p className="text-xs text-muted-foreground">+0% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">No ratings yet</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="requests" className="space-y-4">
          <TabsList>
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
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart size={16} />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="account" className="gap-2">
              <Settings size={16} />
              Account
            </TabsTrigger>
          </TabsList>
          
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
