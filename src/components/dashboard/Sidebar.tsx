"use client";

import Link from "next/link";
import { useMemo } from "react";
import { LucideIcon, LogOut } from "lucide-react";
import clsx from "clsx";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface DashboardSidebarProps {
  primaryNav: DashboardNavItem[];
  secondaryNav: DashboardNavItem[];
  pathname: string;
  onLogout: () => void;
  brandInitial?: string;
  brandName?: string;
  brandTagline?: string;
}

export function DashboardSidebar({
  primaryNav,
  secondaryNav,
  pathname,
  onLogout,
  brandInitial = "Z",
  brandName = "Zenomi Health",
  brandTagline = "Parent Intelligence Platform",
}: DashboardSidebarProps) {
  const navItems = useMemo(() => [...primaryNav], [primaryNav]);
  const supportItems = useMemo(() => [...secondaryNav], [secondaryNav]);

  return (
    <aside className="hidden xl:flex w-72 flex-col border-r border-[#E6E1F4] bg-white px-8 py-10 shadow-sm">
      <div className="flex items-center gap-3 mb-12">
        <div className="h-10 w-10 rounded-xl bg-[#8B2D6C] text-white flex items-center justify-center font-semibold">
          {brandInitial}
        </div>
        <div>
          <p className="text-lg font-bold text-[#2C1B3A]">{brandName}</p>
          <p className="text-xs text-[#8F82B0]">{brandTagline}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.href !== "#" && pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "bg-[#F1E8FF] text-[#8B2D6C]"
                  : "text-[#6A5B7A] hover:bg-[#F7F3FF] hover:text-[#8B2D6C]"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1">
        {supportItems.map((item) => {
          const Icon = item.icon;
          const active = item.href !== "#" && pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "bg-[#F1E8FF] text-[#8B2D6C]"
                  : "text-[#6A5B7A] hover:bg-[#F7F3FF] hover:text-[#8B2D6C]"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}

        <button
          onClick={onLogout}
          className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#E25479] transition-colors hover:bg-[#FDECEF]"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
