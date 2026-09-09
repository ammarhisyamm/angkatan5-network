"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HouseIcon, UsersIcon, BriefcaseIcon, UserIcon, ShieldCheckIcon, CalendarBlankIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils/cn";

const MEMBER_NAV = [
  { name: "Dashboard", short: "Home", href: "/dashboard", icon: HouseIcon },
  { name: "Discover People", short: "People", href: "/discover", icon: UsersIcon },
  { name: "Opportunities", short: "Jobs", href: "/opportunities", icon: BriefcaseIcon },
  { name: "Events", short: "Events", href: "/events", icon: CalendarBlankIcon },
  { name: "My Profile", short: "Profile", href: "/my-profile", icon: UserIcon },
];

const ADMIN_NAV = [
  { name: "Dashboard", short: "Home", href: "/admin/dashboard", icon: HouseIcon },
  { name: "Members", short: "Members", href: "/admin/members", icon: UsersIcon },
  { name: "Opportunities", short: "Jobs", href: "/admin/opportunities", icon: BriefcaseIcon },
  { name: "Skills", short: "Skills", href: "/admin/skills", icon: ShieldCheckIcon },
];

export function BottomNav() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const items = isAdmin ? ADMIN_NAV : MEMBER_NAV;

  return (
    <nav
      aria-label="Primary mobile"
      className="fixed inset-x-4 bottom-4 z-40 mx-auto w-fit max-w-[calc(100vw-2rem)] rounded-2xl border border-text-white-0/20 bg-bg-strong-950 p-2 shadow-regular-md lg:hidden"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch gap-1">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              item.href !== "/admin/dashboard" &&
              pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.name}
              title={item.name}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                // 48px touch target, full-height tap area
                "relative flex min-h-12 min-w-14 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 touch-manipulation",
                "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-white-0/70",
                isActive ? "bg-primary-base text-static-white shadow-sm" : "text-text-white-0/70 hover:bg-text-white-0/10 hover:text-text-white-0 active:bg-text-white-0/15",
              )}
            >
              <Icon className="size-5" weight={isActive ? "fill" : "regular"} aria-hidden="true" />
              <span className="text-[10px] font-medium leading-none">{item.short}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
