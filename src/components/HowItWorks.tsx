
import { MapPin, Phone, UserCheck, Truck } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Request Service",
    description: "Select your required service and provide your vehicle details",
    icon: Phone,
    color: "bg-red-100 text-red-600",
  },
  {
    id: 2,
    title: "Share Location",
    description: "Allow us to access your current location or enter it manually",
    icon: MapPin,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 3,
    title: "Technician Assignment",
    description: "We'll assign the nearest qualified technician to assist you",
    icon: UserCheck,
    color: "bg-green-100 text-green-600",
  },
  {
    id: 4,
    title: "Track & Assistance",
    description: "Track your technician in real-time until they arrive to help",
    icon: Truck,
    color: "bg-yellow-100 text-yellow-600",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How It Works</h2>
        <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Getting help is quick and easy with our simple 4-step process
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center">
              <div className="relative mb-8">
                <div className={`${step.color} rounded-full p-5`}>
                  <step.icon className="h-8 w-8" />
                </div>
                <div className="absolute top-1/2 left-full w-full h-1 bg-gray-200 -z-10 hidden lg:block">
                  {step.id !== steps.length && <div className="h-full w-full"></div>}
                </div>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 text-white font-bold mb-4">
                {step.id}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
