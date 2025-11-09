"use client";

import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const childOverview = {
  name: "Alex",
  age: "8 years • 3 grade • Male",
  focusArea: "Working on emotional learning",
  scores: [
    { label: "Emotional", value: 35, color: "bg-[#F97373]" },
    { label: "Learning", value: 80, color: "bg-[#22C55E]" },
    { label: "Focus", value: 72, color: "bg-[#22C55E]" },
  ],
};

const insights = [
  {
    iconBg: "bg-[#D1FADF]",
    iconColor: "text-[#16A34A]",
    message: "Alex seems to have improved focus this week",
    highlight: "👏",
  },
  {
    iconBg: "bg-[#FEF0C7]",
    iconColor: "text-[#D97706]",
    message: "We recommend an Emotional Regulation activity — try this 5-min exercise.",
    highlight: "✨",
  },
  {
    iconBg: "bg-[#D1FADF]",
    iconColor: "text-[#16A34A]",
    message: "Alex seems to have improved Emotionally this week",
    highlight: "👏",
  },
];

const suggestedDoctors = [
  {
    name: "Emiley Matthew",
    specialty: "Pediatrician",
    avatar: "E",
  },
  {
    name: "Ria Jain",
    specialty: "Pediatrician",
    avatar: "R",
  },
  {
    name: "John Jacob",
    specialty: "Pediatrician",
    avatar: "J",
  },
];

const suggestedCourse = {
  category: "Mental Health",
  title: "Understanding child psychology: from Synapse to society",
  progress: 40,
};

export default function DashboardReportsPage() {
  const { user } = useAuthStore();

  const firstName = (() => {
    if (!user || !user.name) return "Sarah";
    const name = user.name.trim();
    if (!name) return "Sarah";
    return name.split(" ")[0];
  })();

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-2">
        <p className="text-sm font-medium text-[#8F82B0]">Welcome Back, {firstName}</p>
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-3xl font-semibold text-[#2C1B3A]">
            How&apos;s Alex doing today?
          </h1>
          <div className="flex items-center gap-2">
            <button className="rounded-full bg-[#8B2D6C] px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-[#8B2D6C]/25 transition-transform hover:-translate-y-0.5">
              + Ask AI
            </button>
            <button className="rounded-full border border-[#E0D5F5] bg-white px-6 py-2 text-sm font-semibold text-[#8B2D6C] transition-colors hover:bg-[#F7F3FF]">
              Take Assessment
            </button>
            <button className="rounded-full border border-[#E0D5F5] bg-white px-6 py-2 text-sm font-semibold text-[#8B2D6C] transition-colors hover:bg-[#F7F3FF]">
              Consult Doctor
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="rounded-3xl border border-[#EFE7FF] bg-white shadow-sm shadow-[#E7DFFF]">
          <div className="bg-linear-to-r from-[#8B2D6C] to-[#5F3A8F] rounded-t-3xl px-6 py-5 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-semibold">
                A
              </div>
              <div>
                <h2 className="text-xl font-semibold">{childOverview.name}</h2>
                <p className="text-sm text-white/80">{childOverview.age}</p>
              </div>
            </div>
            <p className="mt-4 text-sm italic text-white/75">
              {childOverview.focusArea}
            </p>
          </div>

          <div className="flex flex-col gap-4 px-6 py-6">
            {childOverview.scores.map((score) => (
              <div key={score.label} className="rounded-2xl border border-[#F1E8FF] bg-[#FBF9FF] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#2C1B3A]">{score.label}</p>
                  <span className="text-sm font-medium text-[#8F82B0]">{score.value}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-[#E9E4F4]">
                  <div className={`h-full rounded-full ${score.color}`} style={{ width: `${score.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-[#EFE7FF] bg-white shadow-sm shadow-[#E7DFFF]">
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="text-lg font-semibold text-[#2C1B3A]">
              Insights / Recommendations Section
            </h2>
            <button className="text-sm font-semibold text-[#8B2D6C] hover:underline">
              View all
            </button>
          </div>
          <div className="flex flex-col gap-4 px-6 pb-6">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-2xl border border-[#F1E8FF] bg-[#FBF9FF] px-4 py-4"
              >
                <div className={`${insight.iconBg} ${insight.iconColor} flex h-11 w-11 items-center justify-center rounded-full text-xl`}>
                  👍
                </div>
                <p className="flex-1 text-sm font-medium text-[#2C1B3A]">
                  {insight.message} <span>{insight.highlight}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        <div className="rounded-3xl border border-[#EFE7FF] bg-white shadow-sm shadow-[#E7DFFF]">
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="text-lg font-semibold text-[#2C1B3A]">Suggested Doctors</h2>
            <button className="text-sm font-semibold text-[#8B2D6C] hover:underline">
              View all
            </button>
          </div>
          <div className="flex flex-col">
            {suggestedDoctors.map((doctor) => (
              <div
                key={doctor.name}
                className="flex items-center justify-between border-t border-[#F1E8FF] px-6 py-4 first:border-t-0"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F1E8FF] text-base font-semibold text-[#8B2D6C]">
                    {doctor.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#2C1B3A]">{doctor.name}</p>
                    <p className="text-xs text-[#8F82B0]">{doctor.specialty}</p>
                  </div>
                </div>
                <button className="rounded-full bg-[#8B2D6C] px-5 py-2 text-xs font-semibold text-white">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-[#EFE7FF] bg-white shadow-sm shadow-[#E7DFFF]">
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="text-lg font-semibold text-[#2C1B3A]">Suggested Courses</h2>
            <button className="text-sm font-semibold text-[#8B2D6C] hover:underline">
              View all
            </button>
          </div>

          <div className="px-6 pb-6">
            <div className="rounded-3xl bg-linear-to-br from-[#8B2D6C] via-[#703C91] to-[#4A216A] p-6 text-white shadow-lg">
              <p className="text-xs uppercase tracking-[0.2em] text-[#D8C1F6]">
                Category - {suggestedCourse.category}
              </p>
              <h3 className="mt-2 text-lg font-semibold leading-snug">
                {suggestedCourse.title}
              </h3>

              <div className="mt-6">
                <div className="flex items-center justify-between text-xs font-medium text-white/80">
                  <span>{suggestedCourse.progress}% complete</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/25">
                  <div
                    className="h-full rounded-full bg-[#F7BC7D]"
                    style={{ width: `${suggestedCourse.progress}%` }}
                  ></div>
                </div>
              </div>

              <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-white/25">
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
