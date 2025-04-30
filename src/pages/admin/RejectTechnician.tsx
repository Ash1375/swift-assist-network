
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner"; 
import { emailService } from "@/services/emailService";
import { Loader2 } from "lucide-react";

const RejectTechnician = () => {
  const { technicianId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [technicianName, setTechnicianName] = useState("");
  const [technicianEmail, setTechnicianEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechnicianData = async () => {
      try {
        const { data: technician, error } = await supabase
          .from('technicians')
          .select('name, email, verification_status')
          .eq('id', technicianId)
          .single();
        
        if (error) throw error;
        
        if (technician) {
          setTechnicianName(technician.name);
          setTechnicianEmail(technician.email);
          
          // Check if already rejected
          if (technician.verification_status === 'rejected') {
            setError("This technician application has already been rejected.");
          }
        } else {
          setError("Technician not found.");
        }
      } catch (error: any) {
        console.error("Error fetching technician:", error);
        setError(error.message || "An error occurred while fetching technician data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTechnicianData();
  }, [technicianId]);

  const handleRejection = async () => {
    if (!technicianId) return;
    
    setIsSubmitting(true);
    try {
      // Update technician status in database
      const { error } = await supabase
        .from('technicians')
        .update({ verification_status: 'rejected' })
        .eq('id', technicianId);
        
      if (error) throw error;
      
      // Send rejection email
      await emailService.sendTechnicianStatusEmail(
        technicianEmail,
        technicianName,
        false
      );
      
      toast.success("Technician application rejected");
      navigate("/");
    } catch (error: any) {
      console.error("Error rejecting technician:", error);
      toast.error(error.message || "Failed to reject technician");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container py-12 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Reject Technician Application</CardTitle>
          <CardDescription>
            Review and reject this technician application
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : (
            <div className="space-y-4">
              <p>
                You are about to reject <strong>{technicianName}</strong>'s application.
              </p>
              <p>
                An email notification will be sent to {technicianEmail} informing them about this decision.
              </p>
              <p className="text-amber-600">
                This action cannot be undone. Please confirm to proceed.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRejection}
            disabled={!!error || isSubmitting}
            variant="destructive"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              "Reject Application"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RejectTechnician;
