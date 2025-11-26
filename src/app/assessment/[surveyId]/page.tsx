"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useIsAuthenticated } from "@/store/authStore";
import { apiClient } from "@/lib/api/client";

interface LikertOption {
  value: number;
  label: string;
}

interface Question {
  id: string;
  surveyId: string;
  statement: string;
  questionType: "LIKERT" | "OPEN_ENDED";
  order: number;
  likertScaleOptions?: LikertOption[];
}

interface SurveyData {
  surveyId: string;
  surveyName: string;
  surveyDescription: string;
  questions: Question[];
}

export default function AssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const surveyId = params.surveyId as string;
  const isAuthenticated = useIsAuthenticated();

  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [openEndedAnswer, setOpenEndedAnswer] = useState("");
  const [childId, setChildId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signup");
    }
  }, [router, isAuthenticated]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch child data to get childId
        const childResponse = await apiClient.get("/onboarding/children");
        console.log("Child response:", childResponse.data);
        
        if (childResponse.data && Array.isArray(childResponse.data) && childResponse.data.length > 0) {
          const firstChildId = childResponse.data[0].id;
          console.log("Setting childId:", firstChildId);
          setChildId(firstChildId);
        } else {
          console.warn("No children found or empty array:", childResponse.data);
        }

        const questionsResponse = await apiClient.get(`/surveys/${surveyId}/questions`);
        setSurveyData(questionsResponse.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && surveyId) {
      fetchData();
    }
  }, [isAuthenticated, surveyId]);

  useEffect(() => {
    if (surveyData && surveyData.questions[currentQuestionIndex]) {
      const currentQuestion = surveyData.questions[currentQuestionIndex];
      const savedAnswer = answers[currentQuestion.id];

      if (savedAnswer !== undefined) {
        if (currentQuestion.questionType === "LIKERT") {
          setSelectedOption(savedAnswer as number);
        } else {
          setOpenEndedAnswer(savedAnswer as string);
        }
      } else {
        setSelectedOption(null);
        setOpenEndedAnswer("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, surveyData]);

  if (!isAuthenticated || loading) {
    return null;
  }

  if (!surveyData) {
    return <div>Survey not found</div>;
  }

  const currentQuestion = surveyData.questions[currentQuestionIndex];
  const totalQuestions = surveyData.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleOptionSelect = (value: number) => {
    setSelectedOption(value);
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleOpenEndedChange = (value: string) => {
    setOpenEndedAnswer(value);
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    let currentChildId = childId;

    // If childId is not set, try to fetch it
    if (!currentChildId) {
      try {
        const childResponse = await apiClient.get("/onboarding/children");
        if (childResponse.data && Array.isArray(childResponse.data) && childResponse.data.length > 0) {
          currentChildId = childResponse.data[0].id;
          setChildId(currentChildId);
        } else {
          console.error("No children found in response");
          alert("Unable to find child information. Please try again.");
          return;
        }
      } catch (error) {
        console.error("Failed to fetch child data:", error);
        alert("Unable to load child information. Please try again.");
        return;
      }
    }

    if (!currentChildId) {
      console.error("Child ID not found");
      alert("Unable to find child information. Please try again.");
      return;
    }

    try {
      const responses = Object.entries(answers).map(([questionId, value]) => ({
        questionId,
        childId: currentChildId,
        optionChosen: value,
      }));

      await apiClient.post(`/surveys/${surveyId}/responses/bulk`, {
        responses,
      });

      router.push("/surveys");
    } catch (error) {
      console.error("Failed to submit survey responses:", error);
      alert("Failed to submit responses. Please try again.");
    }
  };

  const canProceed =
    currentQuestion.questionType === "LIKERT"
      ? selectedOption !== null
      : openEndedAnswer.trim() !== "";

  return (
    <div className="min-h-screen w-full font-urbanist relative overflow-auto">
      <div
        className="absolute inset-0 bg-white"
       
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(128,128,128,0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(128,128,128,0.4) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-start mb-6">
          <div className="text-left">
            <button
              onClick={() => router.push("/surveys")}
              className="flex items-center gap-2 text-[#8B2D6C] hover:opacity-80 transition-opacity mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold text-xl">
                {surveyData.surveyName}
              </span>
            </button>
            <p className="text-gray-600 text-sm ml-7">
              Understand how well your teen feels around you and also make them feel better.
            </p>
          </div>
        </div>

        <div className="mb-8 flex gap-3 items-end max-w-md">
        <div className=" size-10 rounded-full bg-[#8B2D6C] flex items-center justify-center">
                <Image
                  src="/purplebot.svg"
                  alt="Bot"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
          <div className="bg-[#ede8f2] text-black rounded-tl-xl rounded-tr-xl rounded-br-xl px-4 py-3">
            <p className="text-[#704180] font-medium text-sm">
              Start with assessments to get to know your teen better...
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-4">
              <div
                className="rounded-3xl p-8 h-full min-h-[500px] flex flex-col items-center justify-center relative"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(112, 65, 128, 0.63) 0%, rgba(139, 45, 108, 0.63) 100%)",
                }}
              >
              <div className="relative w-72 h-72 mb-6">
                <Image
                  src="/family.png"
                  alt="Family illustration"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-white text-center text-sm italic">
                Every Teen place is different
                <br />
                let&apos;s understand theirs.
              </p>

             
            </div>
          </div>

          <div className="col-span-8">
            <div className="bg-[#FDFBFF] rounded-3xl p-8 px-40 flex flex-col min-h-[500px]">
              <div className="mb-6">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      background: "#FDC040",
                    }}
                  />
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">
                  Question {String(currentQuestionIndex + 1).padStart(2, "0")}/
                  {String(totalQuestions).padStart(2, "0")}
                </p>
              </div>

              <div className="flex-1 flex flex-col items-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-8 text-center">
                  {currentQuestion.statement}
                </h2>

                {currentQuestion.questionType === "LIKERT" &&
                  currentQuestion.likertScaleOptions && (
                    <div className="space-y-3 w-full flex items-center justify-center">
                      <div className="space-y-3 w-full max-w-md flex flex-col items-center justify-center ">
                        {currentQuestion.likertScaleOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleOptionSelect(option.value)}
                            className={`w-72 px-6 py-3 cursor-pointer rounded-full text-sm font-medium transition-all ${
                              selectedOption === option.value
                                ? "text-white shadow-md"
                                : "bg-white border border-[#D8B4E2] text-gray-700 shadow-sm hover:border-[#9B59B6]"
                            }`}
                            style={
                              selectedOption === option.value
                                ? {
                                    background:
                                      "linear-gradient(90deg, #8B2D6C 0%, #704180 100%)",
                                  }
                                : {}
                            }
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                {currentQuestion.questionType === "OPEN_ENDED" && (
                  <div className="w-full flex items-center justify-center">
                    <textarea
                      value={openEndedAnswer}
                      onChange={(e) => handleOpenEndedChange(e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full max-w-md h-40 px-4 py-3 border border-[#D8B4E2] rounded-2xl resize-none focus:outline-none focus:border-[#9B59B6] text-gray-700 bg-white shadow-sm"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-center items-center gap-4 mt-8 pt-6 ">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-2 px-6 py-2 rounded-full bg-white border border-[#D8B4E2] text-gray-700 hover:border-[#9B59B6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>

                {currentQuestionIndex < totalQuestions - 1 ? (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-white border border-[#D8B4E2] text-gray-700 hover:border-[#9B59B6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleComplete}
                    disabled={!canProceed}
                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-white border border-[#D8B4E2] text-gray-700 hover:border-[#9B59B6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                  >
                    Complete
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
