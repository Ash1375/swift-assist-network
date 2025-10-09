import { Check } from "lucide-react";

interface Step {
  id: number;
  name: string;
  description: string;
}

interface ProgressStepperProps {
  currentStep: number;
  steps: Step[];
}

const ProgressStepper = ({ currentStep, steps }: ProgressStepperProps) => {
  return (
    <div className="w-full py-4 px-2 md:px-6 mb-6">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-muted -z-10">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          
          return (
            <div
              key={step.id}
              className="flex flex-col items-center gap-2 relative z-10 flex-1"
            >
              {/* Circle */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                  transition-all duration-300 transform
                  ${isCompleted 
                    ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground scale-110 shadow-lg' 
                    : isCurrent
                    ? 'bg-primary text-primary-foreground scale-110 shadow-lg ring-4 ring-primary/20 animate-pulse'
                    : 'bg-muted text-muted-foreground'
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>

              {/* Label */}
              <div className="text-center hidden md:block">
                <p
                  className={`
                    text-xs font-semibold transition-colors duration-300
                    ${isCurrent || isCompleted ? 'text-foreground' : 'text-muted-foreground'}
                  `}
                >
                  {step.name}
                </p>
                <p
                  className={`
                    text-[10px] transition-colors duration-300
                    ${isCurrent ? 'text-primary' : 'text-muted-foreground'}
                  `}
                >
                  {step.description}
                </p>
              </div>

              {/* Mobile label - show only current step */}
              {isCurrent && (
                <div className="text-center md:hidden absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <p className="text-xs font-semibold text-foreground">
                    {step.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressStepper;
