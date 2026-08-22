"use client";

import React from "react";
import { Sidebar } from "@/components/shared/Sidebar";
import { Header } from "@/components/shared/Header";
import { BottomNav } from "@/components/shared/BottomNav";
import { Sidebar as KumoSidebar } from "@cloudflare/kumo/components/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <KumoSidebar.Provider defaultOpen>
      <div className="min-h-screen flex bg-kumo-tint text-kumo-strong">
        {/* Persistent Left Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-0">
          <Header />
          <main className="flex-1 max-w-[1240px] w-full mx-auto p-5 sm:p-6 lg:p-10">
            {children}
          </main>
        </div>

        <BottomNav />
      </div>
    </KumoSidebar.Provider>
  );
}
