
export type ServiceType = {
  name: string;
  description: string;
  estimatedPrice: string;
};

export type VehicleType = {
  id: string;
  name: string;
  icon: any;
  subtypes: string[];
};

export type ServiceRequestFormData = {
  name: string;
  phone: string;
  vehicleType: string;
  vehicleSubtype: string;
  vehicleModel: string;
  location: string;
  details: string;
  selectedTechnicianId: string;
};
