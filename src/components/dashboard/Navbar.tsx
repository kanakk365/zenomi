"use client";

import { LayoutDashboard } from "lucide-react";

interface DashboardNavbarProps {
  title: string;
  subtitle: string;
  userName?: string;
  userRole?: string;
  initials: string;
  onDashboardClick: () => void;
}

export function DashboardNavbar({
  title,
  subtitle,
  userName,
  userRole = "Parent",
  initials,
  onDashboardClick,
}: DashboardNavbarProps) {
  return (
    <header className="flex items-center justify-between border-b border-[#E6E1F4] bg-white px-6 py-5 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onDashboardClick}
          className="xl:hidden rounded-lg border border-[#E6E1F4] bg-white p-2 text-[#8B2D6C]"
        >
          <LayoutDashboard className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative rounded-full border border-[#E6E1F4] bg-[#F7F3FF] p-2 text-[#8B2D6C]">
          <span className="absolute -right-0.5 -top-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-[#E25479]"></span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1E8FF] text-lg font-semibold text-[#8B2D6C]">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
