"use client";

import { useEffect, useState } from "react";
import {
  ClipboardList,
  GraduationCap,
  FileText,
  Users,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import apiClient from "@/lib/api/client";

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

    fetchDashboardData();
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

        {dashboardData?.inProgressCourses &&
        dashboardData.inProgressCourses.length > 0 ? (
          <div className="rounded-3xl bg-gradient-to-br from-[#8B2D6C] via-[#703C91] to-[#4A216A] p-8 text-white shadow-lg flex flex-col justify-center h-full">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.2em] text-[#D8C1F6]">
                  Category - {dashboardData.inProgressCourses[0].category}
                </p>
                <h2 className="mt-2 text-xl font-semibold leading-tight">
                  {dashboardData.inProgressCourses[0].courseName}
                </h2>
              </div>
              <MessageCircle className="h-6 w-6 text-[#F7EFFE] shrink-0" />
            </div>

            <p className="mt-4 text-sm text-[#E5D4FA]">
              Continue your learning journey and unlock personalised insights
              for your child.
            </p>

            <div className="mt-6">
              <div className="flex items-center justify-between text-xs font-medium">
                <span>{dashboardData.inProgressCourses[0].progress}% complete</span>
                <span>
                  {dashboardData.inProgressCourses[0].totalLessons -
                    dashboardData.inProgressCourses[0].lessonsCompleted}{" "}
                  lessons left
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-[#F7BC7D]"
                  style={{
                    width: `${dashboardData.inProgressCourses[0].progress}%`,
                  }}
                ></div>
              </div>
            </div>

            <button className="mt-6 inline-flex items-center gap-2 w-28 rounded-full bg-white/15 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-white/25">
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="rounded-3xl border border-[#EFE7FF] bg-white p-8 shadow-sm shadow-[#E7DFFF] flex flex-col items-center justify-center h-full text-center">
            <MessageCircle className="h-12 w-12 text-[#D8C1F6] mb-4" />
            <h3 className="text-lg font-semibold text-[#2C1B3A] mb-2">
              No courses in progress
            </h3>
            <p className="text-sm text-[#8F82B0]">
              Start a course to track your learning journey
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
