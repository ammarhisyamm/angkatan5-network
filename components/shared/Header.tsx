"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store/AppContext";
import { ShieldCheckIcon, SignOutIcon } from "@phosphor-icons/react";

export function Header() {
  const pathname = usePathname();
  const { currentUser, logout } = useApp();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-30 border-b border-kumo-line bg-kumo-base lg:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href={isAdmin ? "/admin/dashboard" : "/dashboard"} className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand">
          <span className="flex size-8 items-center justify-center rounded-lg bg-kumo-brand text-xs font-semibold text-static-white">A5</span>
          <span className="text-sm font-semibold leading-5 tracking-tight text-kumo-strong">A5 Network</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={isAdmin ? "/dashboard" : "/admin/dashboard"}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-kumo-tint px-2.5 text-xs font-medium text-kumo-subtle transition-colors hover:text-kumo-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand"
          >
            <ShieldCheckIcon size={14} weight="regular" />
            {isAdmin ? "Member" : "Admin"}
          </Link>

          {currentUser && (
            <>
              <Link href="/my-profile" aria-label="My profile" className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand">
                <img
                  src={currentUser.avatar}
                  alt=""
                  width={32}
                  height={32}
                  className="size-8 shrink-0 rounded-full bg-kumo-tint object-cover aspect-square ring-1 ring-kumo-line"
                />
              </Link>
              <button
                onClick={logout}
                aria-label="Sign out"
                title="Sign out"
                className="flex size-8 items-center justify-center rounded-lg text-kumo-inactive transition-colors hover:bg-error-lighter hover:text-error-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumo-brand"
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
