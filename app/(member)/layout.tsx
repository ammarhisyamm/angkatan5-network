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
    <KumoSidebar.Provider
      defaultOpen
      defaultWidth={280}
      minWidth={260}
      maxWidth={320}
      resizable
      collapsible="icon"
      peekable
      className="bg-kumo-tint text-kumo-strong"
    >
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <div className="flex flex-col min-w-0 flex-1 pb-24 lg:pb-0">
          <Header />
          <main className="w-full flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
      <BottomNav />
    </KumoSidebar.Provider>
  );
}
