
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTechnicianAuth } from "@/contexts/TechnicianAuthContext";
import { CheckCircle, AlertCircle } from "lucide-react";

const ApproveTechnician = () => {
  const { technicianId } = useParams<{ technicianId: string }>();
  const { approveTechnician } = useTechnicianAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processApproval = async () => {
      if (!technicianId) {
        setError("Invalid technician ID");
        return;
      }
      
      setIsLoading(true);
      try {
        await approveTechnician(technicianId);
        setIsComplete(true);
      } catch (err) {
        setError("Failed to approve technician. They may no longer exist in the system.");
      } finally {
        setIsLoading(false);
      }
    };
    
    processApproval();
  }, [technicianId, approveTechnician]);

  return (
    <div className="container py-12 flex flex-col items-center">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Technician Approval</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4 py-6">
            {isLoading ? (
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
                <p className="mt-4">Processing technician approval...</p>
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
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <h3 className="mt-4 text-lg font-semibold">Technician Approved</h3>
                <p className="mt-2 text-sm text-gray-500">
                  The technician has been successfully approved and can now access the platform.
                  They will receive a confirmation email.
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

export default ApproveTechnician;
