"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { Home, Users, Briefcase, UserCheck, ShieldCheck, LogOut } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser, logout } = useApp();
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
    { name: "Skills", href: "/admin/skills", icon: ShieldCheck },
    { name: "Analytics", href: "/admin/analytics", icon: Briefcase },
  ];
  const activeNavItems = isAdminSection ? adminNavItems : memberNavItems;

  return (
    <aside className="hidden lg:flex w-[264px] h-screen sticky top-0 shrink-0 flex-col border-r border-stroke-soft-200 bg-bg-white-0 select-none z-30">
      {/* Brand */}
      <div className="px-4 pt-5 pb-4 border-b border-stroke-soft-200">
        <Link href="/dashboard" className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary-base text-sm font-semibold text-static-white">A5</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-5 text-text-strong-950">A5 Network</p>
            <p className="truncate text-xs leading-[18px] text-text-sub-600">Private Talent Directory</p>
          </div>
        </Link>

        {/* Role switcher — quiet segmented */}
        <div className="mt-4 flex items-center gap-1 rounded-md bg-bg-weak-25 border border-stroke-soft-200 p-1" role="tablist" aria-label="Workspace role">
          <Link
            href="/dashboard"
            role="tab"
            aria-selected={!isAdminSection}
            className={cn(
              "flex h-8 flex-1 items-center justify-center rounded-md text-xs font-medium transition-colors",
              !isAdminSection
                ? "bg-bg-white-0 ring-1 ring-stroke-soft-200 text-primary-base shadow-xs"
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
                ? "bg-bg-white-0 ring-1 ring-stroke-soft-200 text-primary-base shadow-xs"
                : "text-text-sub-600 hover:text-text-strong-950",
            )}
          >
            <ShieldCheck className="size-3.5" />
            Admin
          </Link>
        </div>
      </div>

      {/* Nav — 44px rows, radius 8, primary-alpha-10 active */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1" aria-label="Primary">
        <p className="px-2 pb-2 text-xs font-medium leading-[18px] text-text-soft-400 uppercase tracking-wide">
          {isAdminSection ? "Administration" : "Menu"}
        </p>
        {activeNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base",
                isActive
                  ? "bg-primary-alpha-10 text-primary-base"
                  : "text-text-sub-600 hover:bg-bg-weak-25 hover:text-text-strong-950",
              )}
            >
              <Icon className={cn("size-4.5 shrink-0", isActive ? "text-primary-base" : "text-text-soft-400")} strokeWidth={1.5} />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Account footer — anchored bottom */}
      <div className="flex items-center justify-between border-t border-stroke-soft-200 p-3">
        {currentUser ? (
          <Link href="/my-profile" className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg p-1 -m-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base">
            <img src={currentUser.avatar} alt="" className="size-9 shrink-0 rounded-full object-cover bg-bg-weak-50 ring-1 ring-stroke-soft-200" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium leading-5 text-text-strong-950">{currentUser.name}</p>
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
          className="ml-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-text-soft-400 transition-colors hover:bg-bg-weak-25 hover:text-text-strong-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base"
        >
          <LogOut className="size-4" strokeWidth={1.5} />
        </button>
      </div>
    </aside>
  );
}