"use client";

import Link from "next/link";
import { useMemo } from "react";
import { LucideIcon, LogOut, X } from "lucide-react";
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
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function DashboardSidebar({
  primaryNav,
  secondaryNav,
  pathname,
  onLogout,
  brandInitial = "Z",
  brandName = "Zenomi Health",
  brandTagline = "Parent Intelligence Platform",
  isMobileOpen = false,
  onMobileClose,
}: DashboardSidebarProps) {
  const navItems = useMemo(() => [...primaryNav], [primaryNav]);
  const supportItems = useMemo(() => [...secondaryNav], [secondaryNav]);

  const isActive = (href: string) => {
    if (!href || href === "#") {
      return false;
    }

    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  };

  const handleLinkClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 xl:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed xl:static top-0 left-0 z-50 h-full w-72 flex-col border-r border-[#E6E1F4] bg-white px-6 sm:px-8 py-6 sm:py-10 shadow-sm transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0",
          "xl:flex"
        )}
      >
        {/* Mobile Close Button */}
        <div className="flex items-center justify-between mb-8 xl:mb-12">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-[#8B2D6C] text-white flex items-center justify-center font-semibold text-sm sm:text-base">
              {brandInitial}
            </div>
            <div>
              <p className="text-base sm:text-lg font-bold text-[#2C1B3A]">{brandName}</p>
              <p className="text-[10px] sm:text-xs text-[#8F82B0]">{brandTagline}</p>
            </div>
          </div>
          <button
            onClick={onMobileClose}
            className="xl:hidden p-2 rounded-lg hover:bg-[#F7F3FF] text-[#8B2D6C] transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleLinkClick}
                className={clsx(
                  "flex items-center gap-3 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-colors",
                  active
                    ? "bg-[#F1E8FF] text-[#8B2D6C]"
                    : "text-[#6A5B7A] hover:bg-[#F7F3FF] hover:text-[#8B2D6C]"
                )}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-1">
          {supportItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleLinkClick}
                className={clsx(
                  "flex items-center gap-3 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-colors",
                  active
                    ? "bg-[#F1E8FF] text-[#8B2D6C]"
                    : "text-[#6A5B7A] hover:bg-[#F7F3FF] hover:text-[#8B2D6C]"
                )}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                {item.label}
              </Link>
            );
          })}

          <button
            onClick={onLogout}
            className="mt-2 flex items-center gap-3 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-[#E25479] transition-colors hover:bg-[#FDECEF]"
          >
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
