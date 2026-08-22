"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { ShieldCheck, LogOut } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { currentUser, logout } = useApp();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-30 border-b border-stroke-soft-200 bg-bg-white-0 lg:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href={isAdmin ? "/admin/dashboard" : "/dashboard"} className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary-base text-xs font-semibold text-static-white">A5</span>
          <span className="text-sm font-semibold leading-5 tracking-tight text-text-strong-950">A5 Network</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={isAdmin ? "/dashboard" : "/admin/dashboard"}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-bg-weak-50 px-2.5 text-xs font-medium text-text-sub-600 transition-colors hover:text-text-strong-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base"
          >
            <ShieldCheck className="size-3.5" strokeWidth={1.5} />
            {isAdmin ? "Member" : "Admin"}
          </Link>

          {currentUser && (
            <>
              <Link href="/my-profile" aria-label="My profile" className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base">
                <img
                  src={currentUser.avatar}
                  alt=""
                  className="size-8 rounded-full bg-bg-weak-50 object-cover ring-1 ring-stroke-soft-200"
                />
              </Link>
              <button
                onClick={logout}
                aria-label="Sign out"
                title="Sign out"
                className="flex size-8 items-center justify-center rounded-lg text-text-soft-400 transition-colors hover:bg-error-lighter hover:text-error-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base"
              >
                <LogOut className="size-4" strokeWidth={1.5} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
