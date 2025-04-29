
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTechnicianAuth } from "@/contexts/TechnicianAuthContext";
import { XCircle, AlertCircle } from "lucide-react";

const RejectTechnician = () => {
  const { technicianId } = useParams<{ technicianId: string }>();
  const { rejectTechnician } = useTechnicianAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processRejection = async () => {
      if (!technicianId) {
        setError("Invalid technician ID");
        return;
      }
      
      setIsLoading(true);
      try {
        await rejectTechnician(technicianId);
        setIsComplete(true);
      } catch (err) {
        setError("Failed to reject technician. They may no longer exist in the system.");
      } finally {
        setIsLoading(false);
      }
    };
    
    processRejection();
  }, [technicianId, rejectTechnician]);

  return (
    <div className="container py-12 flex flex-col items-center">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Technician Rejection</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4 py-6">
            {isLoading ? (
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
                <p className="mt-4">Processing technician rejection...</p>
              </div>
            ) : error ? (
              <div className="text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                <h3 className="mt-4 text-lg font-semibold">Error</h3>
                <p className="mt-2 text-sm text-gray-500">{error}</p>
                <Button className="mt-4" variant="outline" asChild>
                  <Link to="/">Return to Home</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <XCircle className="mx-auto h-12 w-12 text-red-500" />
                <h3 className="mt-4 text-lg font-semibold">Technician Rejected</h3>
                <p className="mt-2 text-sm text-gray-500">
                  The technician application has been rejected.
                  They will receive a notification email.
                </p>
                <Button className="mt-4" asChild>
                  <Link to="/">Return to Home</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RejectTechnician;
