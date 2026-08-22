"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { BarChart3, Briefcase, ChevronDown, Home, Layers, LogOut, Settings, ShieldCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser, logout, switchDemoRole } = useApp();
  const isAdminSection = pathname.startsWith("/admin");
  const navItems = isAdminSection
    ? [{ name: "Dashboard", href: "/admin/dashboard", icon: Home }, { name: "Members", href: "/admin/members", icon: Users }, { name: "Opportunities", href: "/admin/opportunities", icon: Briefcase }, { name: "Skills", href: "/admin/skills", icon: Layers }, { name: "Analytics", href: "/admin/analytics", icon: BarChart3 }]
    : [{ name: "Home", href: "/dashboard", icon: Home }, { name: "Discover people", href: "/discover", icon: Users }, { name: "Opportunities", href: "/opportunities", icon: Briefcase }, { name: "My profile", href: "/my-profile", icon: Settings }];

  return <aside className="sticky top-0 z-30 hidden h-screen w-[280px] shrink-0 flex-col border-r border-stroke-soft-200 bg-bg-white-0 lg:flex">
    <div className="border-b border-stroke-soft-200 px-5 py-6">
      <Link href={isAdminSection ? "/admin/dashboard" : "/dashboard"} className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary-base text-sm font-semibold text-static-white shadow-[0_4px_12px_rgba(51,92,255,0.2)]">A5</span>
        <span className="min-w-0"><span className="block text-sm font-semibold leading-5 text-text-strong-950">A5 Network</span><span className="mt-0.5 block text-xs leading-4 text-text-sub-600">Private Talent Directory</span></span>
        <ChevronDown className="ml-auto size-4 text-text-soft-400" strokeWidth={1.7} />
      </Link>
      <div className="mt-6 grid grid-cols-2 rounded-lg bg-bg-weak-50 p-1" role="tablist" aria-label="Workspace role">
        <Link href="/dashboard" role="tab" aria-selected={!isAdminSection} className={cn("flex h-8 items-center justify-center rounded-md text-xs font-medium transition-all", !isAdminSection ? "bg-bg-white-0 text-primary-base shadow-regular-xs" : "text-text-sub-600 hover:text-text-strong-950")}>Member</Link>
        <Link href="/admin/dashboard" role="tab" aria-selected={isAdminSection} className={cn("flex h-8 items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-all", isAdminSection ? "bg-bg-white-0 text-primary-base shadow-regular-xs" : "text-text-sub-600 hover:text-text-strong-950")}><ShieldCheck className="size-3.5" />Admin</Link>
      </div>
    </div>

    <nav className="flex-1 px-3 py-6" aria-label="Primary">
      <p className="px-3 pb-3 text-[11px] font-medium uppercase tracking-[0.1em] text-text-soft-400">{isAdminSection ? "Administration" : "Main"}</p>
      <div className="space-y-1">{navItems.map((item) => {
        const active = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
        const Icon = item.icon;
        return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={cn("flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base", active ? "bg-information-lighter text-primary-base" : "text-text-sub-600 hover:bg-bg-weak-50 hover:text-text-strong-950")}><Icon className={cn("size-[18px]", active ? "text-primary-base" : "text-text-soft-400")} strokeWidth={1.6} /><span>{item.name}</span>{active && <span className="ml-auto size-1.5 rounded-full bg-primary-base" />}</Link>;
      })}</div>
    </nav>

    <div className="mx-4 mb-4 rounded-xl border border-stroke-soft-200 bg-bg-weak-50 p-3">
      <p className="mb-2.5 text-[11px] font-medium text-text-soft-400">Quick demo</p>
      <div className="grid grid-cols-2 gap-2"><button onClick={() => switchDemoRole("member")} aria-pressed={currentUser?.email === "member@example.com"} className={cn("h-8 rounded-md border text-xs font-medium transition-colors", currentUser?.email === "member@example.com" ? "border-primary-base bg-primary-alpha-10 text-primary-base" : "border-stroke-soft-200 bg-bg-white-0 text-text-sub-600 hover:bg-bg-weak-50")}>Member</button><button onClick={() => switchDemoRole("admin")} aria-pressed={currentUser?.email === "admin@example.com"} className={cn("h-8 rounded-md border text-xs font-medium transition-colors", currentUser?.email === "admin@example.com" ? "border-primary-base bg-primary-alpha-10 text-primary-base" : "border-stroke-soft-200 bg-bg-white-0 text-text-sub-600 hover:bg-bg-weak-50")}>Admin</button></div>
    </div>
    <div className="flex items-center gap-3 border-t border-stroke-soft-200 p-4">
      {currentUser ? <Link href="/my-profile" className="flex min-w-0 flex-1 items-center gap-2.5"><img src={currentUser.avatar} alt="" className="size-9 rounded-full object-cover ring-1 ring-stroke-soft-200" /><span className="min-w-0"><span className="block truncate text-xs font-semibold text-text-strong-950">{currentUser.name}</span><span className="mt-0.5 block truncate text-[11px] text-text-sub-600">{currentUser.role || "Member"}</span></span></Link> : <span className="text-xs text-text-soft-400">Not logged in</span>}
      <button onClick={logout} aria-label="Sign out" className="flex size-8 items-center justify-center rounded-lg text-text-soft-400 hover:bg-bg-weak-50 hover:text-text-strong-950"><LogOut className="size-4" strokeWidth={1.6} /></button>
    </div>
  </aside>;
}
