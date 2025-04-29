
import { useState } from "react";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/services-page/PageHeader";
import CategoryFilters from "@/components/services-page/CategoryFilters";
import ServiceCard from "@/components/services-page/ServiceCard";
import ServiceVehicleSelector from "@/components/services-page/ServiceVehicleSelector";
import { services, vehicleCategories } from "@/components/services-page/ServicesData";

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showVehicleSelect, setShowVehicleSelect] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState<string | null>(null);
  const [selectedVehicleSubtype, setSelectedVehicleSubtype] = useState<string | null>(null);

  const handleServiceClick = (serviceId: string) => {
    if (serviceId === selectedService) {
      setSelectedService(null);
      setShowVehicleSelect(false);
    } else {
      setSelectedService(serviceId);
      setShowVehicleSelect(false);
    }
  };

  const handleRequestService = () => {
    setShowVehicleSelect(true);
  };

  const handleVehicleTypeSelect = (vehicleType: string) => {
    setSelectedVehicleType(vehicleType);
    setSelectedVehicleSubtype(null);
  };

  const filteredServices = services;

  return (
    <div className="min-h-screen">
      <PageHeader 
        title="Our Services" 
        description="Fast, reliable roadside assistance services available 24/7, no matter where you are." 
      />

      <div className="container py-12">
        <CategoryFilters 
          categories={vehicleCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard 
              key={service.id}
              service={service}
              selectedService={selectedService}
              onServiceClick={handleServiceClick}
              showVehicleSelect={showVehicleSelect}
              onRequestService={handleRequestService}
              vehicleSelectContent={
                showVehicleSelect && selectedService === service.id && (
                  <ServiceVehicleSelector
                    vehicleCategories={vehicleCategories}
                    selectedVehicleType={selectedVehicleType}
                    selectedVehicleSubtype={selectedVehicleSubtype}
                    serviceId={service.id}
                    onVehicleTypeSelect={handleVehicleTypeSelect}
                    onVehicleSubtypeSelect={setSelectedVehicleSubtype}
                  />
                )
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
