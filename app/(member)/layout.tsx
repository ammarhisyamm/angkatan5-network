"use client";

import React from "react";
import { Sidebar } from "@/components/shared/Sidebar";
import { Header } from "@/components/shared/Header";
import { BottomNav } from "@/components/shared/BottomNav";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-bg-weak-50 text-text-strong-950">
      {/* Persistent Left Sidebar for Desktop */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
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
  );
}
