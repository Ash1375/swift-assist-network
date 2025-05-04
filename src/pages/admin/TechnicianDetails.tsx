
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Technician } from "@/types/technician";
import { mapTechnicianData } from "@/utils/technicianMappers";
import { useTechnicianAuth } from "@/contexts/TechnicianAuthContext";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Map, 
  Globe, 
  Briefcase,
  FileText,
  Star,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";

const TechnicianDetails = () => {
  const { technicianId } = useParams<{ technicianId: string }>();
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const { approveTechnician, rejectTechnician } = useTechnicianAuth();

  useEffect(() => {
    const fetchTechnicianDetails = async () => {
      if (!technicianId) return;
      
      try {
        // Fetch technician data
        const { data, error } = await supabase
          .from('technicians')
          .select('*')
          .eq('id', technicianId)
          .single();
          
        if (error) throw error;
        
        // Use the mapper function to convert the data to our Technician type
        setTechnician(mapTechnicianData(data));
        
        // Fetch resume if available (to be implemented with storage)
        try {
          const { data: resumeData, error: resumeError } = await supabase
            .storage
            .from('resumes')
            .createSignedUrl(`${technicianId}/resume`, 3600);
            
          if (!resumeError && resumeData) {
            setResumeUrl(resumeData.signedUrl);
          }
        } catch (resumeErr) {
          console.log('Resume not found or storage not configured');
        }
      } catch (error) {
        console.error('Error fetching technician details:', error);
        toast.error('Failed to load technician details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTechnicianDetails();
  }, [technicianId]);

  const handleApprove = async () => {
    if (!technicianId) return;
    
    setIsApproving(true);
    const success = await approveTechnician(technicianId);
    setIsApproving(false);
    
    if (success) {
      toast.success('Technician approved successfully');
      // Optimistically update the UI
      setTechnician(prev => prev ? { ...prev, verification_status: 'verified' } : prev);
    } else {
      toast.error('Failed to approve technician');
    }
  };

  const handleReject = async () => {
    if (!technicianId) return;
    
    setIsRejecting(true);
    const success = await rejectTechnician(technicianId);
    setIsRejecting(false);
    
    if (success) {
      toast.success('Technician rejected successfully');
      // Optimistically update the UI
      setTechnician(prev => prev ? { ...prev, verification_status: 'rejected' } : prev);
    } else {
      toast.error('Failed to reject technician');
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading technician details...</span>
        </div>
      </div>
    );
  }

  if (!technician) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Technician not found</h2>
              <p className="text-muted-foreground">
                The technician you are looking for does not exist or has been removed.
              </p>
              <Button className="mt-4" asChild>
                <a href="/admin/technicians">Back to Technicians</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Technician Profile</h1>
          <p className="text-muted-foreground">Review application details and make decisions</p>
        </div>
        
        <Badge 
          variant={
            technician.verification_status === 'pending' ? 'secondary' :
            technician.verification_status === 'verified' ? 'success' : 'destructive'
          }
          className="text-sm py-1 px-3"
        >
          {technician.verification_status === 'pending' && 'Pending Review'}
          {technician.verification_status === 'verified' && 'Approved'}
          {technician.verification_status === 'rejected' && 'Rejected'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <User className="w-5 h-5 mt-0.5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{technician.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 mt-0.5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email Address</p>
                      <p className="font-medium">{technician.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 mt-0.5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone Number</p>
                      <p className="font-medium">{technician.phone}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 mt-0.5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{technician.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Map className="w-5 h-5 mt-0.5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Region & District</p>
                      <p className="font-medium">{technician.district}, {technician.state}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Globe className="w-5 h-5 mt-0.5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Service Area Range</p>
                      <p className="font-medium">{technician.serviceAreaRange} miles</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-start mb-6">
                    <Briefcase className="w-5 h-5 mt-0.5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Experience</p>
                      <p className="font-medium">{technician.experience} years</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Specialties</p>
                    <div className="flex flex-wrap gap-2">
                      {technician.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Service Pricing</p>
                  <div className="space-y-2">
                    {Object.entries(technician.pricing).map(([service, price]) => (
                      <div key={service} className="flex justify-between items-center py-1 border-b">
                        <span>{service}</span>
                        <span className="font-medium">${price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {resumeUrl && (
                <div className="mt-6 border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Resume</p>
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-muted-foreground" />
                    <a 
                      href={resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View Resume
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {technician.verification_status === 'pending' ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                    <h3 className="font-medium flex items-center">
                      <Star className="w-4 h-4 text-amber-500 mr-2" />
                      Application Pending Review
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      This application requires your review and decision.
                    </p>
                  </div>
                ) : technician.verification_status === 'verified' ? (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <h3 className="font-medium flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Application Approved
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      This technician has been approved and can accept service requests.
                    </p>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <h3 className="font-medium flex items-center">
                      <XCircle className="w-4 h-4 text-red-500 mr-2" />
                      Application Rejected
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      This application has been rejected.
                    </p>
                  </div>
                )}
                
                {technician.verification_status === 'pending' && (
                  <div className="flex flex-col space-y-2">
                    <Button 
                      onClick={handleApprove} 
                      disabled={isApproving}
                      className="w-full"
                    >
                      {isApproving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" /> Approve Application
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={handleReject}
                      disabled={isRejecting}
                      className="w-full"
                    >
                      {isRejecting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-2 h-4 w-4" /> Reject Application
                        </>
                      )}
                    </Button>
                  </div>
                )}
                
                {technician.verification_status !== 'pending' && (
                  <div className="flex justify-center">
                    <Button 
                      variant="outline" 
                      onClick={() => setTechnician(prev => {
                        if (!prev) return null;
                        return { ...prev, verification_status: 'pending' };
                      })}
                      className="w-full"
                    >
                      Reset to Pending
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Admin Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea 
                className="min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Add notes about this technician here..."
              />
              <Button className="w-full mt-2">Save Notes</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TechnicianDetails;
