
import { useState } from "react";
import { ArrowRight, ChevronDown, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ServiceDetails } from "./types";

type ServiceCardProps = {
  service: ServiceDetails;
  selectedService: string | null;
  onServiceClick: (serviceId: string) => void;
  showVehicleSelect: boolean;
  onRequestService: () => void;
  vehicleSelectContent?: React.ReactNode;
};

const ServiceCard = ({ 
  service, 
  selectedService, 
  onServiceClick, 
  showVehicleSelect, 
  onRequestService,
  vehicleSelectContent 
}: ServiceCardProps) => {
  const isSelected = selectedService === service.id;

  return (
    <div 
      className={cn(
        "border rounded-xl overflow-hidden transition-all hover:shadow-md cursor-pointer",
        isSelected ? "border-red-500 ring-2 ring-red-100" : "border-gray-200"
      )}
      onClick={() => onServiceClick(service.id)}
    >
      <div className="p-6">
        <div className="flex items-start">
          <div className="p-3 bg-red-50 rounded-full mr-4">
            <service.icon className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
            <p className="text-gray-600 mb-4">{service.description}</p>
          </div>
        </div>

        {isSelected && (
          <div className="mt-4 animate-fade-in">
            <div className="mt-4 mb-6">
              <p className="text-gray-700 mb-4">{service.details}</p>
              
              <Collapsible className="w-full">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 mb-2">Service Features:</h4>
                  <CollapsibleTrigger className="rounded-full hover:bg-gray-100 p-1">
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <ul className="space-y-2 mb-4">
                    {service.features && service.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
              
              <Collapsible className="w-full mt-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 mb-2">How We Do It:</h4>
                  <CollapsibleTrigger className="rounded-full hover:bg-gray-100 p-1">
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <ol className="space-y-2 mb-4">
                    {service.process && service.process.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex items-center justify-center h-5 w-5 rounded-full bg-red-100 text-red-600 text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CollapsibleContent>
              </Collapsible>
            </div>
            
            {!showVehicleSelect && (
              <Button 
                className="w-full bg-red-600 hover:bg-red-700" 
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestService();
                }}
              >
                Request This Service <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            
            {showVehicleSelect && isSelected && vehicleSelectContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
