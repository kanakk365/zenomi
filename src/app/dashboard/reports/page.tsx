"use client";

import { useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, GraduationCap, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

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

const availableCourses = [
  {
    id: 1,
    title: "Strengthening Emotional Bonds with Your Teen: A Parent's Guide",
    link: "https://zenomihealth.github.io/strengtheningemotionalbondswithyourteenaparentsguide/",
    category: "MENTAL HEALTH",
    enrolled: 26,
  },
  {
    id: 2,
    title: "Supporting Teen Emotional Expression: A Guide for Parents",
    link: "https://zenomihealth.github.io/teenemotionalexpression/",
    category: "MENTAL HEALTH",
    enrolled: 45,
  },
  {
    id: 3,
    title: "Parent Wellness & Positive Role Modeling for Teens",
    link: "https://zenomihealth.github.io/wellnesspositiverole/",
    category: "WELLNESS",
    enrolled: 32,
  },
  {
    id: 4,
    title: "Helping Teens Thrive: Emotional Intelligence for Parents",
    link: "https://zenomihealth.github.io/emotionalintelligenceteen/",
    category: "MENTAL HEALTH",
    enrolled: 18,
  },
  {
    id: 5,
    title: "Discovering the Science of Emotions: What Every Parent of a Teen Should Know",
    link: "https://zenomihealth.github.io/scienceofemotions/",
    category: "EDUCATION",
    enrolled: 52,
  },
  {
    id: 6,
    title: "Strategies to Help your Teen with Stress",
    link: "https://zenomihealth.github.io/helpteen/",
    category: "MENTAL HEALTH",
    enrolled: 38,
  },
];

export default function DashboardReportsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState<string | null>(null);
  const [iframeLoading, setIframeLoading] = useState(true);

  const firstName = (() => {
    if (!user || !user.name) return "Sarah";
    const name = user.name.trim();
    if (!name) return "Sarah";
    return name.split(" ")[0];
  })();

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-[#8F82B0]">Welcome Back, {firstName}</p>
          <button 
            onClick={() => router.push('/dashboard/downloadreport')}
            className="rounded-full cursor-pointer bg-[#8B2D6C] px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-[#8B2D6C]/25 transition-transform hover:-translate-y-0.5"
          >
            Reports
          </button>
        </div>
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

        <div className="rounded-3xl bg-linear-to-br from-[#4A216A] via-[#703C91] to-[#4A216A] p-4 px-8 pt-8 text-white shadow-lg flex flex-col justify-center h-full relative overflow-hidden">
          <div className="relative flex-1 min-h-0">
            <div className="overflow-hidden h-full">
              <div
                className="flex transition-transform duration-300 ease-in-out h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {availableCourses.map((course) => (
                  <div
                    key={course.id}
                    className="min-w-full shrink-0 w-full"
                  >
                    <div
                      onClick={() => {
                        setSelectedCourse(course.link);
                        setSelectedCourseTitle(course.title);
                        setIframeLoading(true);
                      }}
                      className="w-full text-left rounded-3xl bg-linear-to-b from-[#703C91] to-[#8B2D6C] p-5 transition-all hover:scale-[1.02] cursor-pointer relative overflow-hidden h-full flex flex-col"
                    >
                      {/* Background decorative shapes */}
                      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                        <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-sm"></div>
                        <div className="absolute top-12 right-8 w-6 h-6 bg-white rounded-full"></div>
                        <div className="absolute top-20 right-4 w-10 h-10 bg-white rounded-sm"></div>
                      </div>

                      <div className="relative z-10 flex flex-col flex-1 justify-between">
                        {/* Top Section: Category and Title */}
                        <div className="flex flex-col gap-[9px]">
                          {/* Category */}
                          <p 
                            className="text-[12.87px] uppercase text-[#C0C0C0] font-poppins font-normal leading-[0.93em] tracking-[0.08em]"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                          >
                            Category - {course.category}
                          </p>

                          {/* Course Title */}
                          <h3 
                            className="text-[14px] font-semibold text-white leading-[1.655em] line-clamp-2"
                            style={{ fontFamily: 'Urbanist, sans-serif', fontWeight: 600 }}
                          >
                            {course.title}
                          </h3>
                        </div>

                        {/* Middle Section: Continue Button */}
                        <div className="flex items-start mt-5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCourse(course.link);
                              setSelectedCourseTitle(course.title);
                              setIframeLoading(true);
                            }}
                            className="relative z-10 w-[103.83px] h-[28.31px] rounded-[16.95px] border border-white bg-white/27 flex items-center justify-center text-white text-[12px] font-poppins font-normal leading-[0.56em] hover:bg-white/35 transition-colors"
                            style={{ fontFamily: 'Poppins, sans-serif', padding: '6.1px 13.56px' }}
                          >
                            Continue→
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => {
                if (currentSlide > 0) {
                  setCurrentSlide(currentSlide - 1);
                }
              }}
              disabled={currentSlide === 0}
              className={`absolute -left-7 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors z-10 ${
                currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label="Previous course"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={() => {
                if (currentSlide < availableCourses.length - 1) {
                  setCurrentSlide(currentSlide + 1);
                }
              }}
              disabled={currentSlide === availableCourses.length - 1}
              className={`absolute -right-7 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors z-10 ${
                currentSlide === availableCourses.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label="Next course"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {availableCourses.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? "w-8 bg-white"
                    : "w-2 bg-white/30"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Iframe Modal for Course Content */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full h-full max-w-7xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between bg-linear-to-b from-white to-white/95 px-6 py-4 border-b border-[#EFE7FF]">
              <h3 className="text-lg font-semibold text-[#2C1B3A] line-clamp-1 pr-4">
                {selectedCourseTitle || "Course Content"}
              </h3>
              <button
                onClick={() => {
                  setSelectedCourse(null);
                  setSelectedCourseTitle(null);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1E8FF] text-[#8B2D6C] transition-colors hover:bg-[#8B2D6C] hover:text-white shrink-0"
                aria-label="Close course"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {iframeLoading && (
              <div className="absolute inset-0 flex items-center justify-center pt-16 bg-white/80 backdrop-blur-sm z-5">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#8B2D6C] border-r-transparent"></div>
                  <p className="mt-4 text-sm text-[#8F82B0]">Loading course...</p>
                </div>
              </div>
            )}
            <iframe
              key={selectedCourse}
              src={selectedCourse}
              className="w-full h-full pt-16 bg-white"
              title="Course Content"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => {
                console.log('Iframe loaded successfully:', selectedCourse);
                setIframeLoading(false);
              }}
              onError={() => {
                console.error('Iframe failed to load:', selectedCourse);
                setIframeLoading(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
