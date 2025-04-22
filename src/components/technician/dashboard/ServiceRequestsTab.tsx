
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

const ServiceRequestsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Service Requests</CardTitle>
        <CardDescription>
          View and respond to customer service requests
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Clock className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No pending requests</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            There are no service requests available at this moment. New requests will appear here when customers need assistance.
          </p>
          <Button variant="outline">Refresh</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceRequestsTab;
