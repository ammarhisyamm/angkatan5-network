"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Briefcase, User, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function BottomNav() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  const memberNav = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "People", href: "/discover", icon: Users },
    { name: "Opportunities", href: "/opportunities", icon: Briefcase },
    { name: "Profile", href: "/my-profile", icon: User },
  ];

  const adminNav = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },
    { name: "Members", href: "/admin/members", icon: Users },
    { name: "Opportunities", href: "/admin/opportunities", icon: Briefcase },
    { name: "Skills", href: "/admin/skills", icon: ShieldCheck },
  ];

  const items = isAdmin ? adminNav : memberNav;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-stroke-soft-200 bg-bg-white-0 pb-safe">
      <div className="flex h-16 max-w-md mx-auto items-center justify-around px-2">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={cn("flex flex-1 flex-col items-center justify-center gap-1 py-1 text-subheading-2xs font-medium transition-colors min-h-[44px]", isActive ? "text-primary-base" : "text-text-soft-400 hover:text-text-sub-600")}>
              <Icon className={cn("size-5", isActive && "text-primary-base")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
