import { motion } from "framer-motion";
import { Check, Clock, MapPin, Car, User, Wrench, CreditCard } from "lucide-react";

type StepData = {
  name: string;
  icon: React.ElementType;
  completed: boolean;
  active: boolean;
  color: string;
};

interface LiveProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
}

const LiveProgressTracker = ({ currentStep, totalSteps }: LiveProgressTrackerProps) => {
  const steps: StepData[] = [
    { name: "Personal", icon: User, completed: currentStep > 1, active: currentStep === 1, color: "red" },
    { name: "Vehicle", icon: Car, completed: currentStep > 2, active: currentStep === 2, color: "yellow" },
    { name: "Location", icon: MapPin, completed: currentStep > 3, active: currentStep === 3, color: "blue" },
    { name: "Technician", icon: Wrench, completed: currentStep > 4, active: currentStep === 4, color: "purple" },
    { name: "Payment", icon: CreditCard, completed: currentStep > 5, active: currentStep === 5, color: "orange" },
    { name: "Confirm", icon: Check, completed: currentStep > 6, active: currentStep === 6, color: "green" }
  ];

  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-200/50 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Request Progress</h3>
        <span className="text-sm font-medium text-gray-600">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
      
      {/* Steps */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.name}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step.completed
                    ? "bg-green-500 shadow-lg scale-110"
                    : step.active
                    ? `bg-${step.color}-500 shadow-lg scale-110 animate-pulse`
                    : "bg-gray-200"
                }`}
              >
                {step.completed ? (
                  <Check className="h-6 w-6 text-white" />
                ) : (
                  <Icon
                    className={`h-6 w-6 ${
                      step.active ? "text-white" : "text-gray-400"
                    }`}
                  />
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium text-center ${
                  step.completed
                    ? "text-green-600"
                    : step.active
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                {step.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveProgressTracker;