"use client";

import { LayoutDashboard, Menu } from "lucide-react";

interface DashboardNavbarProps {
  title: string;
  subtitle: string;
  userName?: string;
  userRole?: string;
  initials: string;
  onDashboardClick: () => void;
  onMenuClick?: () => void;
}

export function DashboardNavbar({
  title,
  subtitle,
  userName,
  userRole = "Parent",
  initials,
  onDashboardClick,
  onMenuClick,
}: DashboardNavbarProps) {
  return (
    <header className="flex items-center justify-between border-b border-[#E6E1F4] bg-white px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 shadow-sm">
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 flex-1">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="xl:hidden flex items-center justify-center rounded-lg border-2 border-[#8B2D6C] bg-[#8B2D6C] p-2 sm:p-2.5 text-white hover:bg-[#704180] hover:border-[#704180] transition-colors shadow-sm active:scale-95 shrink-0"
            aria-label="Open menu"
            title="Open menu"
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        )}
        <button
          onClick={onDashboardClick}
          className="xl:hidden rounded-lg border border-[#E6E1F4] bg-white p-1.5 sm:p-2 text-[#8B2D6C] hover:bg-[#F7F3FF] transition-colors shrink-0"
          aria-label="Dashboard"
        >
          <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <div className="hidden sm:block min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-[#2C1B3A] truncate">{title}</h2>
          <p className="text-xs sm:text-sm text-[#8F82B0] truncate">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 lg:gap-6 shrink-0">
        <button className="relative rounded-full border border-[#E6E1F4] bg-[#F7F3FF] p-1.5 sm:p-2 text-[#8B2D6C] hover:bg-[#F1E8FF] transition-colors">
          <span className="absolute -right-0.5 -top-0.5 inline-flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#E25479]"></span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 sm:h-5 sm:w-5"
          >
            <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </button>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#F1E8FF] text-sm sm:text-lg font-semibold text-[#8B2D6C]">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
