"use client";

import React from "react";
import { Sidebar } from "@/components/shared/Sidebar";
import { Header } from "@/components/shared/Header";
import { BottomNav } from "@/components/shared/BottomNav";
import { SidebarProvider } from "@/components/shared/SidebarContext";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-kumo-base focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-kumo-strong focus:shadow-lg">Skip to main content</a>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <div className="flex flex-col min-w-0 flex-1 pb-24 lg:pb-0">
          <Header />
          <main id="main-content" className="mx-auto w-full max-w-[1600px] flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
      <BottomNav />
    </SidebarProvider>
  );
}
