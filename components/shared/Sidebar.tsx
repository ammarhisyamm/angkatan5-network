"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { Button } from "@/components/ui/Button";
import { useSidebarState } from "@/components/shared/SidebarContext";
import {
  HouseIcon,
  UsersIcon,
  BriefcaseIcon,
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
  ShieldCheckIcon,
} from "@phosphor-icons/react";

function SidebarInner() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, users, opportunities, switchUser, notifications = [], markNotificationRead, markAllNotificationsRead } = useApp() as any;
  const { open, setOpen } = useSidebarState();
  const isCollapsed = !open;
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState<{title: string, desc: string} | null>(null);
  const isAdminSection = pathname.startsWith("/admin");
  const unreadCount = notifications.filter((n: any) => !n.read).length;

  const adminCounts: Record<string, number | null> = {
    "/admin/members": users.length,
    "/admin/opportunities": opportunities.length,
  };
  const memberCounts: Record<string, number | null> = {
    "/discover": users.length,
    "/opportunities": opportunities.filter((o: any) => o.status === "Published").length,
  };
  const memberNav = [
    { name: "Dashboard", href: "/dashboard", icon: HouseIcon, group: "General", count: null },
    { name: "Discover People", href: "/discover", icon: UsersIcon, group: "General", count: memberCounts["/discover"] },
    { name: "Opportunities", href: "/opportunities", icon: BriefcaseIcon, group: "General", count: memberCounts["/opportunities"] },
    { name: "My Profile", href: "/my-profile", icon: UserIcon, group: "General", count: null },
  ];
  const adminNav = [
    { name: "Dashboard", href: "/admin/dashboard", icon: HouseIcon, group: "General", count: null },
    { name: "Members", href: "/admin/members", icon: UsersIcon, group: "General", count: adminCounts["/admin/members"] },
    { name: "Opportunities", href: "/admin/opportunities", icon: BriefcaseIcon, group: "General", count: adminCounts["/admin/opportunities"] },
    { name: "Skills", href: "/admin/skills", icon: StackIcon, group: "Tools", count: null },
    { name: "Analytics", href: "/admin/analytics", icon: ChartBarIcon, group: "Tools", count: null },
  ];
  const navItems = isAdminSection ? adminNav : memberNav;
  const grouped = navItems.reduce((acc: any, item: any) => { (acc[item.group] = acc[item.group] || []).push(item); return acc; }, {} as any);
  const otherUsers = users.filter((u: any) => u.id !== currentUser?.id).slice(0, 3);

  return (
    <>
      <aside className={`hidden shrink-0 flex-col border-r border-stroke-soft-200 bg-bg-white-0 lg:flex ${isCollapsed ? "w-[72px]" : "w-60"}`}>
        <div className="flex h-full w-full flex-col">
          <div className={`flex flex-col gap-4 border-b border-stroke-soft-200 px-4 py-4 ${isCollapsed ? "items-center px-2" : ""}`}>
            <div className="flex items-center justify-between gap-2">
              <Link href={isAdminSection ? "/admin/dashboard" : "/dashboard"} aria-label="A5 Network" className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base">
                <span className="grid size-8 shrink-0 grid-cols-2 place-content-center gap-1 rounded-lg bg-primary-base p-2">
                  {[1,2,3,4].map((dot) => <span key={dot} className="size-1.5 rounded-full bg-white" />)}
                </span>
                {!isCollapsed && <span className="truncate text-base font-semibold tracking-tight text-text-strong-950">A5 Network</span>}
              </Link>
              <div className="flex items-center gap-1.5">
                {!isCollapsed && (
                  <div className="relative">
                    <button onClick={() => setShowNotifications((v) => !v)} aria-label="Notifications" className="relative flex size-8 items-center justify-center rounded-lg text-text-sub-600 ring-1 ring-stroke-soft-200 hover:bg-bg-weak-50 hover:text-text-strong-950">
                      <BellIcon size={16} />
                      {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-error-base text-[10px] font-bold text-white ring-2 ring-bg-white-0">{unreadCount}</span>}
                    </button>
                    {showNotifications && (
                      <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-stroke-soft-200 bg-bg-white-0 shadow-lg">
                        <div className="flex items-center justify-between p-3">
                          <p className="text-sm font-semibold text-text-strong-950">Notifications</p>
                          <button onClick={markAllNotificationsRead} className="text-xs font-medium text-primary-base hover:underline">Mark all read</button>
                        </div>
                        <div className="max-h-72 overflow-auto">
                          {notifications.map((n: any) => (
                            <button key={n.id} onClick={() => markNotificationRead(n.id)} className={`flex w-full items-start gap-3 p-3 text-left hover:bg-bg-weak-50 ${!n.read ? "bg-primary-alpha-10/50" : ""}`}>
                              <span className={`mt-1 size-2 shrink-0 rounded-full ${!n.read ? "bg-primary-base" : "bg-transparent"}`} />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-text-strong-950">{n.title}</p>
                                <p className="truncate text-xs text-text-sub-600">{n.desc}</p>
                                <p className="text-xs text-text-soft-400">{n.time}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <button type="button" onClick={() => setOpen((v) => !v)} aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} className="flex size-8 shrink-0 items-center justify-center rounded-lg text-text-sub-600 ring-1 ring-stroke-soft-200 hover:bg-bg-weak-50 hover:text-text-strong-950">
                  {isCollapsed ? <CaretRightIcon size={15} /> : <CaretLeftIcon size={15} />}
                </button>
              </div>
            </div>
            {!isCollapsed && (
              <>
                <div className="flex items-center gap-1 rounded-lg bg-bg-weak-50 p-1 ring-1 ring-stroke-soft-200">
                  <Link href="/dashboard" aria-current={!isAdminSection ? "page" : undefined} className={`flex h-8 flex-1 items-center gap-2 rounded-md px-2 text-sm font-medium ${!isAdminSection ? "bg-bg-white-0 text-text-strong-950 ring-1 ring-stroke-soft-200" : "text-text-sub-600 hover:text-text-strong-950"}`}><span className="grid size-6 place-items-center rounded bg-primary-alpha-10 text-xs font-semibold text-primary-base">M</span>Member</Link>
                  <Link href="/admin/dashboard" aria-current={isAdminSection ? "page" : undefined} className={`flex h-8 flex-1 items-center gap-2 rounded-md px-2 text-sm font-medium ${isAdminSection ? "bg-bg-white-0 text-text-strong-950 ring-1 ring-stroke-soft-200" : "text-text-sub-600 hover:text-text-strong-950"}`}><span className="grid size-6 place-items-center rounded bg-text-strong-950 text-white"><ShieldCheckIcon size={12} weight="fill" /></span>Admin</Link>
                </div>
                <div className="relative">
                  <MagnifyingGlassIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft-400" aria-hidden="true" />
                  <input placeholder="Quick search…" aria-label="Quick search" className="h-9 w-full rounded-lg border border-stroke-soft-200 bg-bg-white-0 pl-9 pr-3 text-sm text-text-strong-950 placeholder:text-text-soft-400 outline-none hover:border-stroke-soft-200 focus:border-primary-base focus:ring-2 focus:ring-primary-base/15" />
                </div>
              </>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            {Object.entries(grouped).map(([group, items]: any, gi) => (
              <div key={group} className={gi !== 0 ? "mt-6 border-t border-stroke-soft-200 pt-6" : ""}>
                {isCollapsed ? null : <p className="mb-2 px-3 text-xs font-medium text-text-soft-400">{group}</p>}
                <div className="space-y-0.5">
                  {items.map((item: any) => {
                    const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
                    const Icon = item.icon;
                    return (
                      <Link key={item.href} href={item.href} title={isCollapsed ? item.name : undefined} className={`group flex h-9 items-center gap-3 rounded-lg px-3 text-sm transition-colors ${isActive ? "bg-bg-weak-50 font-semibold text-text-strong-950" : "font-medium text-text-sub-600 hover:bg-bg-weak-50 hover:text-text-strong-950"} ${isCollapsed ? "justify-center px-0" : ""}`}>
                        <Icon size={18} weight={isActive ? "fill" : "regular"} className={isActive ? "text-text-strong-950" : "text-text-soft-400 group-hover:text-text-sub-600"} />
                        {!isCollapsed && <><span className="flex-1 truncate text-left">{item.name}</span>{item.count !== null && <span className={`shrink-0 rounded-md border px-1.5 py-0.5 text-xs font-medium ${isActive ? "border-stroke-soft-200 bg-bg-white-0 text-text-strong-950" : "border-stroke-soft-200 bg-bg-white-0 text-text-sub-600"}`}>{item.count}</span>}</>}
                        {isCollapsed && item.count !== null && <span className="absolute right-2 top-1 size-2 rounded-full bg-primary-base" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-stroke-soft-200 p-2">
            <div className="relative">
              <div className={`flex items-center gap-3 rounded-xl p-2 ${isCollapsed ? "justify-center" : ""}`}>
                <img src={currentUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60"} alt="" width={24} height={24} className="size-6 shrink-0 rounded-full object-cover aspect-square bg-bg-weak-50 ring-1 ring-stroke-soft-200" />
                {!isCollapsed && (
                  <>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate text-sm font-semibold leading-4 text-text-strong-950">{currentUser?.name || "Admin Angkatan 5"}</p>
                      <p className="truncate text-xs leading-3 text-text-soft-400">{currentUser?.email || "admin@angkatan5.id"}</p>
                    </div>
                    <button onClick={() => setShowUserMenu((v) => !v)} aria-label="User menu" className="flex size-7 items-center justify-center rounded-lg text-text-soft-400 hover:bg-bg-weak-50 hover:text-text-strong-950">
                      <GearIcon size={14} />
                    </button>
                  </>
                )}
              </div>
              {showUserMenu && !isCollapsed && (
                <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-1.5 shadow-lg">
                  <div className="px-3 py-2.5">
                    <p className="truncate text-sm font-semibold text-text-strong-950">{currentUser?.name || "Admin Angkatan 5"}</p>
                    <p className="truncate text-xs text-text-soft-400">{currentUser?.email || "admin@angkatan5.id"}</p>
                  </div>
                  <div className="my-1 border-t border-stroke-soft-200" />
                  <button onClick={() => { router.push("/my-profile"); setShowUserMenu(false); }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-text-sub-600 hover:bg-bg-weak-50 hover:text-text-strong-950"><UserIcon size={14} /> Profile</button>
                  <button onClick={() => setShowInfoModal({title: "Preferences", desc: "Coming soon"})} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-text-sub-600 hover:bg-bg-weak-50"><GearIcon size={14} /> Preferences</button>
                  <button onClick={() => setShowInfoModal({title: "Notifications", desc: "No new notifications"})} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-text-sub-600 hover:bg-bg-weak-50"><BellIcon size={14} /> Notifications</button>
                  <div className="my-1 border-t border-stroke-soft-200" />
                  <button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-text-sub-600 hover:bg-bg-weak-50"><SignOutIcon size={14} /> Sign Out</button>
                </div>
              )}
              {isCollapsed && (
                <div className="mt-2 flex justify-center">
                  <Button variant="ghost" size="icon" onClick={logout} aria-label="Sign out"><SignOutIcon size={16} /></Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={() => setShowInfoModal(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-bg-white-0 p-6 text-center shadow-xl">
            <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-primary-alpha-10 text-primary-base"><BellIcon size={24} weight="fill" /></div>
            <h3 className="text-base font-semibold text-text-strong-950">{showInfoModal.title}</h3>
            <p className="mt-1 text-sm text-text-sub-600">{showInfoModal.desc}</p>
            <Button variant="primary" size="md" className="mt-4 w-full" onClick={() => setShowInfoModal(null)}>Done</Button>
          </div>
        </div>
      )}
    </>
  );
}

export function Sidebar() {
  return <SidebarInner />;
}
