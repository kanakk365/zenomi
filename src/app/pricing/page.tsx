"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, User, Rocket, Crown } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import apiClient from "@/lib/api/client";

export default function PricingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">(
    "monthly"
  );
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  if (!isAuthenticated()) {
    router.push("/signup");
    return null;
  }

  const plans = [
    {
      id: "basic",
      name: "Basic",
      icon: User,
      description:
        "Start with key reports and tips to support your child's growth",
      price: { monthly: "Free", annually: "Free" },
      features: [
        "Access 1 report per month",
        "Key recommendations & tips",
        "Limited charts & progress tracking",
      ],
      buttonText: "Try now",
      popular: false,
      savePercent: null,
    },
    {
      id: "standard",
      name: "Standard",
      icon: Rocket,
      description:
        "Unlock multiple reports, progress charts, and actionable strategies.",
      price: { monthly: "$299", annually: "$299" },
      features: [
        "Access 3 reports per month",
        "Full insights + progress charts",
        "Expert suggestions & actionable strategies",
      ],
      buttonText: "Subscribe now",
      popular: true,
      savePercent: 65,
    },
    {
      id: "premium",
      name: "Premium",
      icon: Crown,
      description:
        "Get unlimited reports, expert recommendations, and full progress.",
      price: { monthly: "$699", annually: "$699" },
      features: [
        "Unlimited report access",
        "Full personalized recommendations",
        "Detailed progress tracking & expert consultations",
      ],
      buttonText: "Subscribe now",
      popular: false,
      savePercent: 75,
    },
  ];

  const handleCheckout = async (plan: typeof plans[0]) => {
    const price = plan.price[billingPeriod];
    
    // Skip if plan is free
    if (price === "Free") {
      return;
    }

    // Extract amount from price string (e.g., "$299" -> 299)
    const amount = parseInt(price.replace(/[^0-9]/g, ""));
    
    if (isNaN(amount)) {
      console.error("Invalid price format");
      return;
    }

    setLoadingPlanId(plan.id);

    try {
      const response = await apiClient.post<{
        sessionID: string;
        url: string;
        amount: number;
      }>("/payments/users/checkout", {
        amount,
      });

      // Redirect to the checkout URL
      // After payment completion, the payment provider will redirect to /success
      if (response.data.url) {
        window.location.assign(response.data.url);
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to initiate checkout. Please try again.");
      setLoadingPlanId(null);
    }
  };

  return (
    <div className="min-h-screen w-full font-urbanist relative overflow-auto">
      <div className="absolute inset-0 bg-linear-to-b from-[#F5F0F8] to-[#E8DFF0]">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139,45,108,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139,45,108,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={() => router.back()}
              className="text-gray-900 hover:text-[#8B2D6C] transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Choose the Best Plan for Your Child
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Unlock personalized insights, detailed reports, and expert guidance
            tailored to your child&apos;s needs.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-full p-1 shadow-sm">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingPeriod === "monthly"
                  ? "bg-[#8B2D6C] text-white"
                  : "text-[#8B2D6C] hover:bg-gray-50"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("annually")}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingPeriod === "annually"
                  ? "bg-[#8B2D6C] text-white"
                  : "text-[#8B2D6C] hover:bg-gray-50"
              }`}
            >
              Annually
            </button>
          </div>
        </div>

        <div className="flex flex-row gap-8 max-w-6xl mx-auto justify-center">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = plan.price[billingPeriod];

            return (
              <div
                key={plan.id}
                className="relative bg-white rounded-[32px] border border-[#CECECE] flex-1 flex flex-col w-[394px] p-6 gap-8 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] transition-all duration-300 hover:bg-[linear-gradient(180deg,#704180_0%,#8B2D6C_100%)] group"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div className="w-[52px] h-[52px] rounded-lg flex items-center justify-center border border-[#E6E6E6] bg-[linear-gradient(140deg,#704180_0%,transparent_100%)] shadow-[inset_0px_-2px_3px_0px_rgba(139,45,108,0.2),inset_0px_1px_1px_0px_rgba(255,255,255,0.15)]">
                        <Icon className="w-6 h-6 text-[#8B2D6C] group-hover:text-white transition-colors duration-300" />
                      </div>

                      {plan.savePercent && (
                        <div className="px-3 py-2.5 rounded-full text-xs font-medium text-black bg-linear-to-b from-[#F7C569] to-[#FBBC05] group-hover:bg-white group-hover:text-[#8B2D6C] transition-all duration-300">
                          Save {plan.savePercent}%
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3">
                      <h3 className="text-xl font-semibold text-black leading-[1.15em] group-hover:text-white transition-colors duration-300">
                        {plan.name}
                      </h3>
                      <p className="text-base font-normal text-[#4E4E4E] leading-[1.4em] group-hover:text-white transition-colors duration-300">
                        {plan.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-end gap-0.5">
                    <span className="text-[40px] font-semibold text-black leading-[1.15em] group-hover:text-white transition-colors duration-300">
                      {price}
                    </span>
                    {price !== "Free" && (
                      <span className="text-sm font-normal text-[#6A6A6A] leading-[1.15em] mb-1 group-hover:text-white transition-colors duration-300">
                        /month
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <ul className="flex flex-col gap-2.5">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="w-6 h-6 text-[#8B2D6C] shrink-0 group-hover:text-white transition-colors duration-300" />
                        <span className="text-sm font-normal text-[#2C2C2C] leading-[1.15em] group-hover:text-white transition-colors duration-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleCheckout(plan)}
                    disabled={loadingPlanId === plan.id}
                    className="w-full py-2 px-[18px] rounded-xl font-semibold text-base text-white transition-all duration-300 hover:opacity-90 cursor-pointer bg-linear-to-r from-[#8B2D6C] to-[#704180] border border-[#514F6E] shadow-[0px_3px_6px_0px_rgba(7,0,110,0.03),inset_0px_-2px_2px_0px_rgba(10,16,50,0.07)] group-hover:bg-[#a76594] group-hover:border-[#a76594] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingPlanId === plan.id ? "Processing..." : plan.buttonText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
