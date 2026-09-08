"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { ShieldCheckIcon, SignOutIcon } from "@phosphor-icons/react";
import { Avatar } from "@/components/ui/Avatar";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useApp();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-30 border-b border-stroke-soft-200 bg-bg-white-0 lg:hidden">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href={isAdmin ? "/admin/dashboard" : "/dashboard"} className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary-base text-xs font-semibold text-static-white">A5</span>
          <span className="text-sm font-semibold leading-5 tracking-tight text-text-strong-950">A5 Network</span>
        </Link>

        <div className="flex items-center gap-2">
          {(currentUser?.roleType === "admin" || currentUser?.roleType === "superadmin") && (
            <div className="flex items-center gap-1 rounded-lg bg-bg-weak-50 p-1 ring-1 ring-stroke-soft-200" aria-label="Switch workspace">
              <Link
                href="/dashboard"
                aria-current={!isAdmin ? "page" : undefined}
                className={`flex h-8 items-center justify-center rounded-md px-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base ${!isAdmin ? "bg-bg-white-0 text-text-strong-950 ring-1 ring-stroke-soft-200" : "text-text-sub-600 hover:text-text-strong-950"}`}
              >
                Member
              </Link>
              <Link
                href="/admin/dashboard"
                aria-current={isAdmin ? "page" : undefined}
                className={`flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base ${isAdmin ? "bg-bg-white-0 text-text-strong-950 ring-1 ring-stroke-soft-200" : "text-text-sub-600 hover:text-text-strong-950"}`}
              >
                <ShieldCheckIcon size={14} weight="regular" aria-hidden="true" />
                Admin
              </Link>
            </div>
          )}

          {currentUser && (
            <>
              <Link href="/my-profile" aria-label="My profile" className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base">
                <Avatar name={currentUser.name} className="size-8 text-xs" />
              </Link>
              <button
                onClick={() => { logout(); router.push("/login"); }}
                aria-label="Sign out"
                title="Sign out"
                className="flex size-8 items-center justify-center rounded-lg text-text-soft-400 transition-colors hover:bg-error-lighter hover:text-error-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base"
              >
                <SignOutIcon size={16} weight="regular" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
