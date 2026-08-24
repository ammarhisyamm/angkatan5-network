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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-kumo-line bg-kumo-base lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex h-16 max-w-md items-stretch px-2">
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
              aria-current={isActive ? "page" : undefined}
              className={cn(
                // 48px touch target, full-height tap area
                "relative flex min-h-12 flex-1 flex-col items-center justify-center gap-1 rounded-lg touch-manipulation",
                "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand",
                isActive ? "text-kumo-brand" : "text-kumo-inactive active:text-kumo-subtle",
              )}
            >
              {/* Active pill behind icon */}
              <span
                aria-hidden="true"
                className={cn(
                  "flex h-7 w-12 items-center justify-center rounded-full transition-colors duration-200",
                  isActive && "bg-primary-alpha-10",
                )}
              >
                <Icon className="size-5" strokeWidth={isActive ? 2 : 1.5} />
              </span>
              <span className={cn("text-xs font-medium leading-none", isActive && "font-semibold")}>
                {item.short}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
