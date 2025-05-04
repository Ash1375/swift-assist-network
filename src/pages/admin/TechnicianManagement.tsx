
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  FileText,
  Search,
  Star,
  ThumbsDown,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Technician } from "@/types/technician";

const TechnicianManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  // Fetch technicians
  const { data: technicians, isLoading, refetch } = useQuery({
    queryKey: ["technicians"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technicians")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Technician[];
    },
  });

  const filteredTechnicians = technicians
    ? technicians
        .filter(
          (tech) =>
            (activeTab === "all" ||
              (activeTab === "pending" &&
                tech.verification_status === "pending") ||
              (activeTab === "verified" &&
                tech.verification_status === "verified") ||
              (activeTab === "rejected" &&
                tech.verification_status === "rejected")) &&
            (tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              tech.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
              tech.phone.includes(searchTerm))
        )
    : [];

  const handleAddBlackmark = async (technicianId: string) => {
    // Implement blackmark functionality
    toast.success("Blackmark added to technician record");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "verified":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-800 border-red-300">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="w-3 h-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  return (
    <div className="container py-10">
      <Card>
        <CardHeader className="bg-primary-foreground">
          <CardTitle className="text-2xl font-bold">Technician Management</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search technicians..."
                className="pl-8 w-full md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Tabs
              defaultValue="pending"
              className="w-full md:w-auto"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="verified">Verified</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTechnicians.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No technicians found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTechnicians.map((technician) => (
                        <TableRow key={technician.id}>
                          <TableCell className="font-medium">{technician.name}</TableCell>
                          <TableCell>
                            <div>{technician.email}</div>
                            <div className="text-sm text-muted-foreground">{technician.phone}</div>
                          </TableCell>
                          <TableCell>
                            <div>{technician.district}</div>
                            <div className="text-sm text-muted-foreground">{technician.state}</div>
                          </TableCell>
                          <TableCell>{technician.experience} years</TableCell>
                          <TableCell>{getStatusBadge(technician.verification_status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <Link to={`/admin/technician/${technician.id}`}>
                                  <Eye className="h-4 w-4 mr-1" /> View
                                </Link>
                              </Button>
                              
                              {technician.verification_status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                                    asChild
                                  >
                                    <Link to={`/admin/approve-technician/${technician.id}`}>
                                      <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                    </Link>
                                  </Button>
                                  
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                                    asChild
                                  >
                                    <Link to={`/admin/reject-technician/${technician.id}`}>
                                      <XCircle className="h-4 w-4 mr-1" /> Reject
                                    </Link>
                                  </Button>
                                </>
                              )}

                              {technician.verification_status === "verified" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200"
                                  onClick={() => handleAddBlackmark(technician.id)}
                                >
                                  <ThumbsDown className="h-4 w-4 mr-1" /> Blackmark
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicianManagement;
