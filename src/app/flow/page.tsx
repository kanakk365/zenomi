"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/lib/api/client";

interface Option {
  id: string;
  label: string;
  order: number;
}

interface Step {
  intro: string;
  question: string;
  options: Option[];
  isMultipleChoice: boolean;
}

interface FlowData {
  surveyId: string;
  surveyName: string;
  surveyDescription: string;
  steps: Step[];
}

export default function FlowPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [flowData, setFlowData] = useState<FlowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [thirdSurveyId, setThirdSurveyId] = useState<string | null>(null);
  const [childId, setChildId] = useState<string | null>(null);
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [userMessages, setUserMessages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReportButton, setShowReportButton] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/signup");
    }
  }, [router, isAuthenticated]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch child data to get childId
        const childResponse = await apiClient.get("/onboarding/children");
        if (childResponse.data && Array.isArray(childResponse.data) && childResponse.data.length > 0) {
          setChildId(childResponse.data[0].id);
        }

        // Fetch surveys to get the third survey ID
        const surveysResponse = await apiClient.get("/surveys");
        const surveys = surveysResponse.data;
        
        if (surveys && Array.isArray(surveys) && surveys.length >= 3) {
          const thirdSurvey = surveys[2];
          setThirdSurveyId(thirdSurvey.id);

          // Fetch flow data for the third survey
          const flowResponse = await apiClient.get(`/surveys/${thirdSurvey.id}/flow`);
          setFlowData(flowResponse.data);

          // Fetch questions to get the question ID
          const questionsResponse = await apiClient.get(`/surveys/${thirdSurvey.id}/questions`);
          if (questionsResponse.data?.questions && questionsResponse.data.questions.length > 0) {
            setQuestionId(questionsResponse.data.questions[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch flow data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated()) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleSubmit = async () => {
    if (!childId || !thirdSurveyId || !questionId || !flowData || selectedOptions.length === 0) {
      console.error("Missing required data");
      return;
    }

    setIsSubmitting(true);

    try {
      const currentStep = flowData.steps[0];
      
      // Get selected option labels
      const selectedLabels = selectedOptions
        .map((optionId) => {
          const option = currentStep.options.find((opt) => opt.id === optionId);
          return option?.label;
        })
        .filter(Boolean);

      // Add user message showing selected options
      setUserMessages(selectedLabels as string[]);

      // Create responses array - one object per selected option with textAnswer
      const responses = selectedOptions.map((optionId) => {
        return {
          questionId: questionId,
          childId: childId,
          textAnswer: optionId,
        };
      });

      // Submit to API
      await apiClient.post(`/surveys/${thirdSurveyId}/responses/bulk`, {
        responses,
      });

      // Show report button after successful submission
      setIsSubmitting(false);
      setShowReportButton(true);
    } catch (error) {
      console.error("Failed to submit responses:", error);
      alert("Failed to submit responses. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!flowData || !flowData.steps || flowData.steps.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No flow data available</p>
      </div>
    );
  }

  const currentStep = flowData.steps[0];

  return (
    <div className="h-screen w-full font-urbanist relative overflow-hidden">
      {/* Background with gradient and grid */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #8B2D6C 0%, #704180 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex">
        {/* Left side - Welcome section */}
        <div className="w-1/2 flex flex-col items-center justify-center p-12">
          <div className="text-center mb-8">
            <h1 className="text-white text-4xl font-bold mb-2">
              Welcome to <span className="font-bold">ZenAI</span>
            </h1>
            <p className="text-white/80 text-sm uppercase tracking-wider">
              PARENTAL PORTAL
            </p>
          </div>

          <div className="mb-8">
            <Image
              src="/zenaiParents.svg"
              alt="Family illustration"
              width={300}
              height={300}
              className="object-contain"
            />
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 max-w-sm">
            <p className="text-white text-center text-sm">
              Zenomi helps understanding your teen&apos;s world helps you guide them better.
            </p>
          </div>
        </div>

        {/* Right side - Chat section */}
        <div className="w-1/2 flex items-center justify-center p-12">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-2xl min-h-[700px] flex flex-col overflow-hidden">
            {/* Bot header */}
            <div className="flex items-center gap-3 px-8 py-6 bg-[#f7f0f5]">
              <div className="w-12 h-12 rounded-full bg-[#8B2D6C] flex items-center justify-center">
                <Image
                  src="/purplebot.svg"
                  alt="Zenai"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Zenai</h3>
                <p className="text-xs text-green-500">Online</p>
              </div>
            </div>

            {/* Chat messages */}
            <div className="space-y-4 flex-1 px-8 pt-6 flex flex-col justify-end">
              {/* Intro message */}
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-[#8B2D6C] flex items-center justify-center shrink-0">
                  <Image
                    src="/purplebot.svg"
                    alt="Bot"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </div>
                <div className="bg-[#F5F0F8] rounded-tl-none rounded-tr-2xl rounded-br-2xl rounded-bl-2xl px-5 py-4 flex-1">
                  <p className="text-gray-800 text-sm">{currentStep.intro}</p>
                </div>
              </div>

              {/* Question message */}
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-[#8B2D6C] flex items-center justify-center shrink-0">
                  <Image
                    src="/purplebot.svg"
                    alt="Bot"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </div>
                <div className="bg-[#F5F0F8] rounded-tl-none rounded-tr-2xl rounded-br-2xl rounded-bl-2xl px-5 py-4 flex-1">
                  <p className="text-gray-800 text-sm font-medium mb-4">
                    {currentStep.question}
                  </p>

                  {/* Options */}
                  <div className="space-y-3">
                    {currentStep.options.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedOptions.includes(option.id)}
                            onChange={() => handleOptionToggle(option.id)}
                            className="w-5 h-5 rounded-full border-2 border-[#8B2D6C] appearance-none cursor-pointer checked:bg-[#8B2D6C] checked:border-[#8B2D6C] transition-all"
                          />
                          {selectedOptions.includes(option.id) && (
                            <svg
                              className="absolute left-1 top-1 w-3 h-3 text-white pointer-events-none"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                          )}
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-[#8B2D6C] transition-colors">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* User messages - show selected options */}
              {userMessages.length > 0 && (
                <div className="flex justify-end mt-4">
                  <div className="bg-[#8B2D6C] rounded-tl-2xl rounded-tr-none rounded-br-2xl rounded-bl-2xl px-5 py-4 max-w-[80%]">
                    <ul className="text-white text-sm space-y-1">
                      {userMessages.map((message, index) => (
                        <li key={index}>• {message}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* AI message with Get Report button */}
              {showReportButton && (
                <div className="flex gap-3 mt-4">
                  <div className="w-10 h-10 rounded-full bg-[#8B2D6C] flex items-center justify-center shrink-0">
                    <Image
                      src="/purplebot.svg"
                      alt="Bot"
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  </div>
                  <div className="bg-[#F5F0F8] rounded-tl-none rounded-tr-2xl rounded-br-2xl rounded-bl-2xl px-5 py-4 flex-1">
                    <p className="text-gray-800 text-sm mb-4">
                      Great! Your responses have been submitted successfully. Click below to view your personalized report.
                    </p>
                    <button
                      onClick={() => router.push("/reports")}
                      className="px-6 py-2 rounded-full text-white font-medium hover:opacity-90 transition-opacity cursor-pointer"
                      style={{
                        background: "linear-gradient(180deg, #8B2D6C 0%, #704180 100%)",
                      }}
                    >
                      Get Report
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="flex items-center mt-8 gap-3 px-8 pb-6">
              <input
                type="text"
                placeholder="Hi Parent type your answer here!!"
                disabled
                className="flex-1 px-4 py-3 rounded-full bg-[#f1f1f1] text-gray-400 text-sm focus:outline-none"
              />
              <button
                onClick={handleSubmit}
                disabled={selectedOptions.length === 0 || isSubmitting}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                style={{
                  background: "linear-gradient(180deg, #8B2D6C 0%, #704180 100%)",
                }}
              >
                {isSubmitting ? (
                  <svg
                    className="w-5 h-5 text-white animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

