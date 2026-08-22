"use client";

import React from "react";
import { Sidebar } from "@/components/shared/Sidebar";
import { Header } from "@/components/shared/Header";
import { BottomNav } from "@/components/shared/BottomNav";
import { WorkspaceHeader } from "@/components/shared/WorkspaceHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-[#f8f9fb] text-text-strong-950">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex min-w-0 flex-col pb-24 lg:pb-0">
        <Header />
        <WorkspaceHeader />
        <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 xl:p-10">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
