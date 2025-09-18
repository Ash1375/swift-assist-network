
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Technician } from "@/types/technician";
import { supabase } from "@/integrations/supabase/client";
import { 
  Search, 
  Filter, 
  FileText, 
  Download,
  ExternalLink,
  Eye
} from "lucide-react";
import { mapTechnicianData } from "@/utils/technicianMappers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TechnicianApplications = () => {
  const [applications, setApplications] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState("pending");
  
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        let query = supabase.from('technicians').select('*');
        
        if (activeTab !== 'all') {
          query = query.eq('verification_status', activeTab as 'pending' | 'verified' | 'rejected' | 'suspended');
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Map the data to our Technician type using the mapper utility
        const mappedTechnicians = data.map(mapTechnicianData);
        setApplications(mappedTechnicians);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, [activeTab]);

  const filteredApplications = applications.filter(application =>
    application.name.toLowerCase().includes(search.toLowerCase()) ||
    application.email.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'verified':
        return <Badge variant="success">Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">Technician Applications</h1>
      <p className="text-muted-foreground mb-6">Review and manage technician applications</p>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            type="search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        </div>
      </div>
      
      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
        <div className="mb-6">
          <TabsList className="grid grid-cols-4 w-full sm:w-[400px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="verified">Verified</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={activeTab} className="mt-0">
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-6 text-center">
                  <p>Loading applications...</p>
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-muted-foreground">No applications found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Resume</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((application) => (
                      <TableRow key={application.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">
                          {application.name}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{application.email}</div>
                          <div className="text-xs text-muted-foreground">{application.phone}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{application.district}</div>
                          <div className="text-xs text-muted-foreground">{application.state}</div>
                        </TableCell>
                        <TableCell>{application.experience} years</TableCell>
                        <TableCell>{getStatusBadge(application.verification_status)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">View Resume</span>
                          </Button>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/admin/technician/${application.id}`}>
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechnicianApplications;
