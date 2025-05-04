
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Briefcase, 
  FileText, 
  ThumbsDown, 
  Star
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Technician } from "@/types/technician";

const TechnicianDetails = () => {
  const { technicianId } = useParams();
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [blackmarks, setBlackmarks] = useState([]);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const fetchTechnicianData = async () => {
      try {
        // Fetch technician data
        const { data, error } = await supabase
          .from('technicians')
          .select('*')
          .eq('id', technicianId)
          .single();
          
        if (error) throw error;
        setTechnician(data);
        
        // Try to fetch resume URL
        try {
          const fileExt = ["pdf", "doc", "docx"]; // Try common extensions
          for (const ext of fileExt) {
            const filePath = `${technicianId}/${technicianId}_resume.${ext}`;
            const { data } = await supabase.storage
              .from('technician_resumes')
              .createSignedUrl(filePath, 60 * 60); // 1 hour
              
            if (data?.signedUrl) {
              setResumeUrl(data.signedUrl);
              break;
            }
          }
        } catch (e) {
          console.log('Resume might not exist or error fetching it:', e);
        }
        
        // Here we would fetch blackmarks and feedback - mock data for now
        setBlackmarks([]);
        setFeedback([]);
      } catch (error) {
        console.error('Error fetching technician data:', error);
        toast.error("Failed to load technician data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTechnicianData();
  }, [technicianId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300 text-sm">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </Badge>
        );
      case "verified":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300 text-sm">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-800 border-red-300 text-sm">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-sm">
            <AlertCircle className="w-3 h-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="container py-10 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!technician) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
              <h2 className="mt-4 text-lg font-semibold">Technician not found</h2>
              <p className="mt-2 text-muted-foreground">
                The technician you are looking for does not exist or has been removed.
              </p>
              <Button asChild className="mt-6">
                <Link to="/admin/technicians">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Technicians
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link to="/admin/technicians">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Technicians
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Technician Profile
                {getStatusBadge(technician.verification_status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {technician.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-lg">{technician.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {technician.experience} years experience
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="flex items-start">
                    <Mail className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <span>{technician.email}</span>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <span>{technician.phone}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <div>{technician.address}</div>
                      <div className="text-sm text-muted-foreground">
                        {technician.district}, {technician.state}, {technician.region}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Service area: {technician.serviceAreaRange} miles
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {technician.verification_status === "pending" && (
                <div className="flex space-x-2 mt-6">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    asChild
                  >
                    <Link to={`/admin/approve-technician/${technician.id}`}>
                      <CheckCircle className="mr-2 h-4 w-4" /> Approve
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                    asChild
                  >
                    <Link to={`/admin/reject-technician/${technician.id}`}>
                      <XCircle className="mr-2 h-4 w-4" /> Reject
                    </Link>
                  </Button>
                </div>
              )}
              
              {resumeUrl && (
                <div className="mt-6">
                  <Button variant="outline" className="w-full" asChild>
                    <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                      <FileText className="mr-2 h-4 w-4" /> View Resume
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <Tabs defaultValue="details">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="blackmarks">Blackmarks</TabsTrigger>
                  <TabsTrigger value="feedback">Feedback</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <TabsContent value="details" className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-2">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {technician.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-2">Pricing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(technician.pricing).map(([service, price]) => (
                      <div key={service} className="flex justify-between items-center p-2 border rounded">
                        <span className="capitalize">{service.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <Badge variant="outline">${price}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="blackmarks">
                {blackmarks.length === 0 ? (
                  <div className="text-center py-12">
                    <ThumbsDown className="h-12 w-12 text-gray-300 mx-auto" />
                    <p className="text-muted-foreground mt-2">No blackmarks recorded</p>
                    
                    <Button variant="outline" className="mt-4">
                      Add Blackmark
                    </Button>
                  </div>
                ) : (
                  <div>Blackmark content would go here</div>
                )}
              </TabsContent>
              
              <TabsContent value="feedback">
                {feedback.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 text-gray-300 mx-auto" />
                    <p className="text-muted-foreground mt-2">No feedback recorded</p>
                  </div>
                ) : (
                  <div>Feedback content would go here</div>
                )}
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TechnicianDetails;
