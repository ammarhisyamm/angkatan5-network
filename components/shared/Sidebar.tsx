"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { Sidebar as KumoSidebar, useSidebar } from "@cloudflare/kumo/components/sidebar";
import { Button } from "@cloudflare/kumo/components/button";
import {
  HouseIcon,
  UsersIcon,
  BriefcaseIcon,
  ChartBarIcon,
  StackIcon,
  MagnifyingGlassIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretDoubleLeftIcon,
  CaretDownIcon,
  SignOutIcon,
  GearIcon,
  BellIcon,
  UserIcon,
  ArrowsLeftRightIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react";

function SidebarInner() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, users, opportunities, switchUser } = useApp();
  const { state, open, setOpen } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isAdminSection = pathname.startsWith("/admin");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleSidebar = () => setOpen(!open);

  const adminCounts: Record<string, number | null> = {
    "/admin/members": users.length,
    "/admin/opportunities": opportunities.length,
  };

  const adminNav = [
    { name: "Dashboard", href: "/admin/dashboard", icon: HouseIcon, group: "General", count: null },
    { name: "Members", href: "/admin/members", icon: UsersIcon, group: "General", count: adminCounts["/admin/members"] },
    { name: "Opportunities", href: "/admin/opportunities", icon: BriefcaseIcon, group: "General", count: adminCounts["/admin/opportunities"] },
    { name: "Skills", href: "/admin/skills", icon: StackIcon, group: "Tools", count: null },
    { name: "Analytics", href: "/admin/analytics", icon: ChartBarIcon, group: "Tools", count: null },
  ];

  const grouped = adminNav.reduce((acc: any, item) => {
    (acc[item.group] = acc[item.group] || []).push(item);
    return acc;
  }, {});

  const otherUsers = users.filter((u) => u.id !== currentUser?.id).slice(0, 3);

  return (
    <KumoSidebar className="bg-white border-r border-zinc-200 [--sidebar-width-icon:72px]">
      {/* Header — Logo + Collapse */}
      <KumoSidebar.Header className="bg-white px-4 pt-4 pb-3 border-b-0 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 rounded-xl px-1 py-1 -mx-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand focus-visible:ring-offset-2 min-w-0 flex-1"
            aria-label="A5 Network"
          >
            {/* Shopall-style blue 4-dot logo — adapted for A5 */}
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#2563EB] shadow-sm">
              <div className="grid grid-cols-2 gap-[3px]">
                <span className="size-[7px] rounded-full bg-white/90" />
                <span className="size-[7px] rounded-full bg-white/90" />
                <span className="size-[7px] rounded-full bg-white/90" />
                <span className="size-[7px] rounded-full bg-white" />
              </div>
            </div>
            {!isCollapsed && (
              <span className="text-[15px] font-semibold tracking-tight text-[#111827]">A5 Network</span>
            )}
          </Link>

          {!isCollapsed && (
            <button
              onClick={toggleSidebar}
              aria-label="Collapse sidebar"
              className="flex size-7 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand shrink-0 transition-colors"
            >
              <CaretDoubleLeftIcon size={14} weight="bold" />
            </button>
          )}
          {isCollapsed && (
            <button
              onClick={toggleSidebar}
              aria-label="Expand sidebar"
              className="flex size-7 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand shrink-0 transition-colors"
            >
              <CaretRightIcon size={14} weight="bold" />
            </button>
          )}
        </div>

        {/* Workspace — Stores style selector */}
        {!isCollapsed ? (
          <div className="flex flex-col gap-3">
            <div>
              <p className="px-1 pb-1.5 text-[12px] font-medium text-zinc-500">Stores</p>
              <div
                role="tablist"
                aria-label="Workspace"
                className="flex items-center gap-1 rounded-xl bg-zinc-50 border border-zinc-200 p-1"
              >
                <Link
                  href="/dashboard"
                  role="tab"
                  aria-selected={!isAdminSection}
                  className={`flex-1 flex items-center gap-2 rounded-lg px-3 h-8 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand ${
                    !isAdminSection ? "bg-white border border-zinc-200 shadow-sm text-[#111827]" : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <span className="flex size-6 items-center justify-center rounded-md bg-[#E0EAFF] text-[#2563EB] text-[11px] font-bold">M</span>
                  Member
                </Link>
                <Link
                  href="/admin/dashboard"
                  role="tab"
                  aria-selected={isAdminSection}
                  className={`flex-1 flex items-center gap-2 rounded-lg px-3 h-8 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand ${
                    isAdminSection ? "bg-white border border-zinc-200 shadow-sm text-[#111827]" : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <span className="flex size-6 items-center justify-center rounded-md bg-[#111827] text-white">
                    <ShieldCheckIcon size={12} weight="fill" />
                  </span>
                  Admin
                </Link>
              </div>
            </div>

            {/* Quick search — hidden in screenshot but kept per spec, styled minimal */}
            <div className="relative">
              <MagnifyingGlassIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
              <input
                placeholder="Quick search"
                aria-label="Quick search"
                className="w-full h-9 pl-9 pr-3 bg-white border border-zinc-200 rounded-xl text-[13px] text-zinc-900 placeholder:text-zinc-400 outline-none hover:border-zinc-300 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-colors"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 pt-1">
            <Link
              href="/dashboard"
              aria-label="Member"
              title="Member"
              className={`flex size-9 items-center justify-center rounded-xl border transition-colors ${
                !isAdminSection ? "bg-white border-zinc-200 shadow-sm text-[#111827]" : "border-transparent text-zinc-500 hover:bg-zinc-50"
              }`}
            >
              <span className="flex size-6 items-center justify-center rounded-md bg-[#E0EAFF] text-[#2563EB] text-[11px] font-bold">M</span>
            </Link>
            <Link
              href="/admin/dashboard"
              aria-label="Admin"
              title="Admin"
              className={`flex size-9 items-center justify-center rounded-xl border transition-colors ${
                isAdminSection ? "bg-white border-zinc-200 shadow-sm text-[#111827]" : "border-transparent text-zinc-500 hover:bg-zinc-50"
              }`}
            >
              <span className="flex size-6 items-center justify-center rounded-md bg-[#111827] text-white">
                <ShieldCheckIcon size={12} weight="fill" />
              </span>
            </Link>
          </div>
        )}
      </KumoSidebar.Header>

      {/* Navigation */}
      <KumoSidebar.Content className="px-3 py-4 flex-1 overflow-y-auto">
        {Object.entries(grouped).map(([group, items]: any, gi) => (
          <div key={group} className={gi !== 0 ? "mt-6 pt-6 border-t border-zinc-100" : ""}>
            {!isCollapsed && (
              <p className="px-3 pb-2 text-[12px] font-medium text-zinc-500">{group}</p>
            )}
            <KumoSidebar.Menu className="space-y-0.5">
              {items.map((item: any) => {
                const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <KumoSidebar.MenuButton
                    key={item.href}
                    active={isActive}
                    href={item.href}
                    title={isCollapsed ? `${item.name}${item.count !== null ? ` (${item.count})` : ""}` : undefined}
                    className={`group/item relative flex h-9 items-center gap-3 rounded-xl px-3 text-[13.5px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand focus-visible:ring-offset-0 ${
                      isActive ? "bg-white text-[#111827] font-medium" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 font-normal"
                    } ${isCollapsed ? "!justify-center !px-0" : ""}`}
                  >
                    <span className={`shrink-0 flex size-5 items-center justify-center ${isActive ? "text-[#111827]" : "text-zinc-500 group-hover/item:text-zinc-700"}`}>
                      <Icon size={18} weight={isActive ? "fill" : "regular"} />
                    </span>

                    {!isCollapsed ? (
                      <>
                        <span className={`flex-1 truncate text-left ${isActive ? "text-[#111827] font-semibold" : "text-zinc-600"}`}>{item.name}</span>
                        {item.count !== null && (
                          <span
                            className={`shrink-0 min-w-[22px] h-[22px] px-1 flex items-center justify-center rounded-md border text-[11px] font-medium tabular-nums ${
                              isActive ? "bg-white border-zinc-200 text-zinc-700" : "bg-white border-zinc-200 text-zinc-600"
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </>
                    ) : (
                      item.count !== null && (
                        <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-[#2563EB] ring-2 ring-white" aria-hidden="true" />
                      )
                    )}
                  </KumoSidebar.MenuButton>
                );
              })}
            </KumoSidebar.Menu>
          </div>
        ))}

      </KumoSidebar.Content>

      {/* User card — bottom */}
      <KumoSidebar.Footer className="bg-white border-t border-zinc-100 p-3">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`flex w-full items-center gap-3 rounded-xl p-2 hover:bg-zinc-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand ${isCollapsed ? "justify-center" : ""}`}
            aria-expanded={showUserMenu}
            aria-haspopup="menu"
          >
            <img
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60"}
              alt=""
              width={32}
              height={32}
              className="size-8 shrink-0 rounded-full object-cover ring-1 ring-zinc-200"
            />
            {!isCollapsed && (
              <>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-[13px] font-semibold leading-4 text-[#111827]">{currentUser?.name || "Admin Angkatan 5"}</p>
                  <p className="truncate text-[11px] leading-3 text-zinc-500">{currentUser?.email || "admin@angkatan5.id"}</p>
                </div>
                <CaretDownIcon size={12} weight="bold" className={`shrink-0 text-zinc-400 transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
              </>
            )}
          </button>

          {showUserMenu && !isCollapsed && (
            <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border border-zinc-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-1.5 z-50" role="menu">
              <div className="px-3 py-2.5 border-b border-zinc-100 mb-1.5">
                <p className="truncate text-[13px] font-semibold text-[#111827]">{currentUser?.name || "Admin Angkatan 5"}</p>
                <p className="truncate text-[11px] text-zinc-500">{currentUser?.email || "admin@angkatan5.id"}</p>
              </div>

              {otherUsers.length > 0 && (
                <>
                  <div className="px-2 py-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-1.5">Switch Account</p>
                    <div className="space-y-0.5">
                      {otherUsers.map((user) => (
                        <button
                          key={user.id}
                          role="menuitem"
                          onClick={() => {
                            switchUser(user.id);
                            setShowUserMenu(false);
                          }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 text-left transition-colors"
                        >
                          <img src={user.avatar} alt="" className="size-7 rounded-full object-cover ring-1 ring-zinc-200" />
                          <span className="truncate flex-1 font-medium">{user.name}</span>
                          <ArrowsLeftRightIcon size={12} className="text-zinc-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-zinc-100 my-1" />
                </>
              )}

              <button
                role="menuitem"
                onClick={() => {
                  router.push("/my-profile");
                  setShowUserMenu(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 text-left transition-colors"
              >
                <UserIcon size={14} /> Profile
              </button>
              <button
                role="menuitem"
                onClick={() => setShowUserMenu(false)}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 text-left transition-colors"
              >
                <GearIcon size={14} /> Preferences
              </button>
              <button
                role="menuitem"
                onClick={() => setShowUserMenu(false)}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 text-left transition-colors"
              >
                <BellIcon size={14} /> Notifications
              </button>
              <div className="border-t border-zinc-100 my-1" />
              <button
                role="menuitem"
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 text-left transition-colors"
              >
                <SignOutIcon size={14} /> Sign Out
              </button>
            </div>
          )}

          {isCollapsed && (
            <div className="mt-2 flex justify-center">
              <Button
                variant="ghost"
                shape="square"
                size="sm"
                onClick={logout}
                aria-label="Sign out"
                title="Sign out"
                icon={<SignOutIcon size={16} />}
                className="text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50"
              />
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
