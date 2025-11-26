"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { useIsAuthenticated } from "@/store/authStore";
import { apiClient } from "@/lib/api/client";

interface Survey {
  id: string;
  name: string;
  description: string;
  status: "completed" | "incomplete";
}

export default function SurveysPage() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signup");
    }
  }, [router, isAuthenticated]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await apiClient.get("/surveys");
        setSurveys(response.data);
      } catch (error) {
        console.error("Failed to fetch surveys:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSurveys();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  const handleAssessmentClick = (surveyId: string, status: string) => {
    if (status === "completed") return;
    router.push(`/assessment/${surveyId}`);
  };

  const getImageForSurvey = (name: string) => {
    if (name.toLowerCase().includes("relationship")) {
      return "/relation.png";
    } else if (name.toLowerCase().includes("challenges")) {
      return "/challenges.png";
    }
    return "/relation.png";
  };

  const displayedSurveys = surveys.slice(0, 2);

  const firstTwoCompleted = displayedSurveys.every(
    (s) => s.status === "completed"
  );

  return (
    <div className="min-h-screen w-full font-urbanist relative overflow-auto">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #F5F0F8 0%, #E8DFF0 100%)",
        }}
      >
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

      <div className="absolute top-0 left-0 w-32 h-32 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#8B2D6C]">
          <path
            d="M20,50 Q30,20 50,30 Q70,40 60,60 Q50,80 30,70 Q10,60 20,50"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="absolute top-10 right-0 w-40 h-40 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#704180]">
          <path
            d="M80,50 Q70,20 50,30 Q30,40 40,60 Q50,80 70,70 Q90,60 80,50"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 lg:py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-medium text-[#8B2D6C] mb-4">
            Parent Teen Relationship Survey
          </h1>
          <div className="w-170 h-px bg-[#8B2D6C] mx-auto mb-6"></div>
          <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto">
            The assessments below are designed to help you identify and support
            your teen's emotional and behavioral needs.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex gap-3 items-end">
            <div className="bg-[#F8E4FF] text-black rounded-tl-xl rounded-tr-xl rounded-bl-xl px-4 py-3 shadow-md">
              <p className="text-[#704180] font-medium">
                Start with assessments to get to know your teen better...
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#8B2D6C] flex items-center justify-center shrink-0 overflow-hidden shadow-md">
              <Image
                src="/purplebot.svg"
                alt="Bot"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-[#704180]">Loading surveys...</div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {displayedSurveys.map((survey) => (
                <div
                  key={survey.id}
                  className="group rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 p-4 bg-[#e3daea] hover:bg-[#753e7d] max-w-sm mx-auto w-full"
                >
                  <div className="flex flex-col gap-3">
                    <div className="relative w-full h-[139px] rounded-xl overflow-hidden bg-white block">
                      <Image
                        src={getImageForSurvey(survey.name)}
                        alt={survey.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        priority
                        unoptimized
                      />
                    </div>
                    <div className="flex flex-col gap-2.5 px-0">
                      <h3 className="text-xl font-semibold text-center leading-relaxed transition-all duration-300 bg-linear-to-r from-[#704180] to-[#8B2D6C] bg-clip-text text-transparent group-hover:bg-none group-hover:text-white">
                        {survey.name}
                      </h3>
                      <p className="text-sm text-[#343434] group-hover:text-white leading-relaxed transition-colors duration-300">
                        {survey.description}
                      </p>
                    </div>
                    <div
                      className="rounded-full p-[0.66px] mt-auto w-fit"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(139, 45, 108, 1) 0%, rgba(112, 65, 128, 1) 100%)",
                      }}
                    >
                      <button
                        onClick={() =>
                          handleAssessmentClick(survey.id, survey.status)
                        }
                        disabled={survey.status === "completed"}
                        className={`flex items-center justify-start gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 shadow-[0px_5.3px_26.49px_-13.25px_rgba(255,255,255,0.2),inset_0px_0px_0px_0.66px_rgba(255,255,255,0.06),inset_0.66px_0.66px_0px_0px_rgba(255,255,255,0.08)] ${
                          survey.status === "completed"
                            ? "text-white bg-transparent cursor-default group-hover:bg-white group-hover:text-black"
                            : "text-white group-hover:text-black hover:opacity-90 cursor-pointer bg-transparent group-hover:bg-white"
                        }`}
                      >
                        {survey.status === "completed" ? (
                          <>
                            Completed
                            <Check className="w-3 h-3 text-white group-hover:text-black transition-colors duration-300" />
                          </>
                        ) : (
                          <>
                            Assess now
                            <ArrowRight className="w-3 h-3 text-white group-hover:text-black transition-colors duration-300" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {firstTwoCompleted && displayedSurveys.length === 2 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => router.push("/flow")}
                  className="px-8 py-3 rounded-full text-white font-semibold hover:opacity-90 transition-opacity shadow-lg cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(180deg, #8B2D6C 0%, #704180 100%)",
                  }}
                >
                  Back to Zen AI
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
