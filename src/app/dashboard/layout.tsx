"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Stethoscope,
  BookOpen,
  Bot,
  User,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import {
  DashboardSidebar,
  DashboardNavItem,
} from "@/components/dashboard/Sidebar";
import { DashboardNavbar } from "@/components/dashboard/Navbar";

const primaryNav: DashboardNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Take Assessment", href: "/surveys", icon: ClipboardList },
  { label: "Reports & Analytics", href: "/reports", icon: BarChart3 },
  { label: "Doctor Consultation", href: "#", icon: Stethoscope },
  { label: "Zenai courses", href: "#", icon: BookOpen },
  { label: "Zenai AI", href: "#", icon: Bot },
];

const secondaryNav: DashboardNavItem[] = [
  { label: "Profile", href: "#", icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout, user } = useAuthStore();

  const authenticated = isAuthenticated();

  useEffect(() => {
    if (!authenticated) {
      router.push("/signup");
    }
  }, [authenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/signup");
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("") || "S";

  const firstName = user?.name?.split(" ")[0] || "Sarah";

  if (!authenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F3FE] text-[#2C1B3A]">
      <DashboardSidebar
        primaryNav={primaryNav}
        secondaryNav={secondaryNav}
        pathname={pathname}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardNavbar
          title="Dashboard"
          subtitle={`Welcome back, ${firstName}`}
          initials={initials}
          userName={user?.name}
          onDashboardClick={() => router.push("/dashboard")}
        />

        <main className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,#F7F3FF_0%,#F1E8FF_100%)] px-6 py-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}