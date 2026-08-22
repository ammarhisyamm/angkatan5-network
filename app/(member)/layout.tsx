"use client";

import React from "react";
import { Sidebar } from "@/components/shared/Sidebar";
import { Header } from "@/components/shared/Header";
import { BottomNav } from "@/components/shared/BottomNav";
import { Sidebar as KumoSidebar } from "@cloudflare/kumo/components/sidebar";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <KumoSidebar.Provider defaultOpen defaultWidth={280} minWidth={260} maxWidth={320}>
      <div className="min-h-screen flex bg-kumo-tint text-kumo-strong">
        {/* Persistent Left Sidebar for Desktop */}
        <Sidebar />

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-0">
          {/* Mobile Header */}
          <Header />

          {/* Page Content */}
          <main className="flex-1 max-w-[1240px] w-full mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>

        {/* Bottom Nav for Mobile */}
        <BottomNav />
      </div>
    </KumoSidebar.Provider>
  );
}
