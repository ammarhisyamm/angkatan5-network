"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { ShieldCheck } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { currentUser } = useApp();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-stroke-soft-200 bg-bg-white-0 px-4 lg:hidden">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary-base text-[11px] leading-4 font-bold text-static-white">A5</div>
        <span className="text-label-sm font-semibold tracking-tight text-text-strong-950">A5 Network</span>
      </Link>

      <div className="flex items-center gap-2">
        {isAdmin ? (
          <Link href="/dashboard" className="rounded-lg bg-primary-alpha-10 px-2 py-1 text-[11px] leading-4 font-medium text-primary-base">
            Switch to Member
          </Link>
        ) : (
          <Link href="/admin/dashboard" className="flex items-center gap-1 rounded-lg bg-bg-weak-50 px-2 py-1 text-[11px] leading-4 font-medium text-text-sub-600 ring-1 ring-inset ring-stroke-soft-200">
            <ShieldCheck className="size-3" />
            Admin
          </Link>
        )}
        {currentUser && (
          <Link href="/my-profile">
            <img src={currentUser.avatar} alt={currentUser.name} className="size-7 rounded-full object-cover bg-bg-weak-50 ring-1 ring-stroke-soft-200" />
          </Link>
        )}
      </div>
    </header>
  );
}
