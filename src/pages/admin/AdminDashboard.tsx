
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Check, Clock, UserCheck, Users, X } from "lucide-react";
import { Technician } from "@/types/technician";
import { supabase } from "@/integrations/supabase/client";
import { mapTechnicianData } from "@/utils/technicianMappers";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalTechnicians: 0,
    verifiedTechnicians: 0,
    pendingApplications: 0,
    rejectedApplications: 0
  });
  
  const [recentApplications, setRecentApplications] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch statistics
        const { data: technicians, error } = await supabase
          .from('technicians')
          .select('id, verification_status');
        
        if (error) throw error;
        
        const totalCount = technicians ? technicians.length : 0;
        const verifiedCount = technicians ? technicians.filter(t => t.verification_status === 'verified').length : 0;
        const pendingCount = technicians ? technicians.filter(t => t.verification_status === 'pending').length : 0;
        const rejectedCount = technicians ? technicians.filter(t => t.verification_status === 'rejected').length : 0;
        
        setStats({
          totalTechnicians: totalCount,
          verifiedTechnicians: verifiedCount,
          pendingApplications: pendingCount,
          rejectedApplications: rejectedCount
        });
        
        // Fetch recent applications
        const { data: recentApps, error: recentError } = await supabase
          .from('technicians')
          .select('*')
          .eq('verification_status', 'pending')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (recentError) throw recentError;
        
        setRecentApplications(recentApps ? recentApps.map(mapTechnicianData) : []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="ml-2">Pending</Badge>;
      case 'verified':
        return <Badge variant="success" className="ml-2">Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="ml-2">Rejected</Badge>;
      default:
        return <Badge className="ml-2">Unknown</Badge>;
    }
  };

  return (
    <div className="container py-4 md:py-8 animate-fade-in">
      <div className="px-4 md:px-0">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Admin Dashboard</h1>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8 px-4 md:px-0">
        <Card className="hover:shadow-md transition-all border-l-4 border-l-primary">
          <CardContent className="p-3 md:p-6 flex flex-col">
            <div className="flex items-center justify-between">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Total</p>
              <Users className="h-4 w-4 md:h-5 md:w-5 text-primary opacity-70" />
            </div>
            <h3 className="text-xl md:text-3xl font-bold mt-1 md:mt-2">{stats.totalTechnicians}</h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">Technicians</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all border-l-4 border-l-green-500">
          <CardContent className="p-3 md:p-6 flex flex-col">
            <div className="flex items-center justify-between">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Verified</p>
              <UserCheck className="h-4 w-4 md:h-5 md:w-5 text-green-500 opacity-70" />
            </div>
            <h3 className="text-xl md:text-3xl font-bold mt-1 md:mt-2">{stats.verifiedTechnicians}</h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">Ready</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all border-l-4 border-l-amber-500">
          <CardContent className="p-3 md:p-6 flex flex-col">
            <div className="flex items-center justify-between">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Pending</p>
              <Clock className="h-4 w-4 md:h-5 md:w-5 text-amber-500 opacity-70" />
            </div>
            <h3 className="text-xl md:text-3xl font-bold mt-1 md:mt-2">{stats.pendingApplications}</h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">Review</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all border-l-4 border-l-red-500">
          <CardContent className="p-3 md:p-6 flex flex-col">
            <div className="flex items-center justify-between">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Rejected</p>
              <X className="h-4 w-4 md:h-5 md:w-5 text-red-500 opacity-70" />
            </div>
            <h3 className="text-xl md:text-3xl font-bold mt-1 md:mt-2">{stats.rejectedApplications}</h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">Failed</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 md:px-0">
        {/* Recent Applications */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Latest technician applications awaiting review</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading recent applications...</p>
            ) : recentApplications.length > 0 ? (
              <div className="space-y-6">
                {recentApplications.map((technician) => (
                  <div 
                    key={technician.id} 
                    className="flex items-start justify-between border-b border-border pb-4"
                  >
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium">{technician.name}</h3>
                        {getStatusBadge(technician.verification_status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{technician.email}</p>
                      <p className="text-sm text-muted-foreground">
                        {technician.specialties.join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <a 
                        href={`/admin/technician/${technician.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No pending applications</p>
            )}
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <a 
              href="/admin/technicians"
              className="block p-4 border rounded-md hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center">
                <Users className="h-5 w-5 text-primary mr-3" />
                <span>Manage Technicians</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                View, edit and manage all technician profiles
              </p>
            </a>
            
            <a 
              href="/admin/applications"
              className="block p-4 border rounded-md hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-amber-500 mr-3" />
                <span>Review Applications</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Review and process pending applications
              </p>
            </a>
            
            <a 
              href="/admin/analytics"
              className="block p-4 border rounded-md hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center">
                <BarChart className="h-5 w-5 text-blue-500 mr-3" />
                <span>Analytics Dashboard</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                View performance metrics and statistics
              </p>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
