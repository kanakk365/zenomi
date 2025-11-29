"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useReactToPrint } from "react-to-print";
import { useIsAuthenticated } from "@/store/authStore";
import { apiClient } from "@/lib/api/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Answer {
  questionId: string;
  statement: string;
  value: number | null;
  label: string | null;
  textAnswer: string | null;
}

interface Child {
  name: string;
  age: number;
  gender: string;
  createdAt: string;
}

interface SurveyResult {
  surveyId: string;
  surveyName: string;
  childId: string;
  childName: string;
  totalScore: number;
  band: string;
  answers: Answer[];
  child: Child;
}

interface OptionData {
  id: string;
  label: string;
  order: number;
  selected: boolean;
}

interface SurveyOptionsResponse {
  surveyId: string;
  questionId: string;
  statement: string;
  questionType: string;
  options: OptionData[];
  analysis: string;
}

export default function DownloadReportPage() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const [results, setResults] = useState<SurveyResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [optionsData, setOptionsData] = useState<SurveyOptionsResponse | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signup");
    }
  }, [router, isAuthenticated]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await apiClient.get<SurveyResult[]>("/surveys/results");
        const filteredResults = response.data.filter(
          (result) => result.surveyName !== "Support Categories"
        );
        setResults(filteredResults);
      } catch (error) {
        console.error("Failed to fetch results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchResults();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchOptionsData = async () => {
      try {
        // Fetch child data to get childId
        const childResponse = await apiClient.get("/onboarding/children");
        if (!childResponse.data || !Array.isArray(childResponse.data) || childResponse.data.length === 0) {
          return;
        }
        const childId = childResponse.data[0].id;

        // Fetch surveys to get the third survey ID
        const surveysResponse = await apiClient.get("/surveys");
        const surveys = surveysResponse.data;
        
        if (!surveys || !Array.isArray(surveys) || surveys.length < 3) {
          return;
        }

        const thirdSurvey = surveys[2];
        const surveyId = thirdSurvey.id;

        // Fetch questions to get the question ID
        const questionsResponse = await apiClient.get(`/surveys/${surveyId}/questions`);
        if (!questionsResponse.data?.questions || questionsResponse.data.questions.length === 0) {
          return;
        }
        const questionId = questionsResponse.data.questions[0].id;

        // Fetch options data
        const optionsResponse = await apiClient.get(
          `/surveys/${surveyId}/questions/${questionId}/options?childId=${childId}`
        );
        setOptionsData(optionsResponse.data);
      } catch (error) {
        console.error("Failed to fetch options data:", error);
      }
    };

    if (isAuthenticated && !loading) {
      fetchOptionsData();
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const childData = results.length > 0 && results[0].child ? results[0].child : null;
  const childName = childData ? childData.name : "Child";
  const childAge = childData ? childData.age : "-";
  const childCreatedAt = childData 
    ? new Date(childData.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '-')
    : "-";

  const chartSurveys = results.filter(
    (result) =>
      result.surveyName === "Challenges You Face" ||
      result.surveyName === "Relationship with Your Teen"
  );

  const chartData = chartSurveys.map((survey) => ({
    name: survey.surveyName,
    score: survey.totalScore,
    fullName: survey.surveyName,
  }));

  const surveysWithDetails = results.filter(
    (result) => result.answers && result.answers.length > 0
  );

  return (
    <div className="min-h-screen w-full font-urbanist bg-white">
      <div className="bg-white border-b border-gray-200 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Image
              src="/logo.png"
              alt="Zenomi"
              width={32}
              height={32}
              className="sm:w-10 sm:h-10 object-contain"
            />
            <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">
              Zenomi – Wellness Report Summary
            </h1>
          </div>
          <button
            onClick={handlePrint}
            className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer w-full sm:w-auto"
            style={{
              background: "linear-gradient(86deg, #704180 5%, #8B2D6C 96%)",
            }}
          >
            Download Report
          </button>
        </div>
      </div>

      <div ref={contentRef}>
        <div className="py-4 sm:py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#8B2D6C] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-t-lg">
              <h2 className="text-base sm:text-lg font-semibold">Personal Details</h2>
            </div>
            <div className="bg-white rounded-b-lg shadow-sm p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-12 lg:gap-20">
                <div className="flex flex-col items-center">
                  <div className="text-xs sm:text-sm font-semibold text-gray-500 mb-1 sm:mb-2">
                    Name
                  </div>
                  <div className="text-base sm:text-lg font-semibold text-gray-900">
                    {childName}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xs sm:text-sm font-semibold text-gray-500 mb-1 sm:mb-2">
                    Age
                  </div>
                  <div className="text-base sm:text-lg font-semibold text-gray-900">{childAge}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xs sm:text-sm font-semibold text-gray-500 mb-1 sm:mb-2">
                    Created At
                  </div>
                  <div className="text-base sm:text-lg font-semibold text-gray-900">
                    {childCreatedAt}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {optionsData && (
          <div className="py-4 sm:py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-[#8B2D6C] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-t-lg">
                <h2 className="text-base sm:text-lg font-semibold">{optionsData.statement}</h2>
              </div>
              <div className="bg-white rounded-b-lg p-4 sm:p-6 lg:p-8">
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-3 sm:mb-4">Selected Categories:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                    {optionsData.options
                      .filter(option => option.selected)
                      .map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center gap-2 bg-[#F5F0F8] rounded-lg px-3 sm:px-4 py-2 sm:py-3"
                        >
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B2D6C] shrink-0"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span className="text-xs sm:text-sm text-gray-800">{option.label}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {optionsData.analysis && (
                  <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-4 sm:pt-6">
                    {optionsData.analysis.split('\n\n').map((section, index) => {
                      const headingMatch = section.match(/\*\*(.+?)\*\*/);
                      const heading = headingMatch
                        ? headingMatch[1].replace(/:\s*$/, '')
                        : index === 0
                        ? 'Analysis'
                        : `Insight ${index + 1}`;
                      const body = headingMatch
                        ? section.replace(headingMatch[0], '').trim()
                        : section.trim();

                      return (
                        <div key={index} className={index > 0 ? 'mt-4 sm:mt-6' : ''}>
                          <h3 className="text-[#7A3A78] italic font-semibold text-sm sm:text-base mb-2 sm:mb-3">
                            {heading}
                          </h3>
                          <div className="bg-[#F6E8F4] rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-5">
                            <div className="flex gap-3 sm:gap-4 items-start">
                              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#8B2D6C] flex items-center justify-center shrink-0">
                                <svg
                                  className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                                {body}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
              Your Personalized Wellness Report
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              A snapshot of your mind, body, and habits
            </p>
          </div>

          <div className="mb-8 sm:mb-12 bg-white rounded-lg p-4 sm:p-6 lg:p-8 flex justify-center overflow-x-auto">
            <div className="w-full max-w-full" style={{ minWidth: "300px", width: "100%", maxWidth: "600px", height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
                >
                  <XAxis
                    dataKey="name"
                    angle={-15}
                    textAnchor="end"
                    height={100}
                    tick={{ fill: "#4B5563", fontSize: 13, fontWeight: 500 }}
                  />
                  <YAxis
                    label={{
                      value: "Score",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#4B5563", fontSize: 13, fontWeight: 500 },
                    }}
                    tick={{ fill: "#4B5563", fontSize: 12 }}
                    domain={[0, 30]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    labelStyle={{ color: "#111827", fontWeight: 600 }}
                    itemStyle={{ color: "#8B2D6C" }}
                    cursor={{ fill: "rgba(139, 45, 108, 0.1)" }}
                  />
                  <Bar
                    dataKey="score"
                    name="Total Score"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={120}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#gradient${index})`}
                      />
                    ))}
                  </Bar>
                  <defs>
                    <linearGradient id="gradient0" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B2D6C" stopOpacity={1} />
                      <stop offset="100%" stopColor="#704180" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B2D6C" stopOpacity={1} />
                      <stop offset="100%" stopColor="#704180" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#8B2D6C] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-t-lg">
            <h2 className="text-base sm:text-lg font-semibold">Zenomi Wellness Insights</h2>
          </div>

          <div className="mb-8 sm:mb-12">
            <div className="bg-white rounded-b-lg shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                      Test
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                      Score
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr
                      key={result.surveyId}
                      className={index > 0 ? "border-t border-gray-200" : ""}
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                        {result.surveyName}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                        {result.totalScore > 0
                          ? result.totalScore
                          : "-"}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                        {result.band}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {surveysWithDetails.map((survey) => (
            <div key={survey.surveyId} className="mb-8 sm:mb-12">
              <div className="bg-[#F5F0F8] rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-[#8B2D6C] mb-3 sm:mb-4 italic">
                  {survey.surveyName} - {survey.totalScore}
                </h3>

                <div className="bg-white rounded-lg overflow-hidden shadow-sm overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead className="bg-[#F5E6F0]">
                      <tr>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                          Question
                        </th>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                          Answer
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {survey.answers
                        .filter(
                          (answer) =>
                            answer.value !== null || answer.textAnswer !== null
                        )
                        .map((answer, index) => (
                          <tr
                            key={answer.questionId}
                            className={
                              index > 0 ? "border-t border-gray-200" : ""
                            }
                          >
                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                              {answer.statement}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                              {answer.textAnswer ||
                                (answer.label && answer.value
                                  ? `${answer.label} (${answer.value}/5)`
                                  : answer.label || "-")}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
