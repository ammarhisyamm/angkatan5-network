"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type SidebarContextValue = { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; };
const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const value = useMemo(() => ({ open, setOpen }), [open]);
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebarState() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebarState must be used inside SidebarProvider");
  return context;
}
