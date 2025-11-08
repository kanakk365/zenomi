"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
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

interface SurveyResult {
  surveyId: string;
  surveyName: string;
  childId: string;
  childName: string;
  totalScore: number;
  band: string;
  answers: Answer[];
}

export default function ReportsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [results, setResults] = useState<SurveyResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/signup");
    }
  }, [router, isAuthenticated]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await apiClient.get("/surveys/results");
        setResults(response.data);
      } catch (error) {
        console.error("Failed to fetch results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated()) {
      fetchResults();
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const childName = results.length > 0 ? results[0].childName : "Child";

  const chartSurveys = results.filter(
    (result) =>
      result.surveyName === "Challenges You Face" ||
      result.surveyName === "Relationship with Your Teen"
  );

  // Prepare data for Recharts
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
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Zenomi"
              width={40}
              height={40}
              className="object-contain"
            />
            <h1 className="text-xl font-semibold text-gray-900">
              Zenomi – Wellness Report Summary
            </h1>
          </div>
        </div>
      </div>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-[#8B2D6C] text-white px-6 py-3 rounded-t-lg">
            <h2 className="text-lg font-semibold">Personal Details</h2>
          </div>
          <div className="bg-white rounded-b-lg shadow-sm p-8">
            <div className="flex justify-center gap-20">
              <div className="flex flex-col items-center">
                <div className="text-sm font-semibold text-gray-500 mb-2">
                  Name
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {childName}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-sm font-semibold text-gray-500 mb-2">
                  Age
                </div>
                <div className="text-lg font-semibold text-gray-900">36</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-sm font-semibold text-gray-500 mb-2">
                  DOB
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  04-02-1989
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Your Personalized Wellness Report
          </h2>
          <p className="text-gray-600">
            A snapshot of your mind, body, and habits
          </p>
        </div>

        <div className="mb-12 bg-white rounded-lg p-8 flex justify-center">
          <div style={{ width: "600px", height: "400px" }}>
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

        <div className="bg-[#8B2D6C] text-white px-6 py-3 rounded-t-lg">
          <h2 className="text-lg font-semibold">Zenomi Wellness Insights</h2>
        </div>

        <div className="mb-12">
          <div className="bg-white rounded-b-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Test
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
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
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {result.surveyName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {result.totalScore > 0
                        ? `${result.totalScore} / 10`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {result.band}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {surveysWithDetails.map((survey) => (
          <div key={survey.surveyId} className="mb-12">
            <div className="bg-[#F5F0F8] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#8B2D6C] mb-4 italic">
                {survey.surveyName} - {survey.totalScore} out of 10
              </h3>

              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <table className="w-full">
                  <thead className="bg-[#F5E6F0]">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Question
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
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
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {answer.statement}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
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
  );
}
