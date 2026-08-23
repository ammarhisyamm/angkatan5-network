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
  CaretDownIcon,
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
    { name: "Dashboard", href: "/admin/dashboard", icon: HouseIcon, group: "Overview", count: null },
    { name: "Members", href: "/admin/members", icon: UsersIcon, group: "Projects", count: adminCounts["/admin/members"] },
    { name: "Opportunities", href: "/admin/opportunities", icon: BriefcaseIcon, group: "Projects", count: adminCounts["/admin/opportunities"] },
    { name: "Skills", href: "/admin/skills", icon: StackIcon, group: "Projects", count: null },
    { name: "Analytics", href: "/admin/analytics", icon: ChartBarIcon, group: "Analytics", count: null },
  ];

  const navItems = adminNav;
  const grouped = navItems.reduce((acc: any, item) => {
    (acc[item.group] = acc[item.group] || []).push(item);
    return acc;
  }, {});

  const otherUsers = users.filter((u) => u.id !== currentUser?.id).slice(0, 3);

  const getIconColor = (active: boolean) => active ? "text-kumo-brand" : "text-kumo-inactive";
  const getIconBg = (active: boolean) => active ? "bg-primary-alpha-10" : "bg-transparent";
  const getHoverBg = (active: boolean) => active ? "hover:bg-primary-alpha-10" : "hover:bg-kumo-tint";
  const getTextColor = (active: boolean) => active ? "text-kumo-brand" : "text-kumo-strong";

  return (
    <KumoSidebar
      className="bg-white border-r border-kumo-line shadow-[2px_0_12px_rgba(0,0,0,0.03)]"
    >
      <KumoSidebar.Header className="sticky top-0 z-10 bg-white border-b border-kumo-line px-5 py-4 flex flex-col gap-4">
        {/* Brand + Collapse Toggle */}
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 rounded-lg px-2 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand focus-visible:ring-offset-2 -mx-2 -my-2 min-w-0 flex-1"
            aria-label="A5 Network Home"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-kumo-brand text-white font-bold text-xs tracking-tight shadow-sm">
              A5
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="text-sm font-semibold leading-4 text-kumo-strong truncate">A5 Network</p>
                <p className="text-xs leading-3 text-kumo-inactive truncate">Private Directory</p>
              </div>
            )}
          </Link>
          <button
              onClick={toggleSidebar}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-transparent text-kumo-inactive hover:bg-kumo-tint hover:text-kumo-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand focus-visible:ring-offset-2 transition-colors duration-150"
            >
              {isCollapsed ? <CaretRightIcon size={16} /> : <CaretLeftIcon size={16} />}
            </button>
        </div>

        {/* Workspace Switcher + Search */}
        {!isCollapsed && (
          <div className="flex flex-col gap-3 pt-1">
            {/* Workspace Switcher */}
            <div>
              <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-kumo-inactive">Workspace</p>
              <div className="mt-1.5 flex items-center gap-0.5 rounded-lg bg-kumo-tint/50 border border-kumo-line/50 p-0.5" role="tablist" aria-label="Workspace">
                <Link
                  href="/admin/dashboard"
                  role="tab"
                  aria-selected={!isAdminSection}
                  aria-label="Member workspace"
                  className="relative flex h-9 flex-1 items-center justify-center gap-2 rounded-md text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand focus-visible:ring-offset-2"
                >
                  <span className={`${!isAdminSection ? "text-kumo-brand font-semibold" : "text-kumo-inactive hover:text-kumo-strong"}`}>
                    Member
                  </span>
                  {!isAdminSection && (
                    <span className="absolute -top-1 right-1 flex size-4 items-center justify-center rounded-full bg-kumo-brand text-[9px] font-bold text-white">
                      1
                    </span>
                  )}
                </Link>
                <Link
                  href="/admin/dashboard"
                  role="tab"
                  aria-selected={isAdminSection}
                  aria-label="Admin workspace"
                  className="relative flex h-9 flex-1 items-center justify-center gap-2 rounded-md text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand focus-visible:ring-offset-2"
                >
                  <ShieldCheckIcon size={14} className={`${isAdminSection ? "text-kumo-brand" : "text-kumo-inactive hover:text-kumo-strong"}`} />
                  <span className={`${isAdminSection ? "text-kumo-brand font-semibold" : "text-kumo-inactive hover:text-kumo-strong"}`}>
                    Admin
                  </span>
                  {isAdminSection && (
                    <span className="absolute -top-1 right-1 flex size-4 items-center justify-center rounded-full bg-kumo-brand text-[9px] font-bold text-white">
                      1
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <MagnifyingGlassIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-kumo-inactive" aria-hidden="true" />
              <input
                type="search"
                placeholder="Quick search…"
                aria-label="Quick search"
                className="w-full h-10 pl-10 pr-4 bg-white border border-kumo-line rounded-xl text-sm text-kumo-strong placeholder:text-kumo-inactive outline-none transition-all duration-150 hover:border-kumo-line/50 focus:border-kumo-brand focus:ring-2 focus:ring-kumo-brand/20 focus:ring-offset-2"
              />
            </div>
          </div>
        )}

        {/* Collapsed Workspace Switcher */}
{isCollapsed && (
          <div className="flex flex-col items-center gap-2" title="Switch workspace">
            <Link
                href="/admin/dashboard"
                aria-label="Member workspace"
                className={`flex size-9 items-center justify-center rounded-lg transition-colors duration-150 ${!isAdminSection ? "bg-primary-alpha-10 text-kumo-brand shadow-sm" : "text-kumo-inactive hover:bg-kumo-tint hover:text-kumo-strong"}`}
              >
                <UserIcon size={18} />
              </Link>
              <Link
                href="/admin/dashboard"
                aria-label="Admin workspace"
                className={`flex size-9 items-center justify-center rounded-lg transition-colors duration-150 ${isAdminSection ? "bg-primary-alpha-10 text-kumo-brand shadow-sm" : "text-kumo-inactive hover:bg-kumo-tint hover:text-kumo-strong"}`}
              >
                <ShieldCheckIcon size={18} />
              </Link>
            </div>
        )}
      </KumoSidebar.Header>

      <KumoSidebar.Content className="px-3 py-4 flex-1 overflow-y-auto">
        {Object.entries(grouped).map(([group, items]: any) => (
          <KumoSidebar.Group key={group} className="mb-6 last:mb-0">
            {!isCollapsed && (
              <KumoSidebar.GroupLabel className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-kumo-inactive">
                {group}
              </KumoSidebar.GroupLabel>
            )}
            <KumoSidebar.Menu className="space-y-1">
              {items.map((item: any) => {
                const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                    <KumoSidebar.MenuButton
                      key={item.href}
                      icon={Icon}
                      active={isActive}
                      href={item.href}
                      title={isCollapsed ? item.name : undefined}
                      className={`
                        group/item relative flex h-10 items-center gap-3 rounded-lg px-3 transition-all duration-150
                        ${isActive
                          ? "bg-primary-alpha-10 text-kumo-brand"
                          : "text-kumo-inactive hover:bg-kumo-tint hover:text-kumo-strong"
                        }
                        ${isCollapsed ? "justify-center px-0" : "px-3"}
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand focus-visible:ring-offset-2
                      `}
                    >
                      <span className={`shrink-0 flex size-5 items-center justify-center ${getIconColor(isActive)} ${getIconBg(isActive)} ${getHoverBg(isActive)} transition-colors duration-150`}>
                        <Icon size={18} weight={isActive ? "fill" : "regular"} strokeWidth={isActive ? 0 : 1.5} />
                      </span>
                      {!isCollapsed && (
                        <>
                          <span className={`flex-1 truncate text-sm font-medium ${getTextColor(isActive)}`}>
                            {item.name}
                          </span>
                          {item.count !== null && (
                            <span className={`shrink-0 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-semibold tabular-nums transition-colors duration-150 ${isActive ? "bg-primary-alpha-10 text-kumo-brand" : "bg-kumo-tint text-kumo-inactive hover:bg-kumo-line/50"}`}>
                              {item.count}
                            </span>
                          )}
                        </>
                      )}
                    </KumoSidebar.MenuButton>
                );
              })}
            </KumoSidebar.Menu>
          </KumoSidebar.Group>
        ))}
      </KumoSidebar.Content>

      <KumoSidebar.Footer className="sticky bottom-0 z-10 bg-white border-t border-kumo-line p-3">
        <div className="relative">
          {/* User Profile Trigger */}
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="group flex w-full items-center gap-3 rounded-xl p-2 hover:bg-kumo-tint transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand focus-visible:ring-offset-2"
            aria-expanded={showUserMenu}
            aria-haspopup="menu"
            aria-label="User menu"
          >
            <div className="relative shrink-0">
              <img
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60"}
                alt=""
                width={36}
                height={36}
                className="size-9 rounded-full object-cover ring-1 ring-kumo-line"
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex size-4.5 items-center justify-center rounded-full bg-kumo-brand text-white">
                <ShieldCheckIcon size={10} weight="fill" />
              </span>
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold leading-4 text-kumo-strong">
                  {currentUser?.name || "Admin Angkatan 5"}
                </p>
                <p className="truncate text-xs leading-3 text-kumo-inactive">
                  Admin Angkatan 5
                </p>
              </div>
            )}
            <CaretDownIcon
              size={14}
              className={`shrink-0 text-kumo-inactive transition-transform duration-150 ${showUserMenu ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && !isCollapsed && (
            <div
              className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border border-kumo-line bg-white shadow-lg p-1.5 z-50 animate-[fade-in_150ms_ease-out]"
              role="menu"
            >
              <style jsx>{`
                @keyframes fade-in {
                  from { opacity: 0; transform: translateY(4px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}</style>
              <div className="px-3 py-2.5 border-b border-kumo-line/50 mb-1.5">
                <p className="truncate text-sm font-semibold leading-4 text-kumo-strong">
                  {currentUser?.name || "Admin Angkatan 5"}
                </p>
                <p className="truncate text-xs leading-3 text-kumo-inactive">
                  {currentUser?.email || "admin@angkatan5.id"}
                </p>
              </div>

              {otherUsers.length > 0 && (
                <>
                  <div className="px-2.5 py-1.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-kumo-inactive mb-1.5">Switch Account</p>
                    <div className="space-y-0.5">
                      {otherUsers.map((user) => (
                        <button
                          key={user.id}
                          role="menuitem"
                          onClick={() => { switchUser(user.id); setShowUserMenu(false); }}
                          className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-kumo-subtle hover:bg-kumo-tint hover:text-kumo-strong transition-colors duration-150"
                        >
                          <img
                            src={user.avatar}
                            alt=""
                            className="size-8 rounded-full object-cover ring-1 ring-kumo-line"
                          />
                          <span className="truncate flex-1 font-medium group-hover:text-kumo-strong">{user.name}</span>
                          <ArrowsLeftRightIcon size={14} className="text-kumo-inactive shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-kumo-line/50 my-1" />
                </>
              )}

              <Link
                href="/my-profile"
                role="menuitem"
                onClick={() => setShowUserMenu(false)}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-kumo-subtle hover:bg-kumo-tint hover:text-kumo-strong transition-colors duration-150"
              >
                <UserIcon size={16} weight="regular" />
                Profile
              </Link>
              <button
                role="menuitem"
                onClick={() => setShowUserMenu(false)}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-kumo-subtle hover:bg-kumo-tint hover:text-kumo-strong transition-colors duration-150"
              >
                <GearIcon size={16} weight="regular" />
                Preferences
              </button>
              <button
                role="menuitem"
                onClick={() => setShowUserMenu(false)}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-kumo-subtle hover:bg-kumo-tint hover:text-kumo-strong transition-colors duration-150"
              >
                <BellIcon size={16} weight="regular" />
                Notifications
              </button>
              <div className="border-t border-kumo-line/50 my-1" />
              <button
                role="menuitem"
                onClick={logout}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-error-base hover:bg-error-lighter hover:text-error-dark transition-colors duration-150"
              >
                <SignOutIcon size={16} weight="regular" />
                Sign Out
              </button>
            </div>
          )}

          {/* Collapsed Footer */}
          {isCollapsed && (
            <Button
              variant="ghost"
              shape="square"
              size="sm"
              onClick={logout}
              aria-label="Sign out"
              title="Sign out"
              icon={<SignOutIcon size={16} />}
              className="text-kumo-inactive hover:text-error-base hover:bg-error-lighter mx-auto"
            />
          )}
        </div>
      </KumoSidebar.Footer>
    </KumoSidebar>
  );
}

export function Sidebar() {
  return <SidebarInner />;
}