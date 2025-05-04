import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Technician } from "@/types/technician";
import { mapTechnicianData } from "@/utils/technicianMappers";
import { useTechnicianAuth } from "@/contexts/TechnicianAuthContext";

const TechnicianDetails = () => {
  const { technicianId } = useParams<{ technicianId: string }>();
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [loading, setLoading] = useState(true);
  const { approveTechnician, rejectTechnician } = useTechnicianAuth();

  useEffect(() => {
    const fetchTechnicianDetails = async () => {
      if (!technicianId) return;
      
      try {
        const { data, error } = await supabase
          .from('technicians')
          .select('*')
          .eq('id', technicianId)
          .single();
          
        if (error) throw error;
        
        // Use the mapper function to convert the data to our Technician type
        setTechnician(mapTechnicianData(data));
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
    
    const success = await approveTechnician(technicianId);
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
    
    const success = await rejectTechnician(technicianId);
    if (success) {
      toast.success('Technician rejected successfully');
      // Optimistically update the UI
      setTechnician(prev => prev ? { ...prev, verification_status: 'rejected' } : prev);
    } else {
      toast.error('Failed to reject technician');
    }
  };

  if (loading) {
    return <div className="container py-8">Loading technician details...</div>;
  }

  if (!technician) {
    return <div className="container py-8">Technician not found.</div>;
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Technician Details</h1>
      
      <Card className="border-2 border-primary/10 shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">{technician.name}</h2>
              <p className="text-muted-foreground">Email: {technician.email}</p>
              <p className="text-muted-foreground">Phone: {technician.phone}</p>
              <p className="text-muted-foreground">Address: {technician.address}, {technician.district}, {technician.state}</p>
              <p className="text-muted-foreground">Region: {technician.region}</p>
              <p className="text-muted-foreground">Service Area Range: {technician.serviceAreaRange} miles</p>
              <p className="text-muted-foreground">Experience: {technician.experience} years</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Verification Status</h3>
              <Badge 
                variant={
                  technician.verification_status === 'pending' ? 'secondary' :
                  technician.verification_status === 'verified' ? 'success' : 'destructive'
                }
              >
                {technician.verification_status}
              </Badge>
              
              <h3 className="text-lg font-semibold mt-4 mb-2">Specialties</h3>
              <ul className="list-disc list-inside">
                {technician.specialties.map((specialty, index) => (
                  <li key={index}>{specialty}</li>
                ))}
              </ul>
              
              <h3 className="text-lg font-semibold mt-4 mb-2">Pricing</h3>
              <ul className="list-disc list-inside">
                {Object.entries(technician.pricing).map(([service, price]) => (
                  <li key={service}>{service}: ${price}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-4">
            {technician.verification_status === 'pending' && (
              <>
                <Button variant="secondary" onClick={handleReject}>Reject</Button>
                <Button onClick={handleApprove}>Approve</Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicianDetails;
