
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Technician } from "@/types/technician";
import { supabase } from "@/integrations/supabase/client";
import { Search, Eye, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { mapTechnicianData } from "@/utils/technicianMappers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { technicianAdminService } from "@/services/technicianAdminService";
import { toast } from "@/components/ui/sonner";

const TechnicianApplications = () => {
  const [applications, setApplications] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const fetchApplications = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      // Ensure admin is logged in before calling Edge Function
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error('Admin not logged in:', sessionError);
        toast.error("Please log in as admin to view applications");
        setLoading(false);
        return;
      }

      // Admin-only: get-technician-applications requires Authorization: Bearer <admin_access_token>.
      // supabase.functions.invoke sends the current session (admin must be logged in).
      const { data, error } = await supabase.functions.invoke('get-technician-applications', {
        method: 'POST',
        body: { status: activeTab },
      });

      if (error) {
        console.error('Edge Function error:', error);
        if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          toast.error("Admin authentication failed. Please log in again.");
        } else {
          throw error;
        }
        return;
      }

      const result = data as { error?: string; applications?: unknown[] } | null;
      if (result?.error) {
        console.error('Edge Function returned error:', result.error);
        throw new Error(result.error);
      }

      const rows = Array.isArray(result?.applications) ? result.applications : [];
      const mappedTechnicians = rows.map((row: unknown) => mapTechnicianData(row));
      setApplications(mappedTechnicians);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
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
        return <Badge variant="success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const handleApprove = async (technicianId: string) => {
    setActionLoading(technicianId);
    const success = await technicianAdminService.approveTechnician(technicianId);
    setActionLoading(null);
    if (success) {
      toast.success("Technician approved successfully");
      fetchApplications(false);
    }
  };

  const handleReject = async (technicianId: string) => {
    setActionLoading(technicianId);
    const success = await technicianAdminService.rejectTechnician(technicianId);
    setActionLoading(null);
    if (success) {
      toast.success("Technician rejected successfully");
      fetchApplications(false);
    }
  };

  const formatPricing = (pricing: Record<string, number>) => {
    if (!pricing || Object.keys(pricing).length === 0) return "-";
    return Object.entries(pricing)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => `${k}: ₹${v}`)
      .join(", ") || "-";
  };
  
  return (
    <div className="w-full max-w-full animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Technician Applications</h1>
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
          <Card className="overflow-hidden">
            <CardContent className="p-0 overflow-x-auto">
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
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Services</TableHead>
                      <TableHead>Pricing</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((application) => (
                      <TableRow key={application.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">
                          {application.name}
                        </TableCell>
                        <TableCell className="text-sm">{application.email}</TableCell>
                        <TableCell className="text-sm">{application.phone}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {(application.specialties || []).map((s, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {s}
                              </Badge>
                            ))}
                            {(!application.specialties || application.specialties.length === 0) && (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm max-w-[180px] truncate" title={formatPricing(application.pricing)}>
                          {formatPricing(application.pricing)}
                        </TableCell>
                        <TableCell>{getStatusBadge(application.verification_status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1 flex-wrap">
                            <Button asChild variant="outline" size="sm">
                              <Link to={`/admin/technician/${application.id}`}>
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Link>
                            </Button>
                            {application.verification_status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(application.id)}
                                  disabled={actionLoading === application.id}
                                >
                                  {actionLoading === application.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <>
                                      <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleReject(application.id)}
                                  disabled={actionLoading === application.id}
                                >
                                  {actionLoading === application.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <>
                                      <XCircle className="h-4 w-4 mr-1" /> Reject
                                    </>
                                  )}
                                </Button>
                              </>
                            )}
                          </div>
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
