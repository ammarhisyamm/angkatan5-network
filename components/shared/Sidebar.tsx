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
  ArrowsLeftRightIcon,
} from "@phosphor-icons/react";

function SidebarInner() {
  const pathname = usePathname();
  const { currentUser, logout, users, opportunities, switchUser } = useApp();
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

  const otherUsers = users.filter((u) => u.id !== currentUser?.id).slice(0, 3);

  return (
    <KumoSidebar className="hidden lg:flex border-r border-kumo-line bg-white shadow-[2px_0_12px_rgba(0,0,0,0.04)]">
      <KumoSidebar.Header className="sticky top-0 z-10 bg-white px-2.5 pt-3 pb-3 border-b border-kumo-line/60 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <Link href="/dashboard" className="flex items-center gap-2.5 rounded-lg px-1 py-1 -mx-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand min-w-0 flex-1">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#6366F1] text-white font-bold text-xs tracking-tight shrink-0 shadow-sm">A5</div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-4 text-kumo-strong tracking-tight">A5 Network</p>
                <p className="text-[11px] leading-3 text-kumo-inactive">Private Directory</p>
              </div>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex size-7 items-center justify-center rounded-md border border-kumo-line bg-white text-kumo-inactive hover:bg-kumo-tint hover:text-kumo-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand shrink-0"
          >
            {isCollapsed ? <CaretRightIcon size={14} /> : <CaretLeftIcon size={14} />}
          </button>
        </div>

        {!isCollapsed && (
          <div className="flex flex-col gap-2.5">
            <div className="relative">
              <MagnifyingGlassIcon size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-kumo-inactive" aria-hidden="true" />
              <input
                placeholder="Quick search"
                aria-label="Quick search"
                className="w-full h-8 pl-8 pr-2.5 bg-white border border-kumo-line rounded-lg text-xs text-kumo-strong placeholder:text-kumo-inactive focus:outline-none focus:border-kumo-brand focus:ring-2 focus:ring-kumo-brand/20 transition-colors"
              />
            </div>

            <div className="flex items-center gap-0.5 rounded-lg bg-kumo-tint border border-kumo-line p-0.5" role="tablist" aria-label="Workspace">
              <Link
                href="/dashboard"
                role="tab"
                aria-selected={!isAdminSection}
                className={`flex h-7 flex-1 items-center justify-center rounded-md text-xs font-medium transition-colors ${!isAdminSection ? "bg-white ring-1 ring-kumo-line text-[#6366F1] shadow-sm" : "text-kumo-subtle hover:text-kumo-strong"}`}
              >
                Member
              </Link>
              <Link
                href="/admin/dashboard"
                role="tab"
                aria-selected={isAdminSection}
                className={`flex h-7 flex-1 items-center justify-center gap-1 rounded-md text-xs font-medium transition-colors ${isAdminSection ? "bg-white ring-1 ring-kumo-line text-[#6366F1] shadow-sm" : "text-kumo-subtle hover:text-kumo-strong"}`}
              >
                <ShieldCheckIcon size={12} />
                Admin
              </Link>
            </div>
          </div>
        )}
      </KumoSidebar.Header>

      <KumoSidebar.Content className="px-2 py-3 flex-1 overflow-y-auto">
        {Object.entries(grouped).map(([group, items]: any) => (
          <KumoSidebar.Group key={group} className="mb-4 last:mb-0">
            {!isCollapsed && (
              <KumoSidebar.GroupLabel className="px-2 pb-1.5 text-[10px] font-semibold tracking-widest uppercase text-kumo-inactive">
                {group}
              </KumoSidebar.GroupLabel>
            )}
            <KumoSidebar.Menu className="space-y-px">
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
                    <span className="flex-1 text-left truncate text-[13px]">{item.name}</span>
                    {!isCollapsed && item.count !== null && (
                      <span className={`ml-auto text-[11px] font-medium tabular-nums ${isActive ? "text-[#6366F1]" : "text-kumo-inactive"}`}>{item.count}</span>
                    )}
                  </KumoSidebar.MenuButton>
                );
              })}
            </KumoSidebar.Menu>
          </KumoSidebar.Group>
        ))}
      </KumoSidebar.Content>

      <KumoSidebar.Footer className="sticky bottom-0 z-10 bg-white border-t border-kumo-line/60 p-2.5">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex w-full items-center gap-2.5 rounded-lg p-1.5 hover:bg-kumo-tint transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand text-left"
            aria-expanded={showUserMenu}
            aria-haspopup="menu"
          >
            <img
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60"}
              alt={currentUser?.name || "User"}
              width={32}
              height={32}
              className="size-8 shrink-0 rounded-full object-cover bg-kumo-tint ring-1 ring-kumo-line"
            />
            {!isCollapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold leading-4 text-kumo-strong">{currentUser?.name || "Member"}</p>
                  <p className="truncate text-[11px] leading-3 text-kumo-inactive">{isAdminSection ? "Admin" : "Member"}</p>
                </div>
                <span className="text-kumo-inactive">
                  <CaretLeftIcon size={10} className={showUserMenu ? "rotate-90" : "-rotate-90"} />
                </span>
              </>
            )}
          </button>

          {showUserMenu && !isCollapsed && (
            <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border border-kumo-line bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-1.5 z-50" role="menu">
              <div className="px-2.5 py-2 border-b border-kumo-line/60 mb-1.5">
                <p className="text-[13px] font-semibold text-kumo-strong truncate">{currentUser?.name || "Member"}</p>
                <p className="text-[11px] text-kumo-inactive truncate">{currentUser?.email || ""}</p>
              </div>

              {otherUsers.length > 0 && (
                <>
                  <div className="px-2.5 py-1.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-kumo-inactive mb-1.5">Switch Account</p>
                    <div className="space-y-0.5">
                      {otherUsers.map((user) => (
                        <button
                          key={user.id}
                          role="menuitem"
                          onClick={() => { switchUser(user.id); setShowUserMenu(false); }}
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-kumo-subtle hover:bg-kumo-tint hover:text-kumo-strong text-left transition-colors"
                        >
                          <img src={user.avatar} alt="" className="size-6 rounded-full object-cover ring-1 ring-kumo-line" />
                          <span className="truncate flex-1">{user.name}</span>
                          <ArrowsLeftRightIcon size={12} className="text-kumo-inactive shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-kumo-line/60 my-1" />
                </>
              )}

              <Link href="/my-profile" role="menuitem" className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] text-kumo-subtle hover:bg-kumo-tint hover:text-kumo-strong text-left">
                <UserIcon size={14} /> Profile
              </Link>
              <button role="menuitem" className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] text-kumo-subtle hover:bg-kumo-tint hover:text-kumo-strong text-left">
                <GearIcon size={14} /> Preferences
              </button>
              <button role="menuitem" className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] text-kumo-subtle hover:bg-kumo-tint hover:text-kumo-strong text-left">
                <BellIcon size={14} /> Notifications
              </button>
              <div className="border-t border-kumo-line/60 my-1" />
              <button role="menuitem" onClick={logout} className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] text-kumo-subtle hover:bg-kumo-tint hover:text-kumo-strong text-left">
                <SignOutIcon size={14} /> Sign Out
              </button>
            </div>
          )}

          {isCollapsed && (
            <div className="mt-1.5 flex justify-center">
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
