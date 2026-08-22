"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { useApp } from "@/lib/store/AppContext";

export function WorkspaceHeader() {
  const { currentUser } = useApp();

  return (
    <header className="hidden h-[76px] items-center justify-between border-b border-stroke-soft-200 bg-bg-white-0 px-8 lg:flex xl:px-10">
      <div className="flex items-center gap-3 text-sm text-text-sub-600">
        <span className="font-medium text-text-strong-950">A5 Network</span>
        <span className="size-1 rounded-full bg-text-soft-400" />
        <span>Private talent directory</span>
      </div>
      <div className="flex items-center gap-2.5">
        <button aria-label="Search" className="flex h-9 items-center gap-2 rounded-lg border border-stroke-soft-200 bg-bg-white-0 px-3 text-xs text-text-soft-400 shadow-regular-xs transition-colors hover:bg-bg-weak-50 hover:text-text-sub-600">
          <Search className="size-4" strokeWidth={1.7} />
          <span className="hidden xl:inline">Search</span>
          <kbd className="hidden rounded border border-stroke-soft-200 px-1.5 py-0.5 text-[10px] font-medium text-text-soft-400 xl:inline">⌘ K</kbd>
        </button>
        <button aria-label="Notifications" className="relative flex size-9 items-center justify-center rounded-lg text-text-sub-600 transition-colors hover:bg-bg-weak-50 hover:text-text-strong-950">
          <Bell className="size-4" strokeWidth={1.7} />
          <span className="absolute right-2 top-2 size-1.5 rounded-full border border-bg-white-0 bg-error-base" />
        </button>
        {currentUser && <Link href="/my-profile" aria-label="My profile" className="ml-1 flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-bg-weak-50"><img src={currentUser.avatar} alt="" className="size-7 rounded-full object-cover ring-1 ring-stroke-soft-200" /><span className="hidden text-xs font-medium text-text-strong-950 xl:inline">{currentUser.name}</span></Link>}
      </div>
    </header>
  );
}
