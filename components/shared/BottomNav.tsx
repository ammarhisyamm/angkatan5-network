"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HouseIcon, UsersIcon, BriefcaseIcon, UserIcon, ShieldCheckIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils/cn";

const MEMBER_NAV = [
  { name: "Dashboard", short: "Home", href: "/dashboard", icon: HouseIcon },
  { name: "Discover People", short: "People", href: "/discover", icon: UsersIcon },
  { name: "Opportunities", short: "Jobs", href: "/opportunities", icon: BriefcaseIcon },
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
      className="fixed inset-x-6 bottom-4 z-40 mx-auto max-w-[320px] rounded-2xl border border-white/10 bg-slate-950 p-3 shadow-[0_16px_32px_rgba(15,23,42,0.2)] backdrop-blur-xl lg:hidden"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex h-12 items-stretch gap-1">
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
                "relative flex min-h-12 flex-1 flex-col items-center justify-center gap-1 rounded-xl touch-manipulation",
                "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                isActive ? "bg-primary-base text-static-white shadow-sm" : "text-white/70 hover:bg-white/10 hover:text-white active:bg-white/15",
              )}
            >
              <Icon className="size-5" weight={isActive ? "fill" : "regular"} aria-hidden="true" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
