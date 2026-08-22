"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { Sidebar as KumoSidebar } from "@cloudflare/kumo/components/sidebar";
import { Button } from "@cloudflare/kumo/components/button";
import { HouseIcon, UsersIcon, BriefcaseIcon, UserCircleIcon, ShieldCheckIcon, ChartBarIcon, StackIcon, SignOutIcon } from "@phosphor-icons/react";

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser, logout } = useApp();
  const isAdminSection = pathname.startsWith("/admin");

  const memberNavItems = [
    { name: "Home", href: "/dashboard", icon: HouseIcon },
    { name: "Discover People", href: "/discover", icon: UsersIcon },
    { name: "Opportunities", href: "/opportunities", icon: BriefcaseIcon },
    { name: "My Profile", href: "/my-profile", icon: UserCircleIcon },
  ];
  const adminNavItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: HouseIcon },
    { name: "Members", href: "/admin/members", icon: UsersIcon },
    { name: "Opportunities", href: "/admin/opportunities", icon: BriefcaseIcon },
    { name: "Skills", href: "/admin/skills", icon: StackIcon },
    { name: "Analytics", href: "/admin/analytics", icon: ChartBarIcon },
  ];
  const activeNavItems = isAdminSection ? adminNavItems : memberNavItems;

  return (
    <KumoSidebar className="hidden lg:flex border-r border-kumo-line bg-kumo-base">
      <KumoSidebar.Header className="px-4 pt-5 pb-4 border-b border-kumo-line">
        <Link href="/dashboard" className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-focus">
          <div className="flex size-9 items-center justify-center rounded-lg bg-kumo-brand text-sm font-semibold text-white">A5</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-5 text-kumo-strong">A5 Network</p>
            <p className="truncate text-xs leading-[18px] text-kumo-subtle">Private Talent Directory</p>
          </div>
        </Link>

        {/* Role switcher — quiet segmented, now with Kumo tokens */}
        <div className="mt-4 flex items-center gap-1 rounded-md bg-kumo-tint border border-kumo-line p-1" role="tablist" aria-label="Workspace role">
          <Link
            href="/dashboard"
            role="tab"
            aria-selected={!isAdminSection}
            className={`flex h-8 flex-1 items-center justify-center rounded-md text-xs font-medium transition-colors ${!isAdminSection ? "bg-kumo-base ring-1 ring-kumo-line text-kumo-brand shadow-xs" : "text-kumo-subtle hover:text-kumo-strong"}`}
          >
            Member
          </Link>
          <Link
            href="/admin/dashboard"
            role="tab"
            aria-selected={isAdminSection}
            className={`flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-colors ${isAdminSection ? "bg-kumo-base ring-1 ring-kumo-line text-kumo-brand shadow-xs" : "text-kumo-subtle hover:text-kumo-strong"}`}
          >
            <ShieldCheckIcon className="size-3.5" />
            Admin
          </Link>
        </div>
      </KumoSidebar.Header>

      <KumoSidebar.Content className="px-3 py-4">
        <KumoSidebar.Group>
          <KumoSidebar.GroupLabel className="px-2 pb-2 text-xs font-medium text-kumo-inactive uppercase tracking-wide">
            {isAdminSection ? "Administration" : "Menu"}
          </KumoSidebar.GroupLabel>
          <KumoSidebar.Menu>
            {activeNavItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon as any;
              return (
                <KumoSidebar.MenuButton key={item.href} icon={Icon} active={isActive} href={item.href} tooltip={item.name} className={isActive ? "bg-kumo-tint text-kumo-brand" : "text-kumo-subtle"}>
                  {item.name}
                </KumoSidebar.MenuButton>
              );
            })}
          </KumoSidebar.Menu>
        </KumoSidebar.Group>
      </KumoSidebar.Content>

      <KumoSidebar.Footer className="border-t border-kumo-line p-3">
        <div className="flex items-center justify-between gap-2">
          {currentUser ? (
            <Link href="/my-profile" className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg p-1 -m-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-focus">
              <img src={currentUser.avatar} alt="" className="size-9 shrink-0 rounded-full object-cover bg-kumo-tint ring-1 ring-kumo-line" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium leading-5 text-kumo-strong">{currentUser.name}</p>
                <p className="truncate text-xs leading-[18px] text-kumo-subtle">{currentUser.role || "Member"}</p>
              </div>
            </Link>
          ) : (
            <span className="text-xs text-kumo-inactive">Not logged in</span>
          )}
          <Button variant="ghost" shape="square" size="xs" onClick={logout} aria-label="Sign out" icon={<SignOutIcon />} className="text-kumo-inactive hover:text-kumo-strong" />
        </div>
      </KumoSidebar.Footer>
    </KumoSidebar>
  );
}
