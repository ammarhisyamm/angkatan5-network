"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { useSidebarState } from "@/components/shared/SidebarContext";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { HouseIcon, UsersIcon, BriefcaseIcon, ChartBarIcon, StackIcon, MagnifyingGlassIcon, CaretDoubleLeftIcon, CaretRightIcon, SignOutIcon, GearIcon, BellIcon, UserIcon, ArrowsLeftRightIcon, ShieldCheckIcon } from "@phosphor-icons/react";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, users, opportunities, switchUser } = useApp();
  const { open, setOpen } = useSidebarState();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [infoModal, setInfoModal] = useState<{ title: string; desc: string } | null>(null);
  const isAdmin = pathname.startsWith("/admin");
  const nav = isAdmin ? [
    { name: "Dashboard", href: "/admin/dashboard", icon: HouseIcon, group: "General" },
    { name: "Members", href: "/admin/members", icon: UsersIcon, group: "General", count: users.length },
    { name: "Opportunities", href: "/admin/opportunities", icon: BriefcaseIcon, group: "General", count: opportunities.length },
    { name: "Skills", href: "/admin/skills", icon: StackIcon, group: "Tools" },
    { name: "Analytics", href: "/admin/analytics", icon: ChartBarIcon, group: "Tools" },
  ] : [
    { name: "Dashboard", href: "/dashboard", icon: HouseIcon, group: "General" },
    { name: "Discover People", href: "/discover", icon: UsersIcon, group: "General", count: users.length },
    { name: "Opportunities", href: "/opportunities", icon: BriefcaseIcon, group: "General", count: opportunities.filter((o) => o.status === "Published").length },
    { name: "My Profile", href: "/my-profile", icon: UserIcon, group: "General" },
  ];
  const otherUsers = users.filter((user) => user.id !== currentUser?.id).slice(0, 3);
  const grouped = nav.reduce<Record<string, typeof nav>>((acc, item) => { (acc[item.group] ??= []).push(item); return acc; }, {});

  return <aside className={`hidden shrink-0 border-r border-kumo-line bg-kumo-base transition-[width] duration-200 lg:flex ${open ? "w-60" : "w-[72px]"}`}>
    <div className="flex min-h-screen w-full flex-col">
      <header className={`flex min-h-[124px] flex-col gap-4 border-b border-kumo-line px-4 py-4 ${open ? "" : "items-center px-2"}`}>
        <div className="flex items-center justify-between gap-2">
          <Link href={isAdmin ? "/admin/dashboard" : "/dashboard"} aria-label="A5 Network" className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand">
            <span className="grid size-8 shrink-0 grid-cols-2 place-content-center gap-1 rounded-lg bg-kumo-brand p-2">
              {[1, 2, 3, 4].map((dot) => <span key={dot} className="size-1.5 rounded-full bg-white" />)}
            </span>
            {open && <span className="truncate text-base font-semibold tracking-tight text-kumo-strong">A5 Network</span>}
          </Link>
          <button type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? "Collapse sidebar" : "Expand sidebar"} className="flex size-8 shrink-0 items-center justify-center rounded-lg text-kumo-subtle ring-1 ring-kumo-line hover:bg-kumo-tint hover:text-kumo-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand">
            {open ? <CaretDoubleLeftIcon size={15} /> : <CaretRightIcon size={15} />}
          </button>
        </div>
        {open && <>
          <div className="flex items-center gap-1 rounded-lg bg-kumo-tint p-1 ring-1 ring-kumo-line">
            <Link href="/dashboard" aria-current={!isAdmin ? "page" : undefined} className={`flex h-8 flex-1 items-center gap-2 rounded-md px-2 text-sm font-medium ${!isAdmin ? "bg-kumo-base text-kumo-strong ring-1 ring-kumo-line" : "text-kumo-subtle hover:text-kumo-strong"}`}><span className="grid size-6 place-items-center rounded bg-primary-alpha-10 text-xs font-semibold text-kumo-brand">M</span>Member</Link>
            <Link href="/admin/dashboard" aria-current={isAdmin ? "page" : undefined} className={`flex h-8 flex-1 items-center gap-2 rounded-md px-2 text-sm font-medium ${isAdmin ? "bg-kumo-base text-kumo-strong ring-1 ring-kumo-line" : "text-kumo-subtle hover:text-kumo-strong"}`}><span className="grid size-6 place-items-center rounded bg-kumo-strong text-white"><ShieldCheckIcon size={12} weight="fill" /></span>Admin</Link>
          </div>
          <label className="relative"><span className="sr-only">Quick search</span><MagnifyingGlassIcon size={16} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-kumo-subtle" /><input name="quick-search" type="search" placeholder="Quick search…" className="h-10 w-full rounded-lg bg-kumo-base pl-9 pr-3 text-base text-kumo-strong ring-1 ring-kumo-line outline-none placeholder:text-kumo-inactive focus:ring-2 focus:ring-kumo-brand/40" /></label>
        </>}
      </header>
      <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 py-4">
        {Object.entries(grouped).map(([group, items], index) => <div key={group} className={index ? "mt-7 border-t border-kumo-line pt-6" : ""}>
          {open && <p className="mb-2 px-3 text-xs font-medium text-kumo-subtle">{group}</p>}
          <div className="space-y-1">{items.map((item) => { const active = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/admin/dashboard" && pathname.startsWith(item.href)); const Icon = item.icon; return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} title={!open ? item.name : undefined} className={`relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand ${open ? "" : "justify-center px-0"} ${active ? "bg-kumo-tint font-semibold text-kumo-strong before:absolute before:inset-y-2 before:-left-3 before:w-0.5 before:rounded-r-full before:bg-kumo-brand" : "text-kumo-subtle hover:bg-kumo-tint hover:text-kumo-strong"}`}><Icon size={18} weight={active ? "fill" : "regular"} aria-hidden="true" />{open && <><span className="min-w-0 flex-1 truncate">{item.name}</span>{item.count !== undefined && <span className="rounded-md bg-kumo-base px-1.5 py-0.5 text-xs tabular-nums ring-1 ring-kumo-line">{item.count}</span>}</>}</Link>; })}</div>
        </div>)}
      </nav>
      <footer className="relative border-t border-kumo-line p-3">
        <button type="button" aria-haspopup="menu" aria-expanded={showUserMenu} onClick={() => open && setShowUserMenu((value) => !value)} className={`flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-kumo-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand ${open ? "" : "justify-center"}`}>
          <img src={currentUser?.avatar} alt="" width={32} height={32} className="size-8 shrink-0 rounded-full object-cover ring-1 ring-kumo-line" />
          {open && <span className="min-w-0"><span className="block truncate text-sm font-semibold text-kumo-strong">{currentUser?.name || "Member"}</span><span className="block truncate text-xs text-kumo-subtle">{currentUser?.email || ""}</span></span>}
        </button>
        {showUserMenu && open && <div role="menu" className="absolute bottom-full left-3 right-3 z-50 mb-2 rounded-xl border border-kumo-line bg-kumo-base p-1.5 shadow-lg">
          {otherUsers.length > 0 && <div className="border-b border-kumo-line px-2 pb-2 pt-1"><p className="mb-1 text-xs font-medium text-kumo-subtle">Switch account</p>{otherUsers.map((user) => <button key={user.id} role="menuitem" type="button" onClick={() => { switchUser(user.id); setShowUserMenu(false); }} className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-kumo-subtle hover:bg-kumo-tint hover:text-kumo-strong"><img src={user.avatar} alt="" width={24} height={24} className="size-6 rounded-full object-cover" /><span className="flex-1 truncate text-left">{user.name}</span><ArrowsLeftRightIcon size={14} /></button>)}</div>}
          <button role="menuitem" type="button" onClick={() => { router.push("/my-profile"); setShowUserMenu(false); }} className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-kumo-subtle hover:bg-kumo-tint hover:text-kumo-strong"><UserIcon size={16} />Profile</button>
          <button role="menuitem" type="button" onClick={() => { setShowUserMenu(false); setInfoModal({ title: "Preferences", desc: "Preferences will be available soon." }); }} className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-kumo-subtle hover:bg-kumo-tint hover:text-kumo-strong"><GearIcon size={16} />Preferences</button>
          <button role="menuitem" type="button" onClick={() => { setShowUserMenu(false); setInfoModal({ title: "Notifications", desc: "You have no new notifications." }); }} className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-kumo-subtle hover:bg-kumo-tint hover:text-kumo-strong"><BellIcon size={16} />Notifications</button>
          <button role="menuitem" type="button" onClick={logout} className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-kumo-subtle hover:bg-error-lighter hover:text-error-base"><SignOutIcon size={16} />Sign out</button>
        </div>}
      </footer>
    </div>
    <Modal isOpen={!!infoModal} onClose={() => setInfoModal(null)} title={infoModal?.title} description={infoModal?.desc} icon="info"><div className="flex justify-end"><Button variant="primary" size="sm" onClick={() => setInfoModal(null)}>Close</Button></div></Modal>
  </aside>;
}
