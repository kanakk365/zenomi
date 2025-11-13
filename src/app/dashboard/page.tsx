"use client";

import { useEffect, useState } from "react";
import {
  ClipboardList,
  GraduationCap,
  FileText,
  Users,
  ArrowRight,
  X,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import apiClient from "@/lib/api/client";
import {
  getSurveyResultsWithCourseLinks,
  extractCourseRecommendations,
} from "@/lib/api/surveys";
import { CourseRecommendation } from "@/lib/api/types";

interface DashboardData {
  summaryMetrics: {
    totalAssessmentsTaken: number;
    coursesTaken: number;
    customAssessments: number;
    doctorsConsulted: number;
  };
  performanceChart: Array<{
    category: string;
    score: number;
  }>;
  courseStatusSummary: {
    pending: number;
    completed: number;
  };
  upcomingAppointments: Array<{
    doctorName: string;
    specialty: string;
    appointmentDate: string;
  }>;
  inProgressCourses: Array<{
    courseId: string;
    courseName: string;
    category: string;
    progress: number;
    lessonsCompleted: number;
    totalLessons: number;
  }>;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [courseRecommendations, setCourseRecommendations] = useState<
    CourseRecommendation[]
  >([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState<string | null>(null);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [iframeLoading, setIframeLoading] = useState(true);

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.get<DashboardData>("/dashboard");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCourseRecommendations = async () => {
      try {
        const surveyResults = await getSurveyResultsWithCourseLinks();
        const courses = extractCourseRecommendations(surveyResults);
        setCourseRecommendations(courses);
      } catch (error) {
        console.error("Failed to fetch course recommendations:", error);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchDashboardData();
    fetchCourseRecommendations();
  }, []);

  const firstName =
    typeof user?.name === "string" && user.name.trim()
      ? user.name.split(" ")[0]
      : "Sarah";

  const statCards = [
    {
      label: "Total Assessment Taken",
      value: dashboardData?.summaryMetrics.totalAssessmentsTaken ?? 0,
      icon: ClipboardList,
      accent: "bg-[#F4E4FF] text-[#8B2D6C]",
      badge: "Updated",
    },
    {
      label: "Courses Taken",
      value: dashboardData?.summaryMetrics.coursesTaken ?? 0,
      icon: GraduationCap,
      accent: "bg-[#E2F4FB] text-[#1F7AA9]",
      badge: "Learning",
    },
    {
      label: "Custom Assessment",
      value: dashboardData?.summaryMetrics.customAssessments ?? 0,
      icon: FileText,
      accent: "bg-[#FFF1DB] text-[#D9831F]",
      badge: "Active",
    },
    {
      label: "Doctors Consulted",
      value: dashboardData?.summaryMetrics.doctorsConsulted ?? 0,
      icon: Users,
      accent: "bg-[#FFF4F4] text-[#E25479]",
      badge: "Experts",
    },
  ];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#8B2D6C] border-r-transparent"></div>
          <p className="mt-4 text-sm text-[#8F82B0]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="flex items-end gap-6">
        <div>
          <h1 className="text-3xl font-semibold text-[#2C1B3A]">
            Hello, {firstName}
          </h1>
          <p className="mt-2 text-xl font-medium text-[#8B2D6C]">
            How can I help you today?
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="rounded-full bg-[#8B2D6C] px-6 py-1.5  text-sm font-semibold text-white shadow-lg shadow-[#8B2D6C]/25 transition-transform hover:-translate-y-0.5">
            + Ask AI
          </button>
          <button className="rounded-full border border-[#E0D5F5] bg-white px-6 py-1.5 text-sm font-semibold text-[#8B2D6C] transition-colors hover:bg-[#F7F3FF]">
            Take Assessment
          </button>
          <button className="rounded-full border border-[#E0D5F5] bg-white px-6 py-1.5 text-sm font-semibold text-[#8B2D6C] transition-colors hover:bg-[#F7F3FF]">
            Consult Doctor
          </button>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-3xl border border-[#EFE7FF] bg-white p-6 shadow-sm shadow-[#E7DFFF]"
            >
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-medium text-[#8F82B0]">
                    {card.label}
                  </p>
                  <p className="mt-6 text-4xl font-semibold text-[#2C1B3A]">
                    {card.value}
                  </p>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.accent}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[4fr_3fr]">
        <div className="rounded-3xl border border-[#EFE7FF] bg-white p-6 shadow-sm shadow-[#E7DFFF]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#2C1B3A]">
                Upcoming Appointments
              </h2>
              <p className="text-sm text-[#8F82B0]">
                Stay on top of your schedule
              </p>
            </div>
            <button className="text-sm font-semibold text-[#8B2D6C] hover:underline">
              View all
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {dashboardData?.upcomingAppointments &&
            dashboardData.upcomingAppointments.length > 0 ? (
              dashboardData.upcomingAppointments.map((appointment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-2xl border border-[#F1E8FF] bg-[#FDFBFF] px-4 py-3"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F1E8FF] text-base font-semibold text-[#8B2D6C]">
                      {appointment.doctorName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#2C1B3A]">
                        {appointment.doctorName}
                      </p>
                      <p className="text-xs text-[#8F82B0]">
                        {appointment.specialty}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#EAFBEC] px-4 py-1 text-xs font-semibold text-[#2D9E5F]">
                    Upcoming
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-[#8F82B0]">
                  No upcoming appointments
                </p>
              </div>
            )}
          </div>
        </div>

{coursesLoading ? (
          <div className="rounded-3xl border border-[#EFE7FF] bg-white p-8 shadow-sm shadow-[#E7DFFF] flex flex-col items-center justify-center h-full">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#8B2D6C] border-r-transparent"></div>
            <p className="mt-4 text-sm text-[#8F82B0]">Loading courses...</p>
          </div>
        ) : courseRecommendations.length > 0 ? (
          <div className="rounded-3xl bg-gradient-to-br from-[#8B2D6C] via-[#703C91] to-[#4A216A] p-8 text-white shadow-lg flex flex-col justify-center h-full">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.2em] text-[#D8C1F6]">
                  Recommended Courses
                </p>
                <h2 className="mt-2 text-xl font-semibold leading-tight">
                  Based on your assessments
                </h2>
              </div>
              <BookOpen className="h-6 w-6 text-[#F7EFFE] shrink-0" />
            </div>

            <p className="text-sm text-[#E5D4FA] mb-6">
              Personalized course recommendations to support your child&apos;s growth and development
            </p>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {courseRecommendations.slice(0, 5).map((course, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedCourse(course.courseLink);
                    setSelectedCourseTitle(course.statement);
                    setIframeLoading(true);
                  }}
                  className="w-full text-left rounded-2xl bg-white/10 backdrop-blur-sm p-4 transition-all hover:bg-white/20 hover:scale-[1.02] border border-white/10"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white shrink-0">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2">
                        {course.statement}
                      </h3>
                      <p className="text-xs text-[#D8C1F6]">
                        From: {course.surveyName}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-white/60 shrink-0" />
                  </div>
                </button>
              ))}
            </div>

            {courseRecommendations.length > 5 && (
              <p className="mt-4 text-xs text-[#D8C1F6] text-center">
                +{courseRecommendations.length - 5} more courses available
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-3xl bg-gradient-to-br from-[#4A216A] via-[#703C91] to-[#4A216A] p-4 px-8 pt-8 text-white shadow-lg flex flex-col justify-center h-full relative overflow-hidden">


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
                        className="w-full text-left rounded-3xl bg-gradient-to-b from-[#703C91] to-[#8B2D6C] p-5 transition-all hover:scale-[1.02] cursor-pointer relative overflow-hidden h-full flex flex-col"
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
        )}
      </section>

      {/* Iframe Modal for Course Content */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full h-full max-w-7xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between bg-gradient-to-b from-white to-white/95 px-6 py-4 border-b border-[#EFE7FF]">
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
