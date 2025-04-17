
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { Check, X, Crown, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const subscriptionPlans = [
  {
    id: "basic",
    name: "Basic",
    price: "₹499",
    period: "per month",
    icon: Shield,
    description: "Essential roadside assistance for occasional drivers",
    features: [
      "Standard response times",
      "Up to 3 service requests per month",
      "24/7 phone assistance",
      "Basic towing up to 10km",
      "Flat tire repair",
    ],
    notIncluded: [
      "Priority response",
      "Extended towing distance",
      "Free fuel delivery",
    ],
    color: "blue",
  },
  {
    id: "premium",
    name: "Premium",
    price: "₹999",
    period: "per month",
    icon: Crown,
    description: "Enhanced coverage for regular commuters",
    features: [
      "Priority response times",
      "Unlimited service requests",
      "24/7 phone and chat assistance",
      "Towing up to 25km",
      "Flat tire repair",
      "Battery jumpstart services",
      "Free fuel delivery (up to 5L)",
    ],
    notIncluded: [
      "VIP response times",
      "Unlimited towing distance",
    ],
    color: "red",
    recommended: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "₹1,999",
    period: "per month",
    icon: Zap,
    description: "Complete coverage for multiple vehicles and business needs",
    features: [
      "VIP response times",
      "Unlimited service requests",
      "Dedicated account manager",
      "Unlimited towing distance",
      "All roadside services included",
      "Multiple vehicle coverage (up to 3)",
      "Free fuel delivery (unlimited)",
      "Rental car benefits",
    ],
    notIncluded: [],
    color: "purple",
  },
];

const Subscription = () => {
  const { user, updateSubscription } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(user?.subscription !== "none" ? user?.subscription : null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async (planId: string) => {
    setIsProcessing(true);
    try {
      // Simulate subscription process
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      updateSubscription(planId as "basic" | "premium" | "enterprise");
      toast.success(`Successfully subscribed to ${planId} plan!`);
      navigate("/");
    } catch (error) {
      toast.error("Failed to process subscription. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Subscription Plans</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Choose the right plan to get priority roadside assistance and exclusive benefits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {subscriptionPlans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const isUserPlan = user?.subscription === plan.id;
          const PlanIcon = plan.icon;
          
          return (
            <Card
              key={plan.id}
              className={`border-2 p-6 rounded-xl flex flex-col h-full relative ${
                isSelected 
                  ? `border-${plan.color}-500 shadow-lg shadow-${plan.color}-100` 
                  : "border-gray-200"
              } ${plan.recommended ? "transform md:-translate-y-4" : ""}`}
            >
              {plan.recommended && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              {isUserPlan && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Current Plan
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className={`mx-auto rounded-full p-3 bg-${plan.color}-100 inline-flex mb-4`}>
                  <PlanIcon className={`h-8 w-8 text-${plan.color}-600`} />
                </div>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 ml-1">{plan.period}</span>
                </div>
                <p className="mt-3 text-gray-600">{plan.description}</p>
              </div>
              
              <div className="flex-grow mb-6">
                <h4 className="font-medium text-gray-900 mb-3">What's included:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.notIncluded.length > 0 && (
                  <>
                    <h4 className="font-medium text-gray-900 mt-4 mb-3">Not included:</h4>
                    <ul className="space-y-2">
                      {plan.notIncluded.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-500">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              
              <Button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isProcessing || isUserPlan}
                className={`w-full ${
                  plan.id === "premium" 
                    ? "bg-red-600 hover:bg-red-700" 
                    : plan.id === "enterprise"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isProcessing && selectedPlan === plan.id ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : isUserPlan ? (
                  "Current Plan"
                ) : (
                  "Subscribe"
                )}
              </Button>
            </Card>
          );
        })}
      </div>
      
      <div className="max-w-3xl mx-auto bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-3">Subscription FAQs</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Can I change my plan later?</h4>
            <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time.</p>
          </div>
          <div>
            <h4 className="font-medium">How are service requests counted?</h4>
            <p className="text-gray-600">Each time you request roadside assistance, it counts as one service request. The count resets at the beginning of each billing cycle.</p>
          </div>
          <div>
            <h4 className="font-medium">What does priority response mean?</h4>
            <p className="text-gray-600">Priority response means your service requests are placed ahead of non-premium customers in the queue, reducing your wait time.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
