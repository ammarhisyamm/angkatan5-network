"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { Sidebar as KumoSidebar, useSidebar } from "@cloudflare/kumo/components/sidebar";
import { Button } from "@cloudflare/kumo/components/button";
import {
  HouseIcon,
  UsersIcon,
  BriefcaseIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  StackIcon,
  MagnifyingGlassIcon,
  CaretLeftIcon,
  CaretRightIcon,
  SignOutIcon,
  GearIcon,
  BellIcon,
  UserIcon,
} from "@phosphor-icons/react";

function SidebarInner() {
  const pathname = usePathname();
  const { currentUser, logout, users, opportunities } = useApp();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isAdminSection = pathname.startsWith("/admin");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const memberCounts: Record<string, number | null> = {
    "/discover": users.length,
    "/opportunities": opportunities.filter((o) => o.status === "Published").length,
  };
  const adminCounts: Record<string, number | null> = {
    "/admin/members": users.length,
    "/admin/opportunities": opportunities.length,
  };

  const memberNav = [
    { name: "Home", href: "/dashboard", icon: HouseIcon, group: "Overview", count: null },
    { name: "Discover People", href: "/discover", icon: UsersIcon, group: "Overview", count: memberCounts["/discover"] },
    { name: "Opportunities", href: "/opportunities", icon: BriefcaseIcon, group: "Overview", count: memberCounts["/opportunities"] },
    { name: "My Profile", href: "/my-profile", icon: UserCircleIcon, group: "Overview", count: null },
  ];
  const adminNav = [
    { name: "Dashboard", href: "/admin/dashboard", icon: HouseIcon, group: "Overview", count: null },
    { name: "Members", href: "/admin/members", icon: UsersIcon, group: "Projects", count: adminCounts["/admin/members"] },
    { name: "Opportunities", href: "/admin/opportunities", icon: BriefcaseIcon, group: "Projects", count: adminCounts["/admin/opportunities"] },
    { name: "Skills", href: "/admin/skills", icon: StackIcon, group: "Projects", count: null },
    { name: "Analytics", href: "/admin/analytics", icon: ChartBarIcon, group: "Analytics", count: null },
  ];
  const navItems = isAdminSection ? adminNav : memberNav;
  const grouped = navItems.reduce((acc: any, item) => {
    (acc[item.group] = acc[item.group] || []).push(item);
    return acc;
  }, {});

  return (
    <KumoSidebar className="hidden lg:flex border-r border-kumo-line bg-white shadow-[2px_0_12px_rgba(0,0,0,0.04)]">
      <KumoSidebar.Header className="px-4 pt-4 pb-4 border-b border-kumo-line/60 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <Link href="/dashboard" className="flex items-center gap-3 rounded-xl px-1 py-1 -mx-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand min-w-0 flex-1">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#6366F1] text-white font-bold text-sm tracking-tight shrink-0 shadow-sm">A5</div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-[18px] text-kumo-strong tracking-tight">A5 Network</p>
                <p className="text-xs leading-4 text-kumo-inactive">Private Directory</p>
              </div>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex size-8 items-center justify-center rounded-lg border border-kumo-line bg-white text-kumo-inactive hover:bg-kumo-tint hover:text-kumo-strong hover:border-kumo-line transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand shrink-0 shadow-xs"
          >
            {isCollapsed ? <CaretRightIcon size={16} /> : <CaretLeftIcon size={16} />}
          </button>
        </div>

        {!isCollapsed && (
          <div className="flex flex-col gap-3">
            <div className="relative">
              <MagnifyingGlassIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-kumo-inactive" aria-hidden="true" />
              <input
                placeholder="Quick search"
                aria-label="Quick search"
                className="w-full h-9 pl-9 pr-3 bg-white border border-kumo-line rounded-xl text-sm text-kumo-strong placeholder:text-kumo-inactive focus:outline-none focus:border-kumo-brand focus:ring-2 focus:ring-kumo-brand/20 transition-colors"
              />
            </div>

            <div className="flex items-center gap-1 rounded-xl bg-kumo-tint border border-kumo-line p-1" role="tablist" aria-label="Workspace">
              <Link
                href="/dashboard"
                role="tab"
                aria-selected={!isAdminSection}
                className={`flex h-8 flex-1 items-center justify-center rounded-lg text-sm font-medium transition-colors ${!isAdminSection ? "bg-white ring-1 ring-kumo-line text-[#6366F1] shadow-sm" : "text-kumo-subtle hover:text-kumo-strong"}`}
              >
                Member
              </Link>
              <Link
                href="/admin/dashboard"
                role="tab"
                aria-selected={isAdminSection}
                className={`flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-colors ${isAdminSection ? "bg-white ring-1 ring-kumo-line text-[#6366F1] shadow-sm" : "text-kumo-subtle hover:text-kumo-strong"}`}
              >
                <ShieldCheckIcon size={14} />
                Admin
              </Link>
            </div>
          </div>
        )}
      </KumoSidebar.Header>

      <KumoSidebar.Content className="px-3 py-4 flex-1 overflow-y-auto">
        {Object.entries(grouped).map(([group, items]: any) => (
          <KumoSidebar.Group key={group} className="mb-5 last:mb-0">
            {!isCollapsed && (
              <KumoSidebar.GroupLabel className="px-2.5 pb-2 text-xs font-semibold tracking-widest uppercase text-kumo-inactive">
                {group}
              </KumoSidebar.GroupLabel>
            )}
            <KumoSidebar.Menu className="space-y-0.5">
              {items.map((item: any) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <KumoSidebar.MenuButton
                    key={item.href}
                    icon={Icon}
                    active={isActive}
                    href={item.href}
                    tooltip={item.name}
                    className={`group/item relative ${isActive ? "bg-[#EEF2FF] text-[#6366F1]" : "text-kumo-subtle hover:bg-kumo-tint hover:text-kumo-strong"} ${isCollapsed ? "justify-center" : ""}`}
                  >
                    <span className="flex-1 text-left truncate text-sm">{item.name}</span>
                    {!isCollapsed && item.count !== null && (
                      <span className={`ml-auto text-xs font-medium tabular-nums ${isActive ? "text-[#6366F1]" : "text-kumo-inactive"}`}>{item.count}</span>
                    )}
                    {isActive && !isCollapsed && <span className="absolute right-2 size-1.5 rounded-full bg-[#6366F1]" aria-hidden="true" />}
                  </KumoSidebar.MenuButton>
                );
              })}
            </KumoSidebar.Menu>
          </KumoSidebar.Group>
        ))}
      </KumoSidebar.Content>

      <KumoSidebar.Footer className="border-t border-kumo-line/60 p-3">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex w-full items-center gap-3 rounded-xl p-2 hover:bg-kumo-tint transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand text-left"
            aria-expanded={showUserMenu}
            aria-haspopup="menu"
          >
            <img
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60"}
              alt={currentUser?.name || "User"}
              width={36}
              height={36}
              className="size-9 shrink-0 rounded-full object-cover bg-kumo-tint ring-1 ring-kumo-line"
            />
            {!isCollapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold leading-4 text-kumo-strong">{currentUser?.name || "Member"}</p>
                  <p className="truncate text-xs leading-3 text-kumo-inactive">{isAdminSection ? "Admin" : "Member"}</p>
                </div>
                <span className="text-kumo-inactive">
                  <CaretLeftIcon size={12} className={showUserMenu ? "rotate-90" : "-rotate-90"} />
                </span>
              </>
            )}
          </button>

          {showUserMenu && !isCollapsed && (
            <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border border-kumo-line bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-2 z-50" role="menu">
              <div className="px-3 py-2 border-b border-kumo-line/60 mb-2">
                <p className="text-sm font-semibold text-kumo-strong truncate">{currentUser?.name || "Member"}</p>
                <p className="text-xs text-kumo-inactive truncate">{currentUser?.email || ""}</p>
              </div>
              <Link href="/my-profile" role="menuitem" className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-kumo-subtle hover:bg-kumo-tint hover:text-kumo-strong text-left">
                <UserIcon size={16} /> Profile
              </Link>
              <button role="menuitem" className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-kumo-subtle hover:bg-kumo-tint hover:text-kumo-strong text-left">
                <GearIcon size={16} /> Preferences
              </button>
              <button role="menuitem" className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-kumo-subtle hover:bg-kumo-tint hover:text-kumo-strong text-left">
                <BellIcon size={16} /> Notifications
              </button>
              <div className="border-t border-kumo-line/60 my-2" />
              <button role="menuitem" onClick={logout} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-kumo-subtle hover:bg-kumo-tint hover:text-kumo-strong text-left">
                <SignOutIcon size={16} /> Sign Out
              </button>
            </div>
          )}

          {isCollapsed && (
            <div className="mt-2 flex justify-center">
              <Button variant="ghost" shape="square" size="sm" onClick={logout} aria-label="Sign out" icon={<SignOutIcon />} className="text-kumo-inactive" />
            </div>
          )}
        </div>
      </KumoSidebar.Footer>
    </KumoSidebar>
  );
}

export function Sidebar() {
  return <SidebarInner />;
}
