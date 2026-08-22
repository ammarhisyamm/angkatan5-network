"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { Home, Users, Briefcase, UserCheck, ShieldCheck, BarChart3, Layers, LogOut } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser, logout, switchDemoRole } = useApp();
  const isAdminSection = pathname.startsWith("/admin");

  const memberNavItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Discover People", href: "/discover", icon: Users },
    { name: "Opportunities", href: "/opportunities", icon: Briefcase },
    { name: "My Profile", href: "/my-profile", icon: UserCheck },
  ];
  const adminNavItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },
    { name: "Members", href: "/admin/members", icon: Users },
    { name: "Opportunities", href: "/admin/opportunities", icon: Briefcase },
    { name: "Skills", href: "/admin/skills", icon: Layers },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  ];
  const activeNavItems = isAdminSection ? adminNavItems : memberNavItems;

  return (
    <aside className="hidden lg:flex w-[248px] h-screen sticky top-0 shrink-0 flex-col border-r border-stroke-soft-200 bg-bg-white-0 select-none z-30">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-stroke-soft-200">
        <Link href="/dashboard" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary-base text-sm font-semibold text-static-white shadow-[0_6px_12px_-6px_rgba(51,92,255,0.75)]">A5</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-5 text-text-strong-950">A5 Network</p>
            <p className="truncate text-xs leading-[18px] text-text-sub-600">Private Talent Directory</p>
          </div>
        </Link>

        {/* Role switcher */}
        <div className="mt-5 flex items-center gap-1 rounded-xl border border-stroke-soft-200 bg-bg-weak-50 p-1" role="tablist" aria-label="Workspace role">
          <Link
            href="/dashboard"
            role="tab"
            aria-selected={!isAdminSection}
            className={cn(
              "flex h-8 flex-1 items-center justify-center rounded-md text-xs font-medium transition-colors",
              !isAdminSection
                ? "bg-bg-white-0 text-primary-base shadow-regular-xs"
                : "text-text-sub-600 hover:text-text-strong-950",
            )}
          >
            Member
          </Link>
          <Link
            href="/admin/dashboard"
            role="tab"
            aria-selected={isAdminSection}
            className={cn(
              "flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-colors",
              isAdminSection
                ? "bg-bg-white-0 text-primary-base shadow-regular-xs"
                : "text-text-sub-600 hover:text-text-strong-950",
            )}
          >
            <ShieldCheck className="size-3.5" />
            Admin
          </Link>
        </div>
      </div>

      {/* Nav — 40px items, radius 8, soft blue active */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-1" aria-label="Primary">
        <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.11em] text-text-soft-400">{isAdminSection ? "Administration" : "Menu"}</p>
        {activeNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-10 items-center gap-2.5 rounded-xl px-2.5 text-[13px] font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base",
                isActive
                  ? "bg-information-lighter text-primary-base"
                  : "text-text-sub-600 hover:bg-bg-weak-50 hover:text-text-strong-950",
              )}
            >
              <Icon className={cn("size-4 shrink-0", isActive ? "text-primary-base" : "text-text-soft-400")} strokeWidth={1.5} />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Demo switcher */}
      <div className="mx-4 mb-3 rounded-xl border border-stroke-soft-200 bg-bg-weak-50 p-2.5">
        <p className="mb-2 px-1 text-xs font-medium leading-[18px] text-text-soft-400">Quick demo</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => switchDemoRole("member")}
            aria-pressed={currentUser?.email === "member@example.com"}
            className={cn(
              "h-8 rounded-md border px-2 text-left text-xs font-medium transition-colors",
              currentUser?.email === "member@example.com"
                ? "border-primary-base bg-primary-alpha-10 text-primary-base"
                : "border-stroke-soft-200 bg-bg-white-0 text-text-sub-600 hover:border-stroke-sub-300",
            )}
          >
            Member
          </button>
          <button
            onClick={() => switchDemoRole("admin")}
            aria-pressed={currentUser?.email === "admin@example.com"}
            className={cn(
              "h-8 rounded-md border px-2 text-left text-xs font-medium transition-colors",
              currentUser?.email === "admin@example.com"
                ? "border-primary-base bg-primary-alpha-10 text-primary-base"
                : "border-stroke-soft-200 bg-bg-white-0 text-text-sub-600 hover:border-stroke-sub-300",
            )}
          >
            Admin
          </button>
        </div>
      </div>

      {/* Account footer */}
      <div className="flex items-center justify-between border-t border-stroke-soft-200 p-4">
        {currentUser ? (
          <Link href="/my-profile" className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg p-1 -m-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base">
            <img src={currentUser.avatar} alt="" className="size-8 shrink-0 rounded-full object-cover bg-bg-weak-50 ring-1 ring-stroke-soft-200" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium leading-5 text-text-strong-950">{currentUser.name}</p>
              <p className="truncate text-xs leading-[18px] text-text-sub-600">{currentUser.role || "Member"}</p>
            </div>
          </Link>
        ) : (
          <span className="text-xs text-text-soft-400">Not logged in</span>
        )}
        <button
          onClick={logout}
          title="Sign out"
          aria-label="Sign out"
          className="ml-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-text-soft-400 transition-colors hover:bg-error-lighter hover:text-error-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base"
        >
          <LogOut className="size-4" strokeWidth={1.5} />
        </button>
      </div>
    </aside>
  );
}
