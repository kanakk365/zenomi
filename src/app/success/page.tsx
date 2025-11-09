"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function SuccessPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Redirect to dashboard after a short delay
    const timer = setTimeout(() => {
      if (isAuthenticated()) {
        router.push("/dashboard");
      } else {
        router.push("/signup");
      }
    }, 2000); // 2 second delay to show success message

    return () => clearTimeout(timer);
  }, [router, isAuthenticated]);

  return (
    <div className="min-h-screen w-full font-urbanist flex items-center justify-center bg-gradient-to-b from-[#F5F0F8] to-[#E8DFF0]">
      <div className="text-center bg-white rounded-[32px] p-12 shadow-lg max-w-md mx-6">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment has been processed successfully. Redirecting to dashboard...
        </p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B2D6C]"></div>
        </div>
      </div>
    </div>
  );
}

