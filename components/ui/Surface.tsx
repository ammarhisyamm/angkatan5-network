"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

export function LayerCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl border border-kumo-line bg-kumo-base shadow-none", className)} {...props}>{children}</div>;
}

const gridVariants = {
  "1-2-4up": "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
  "2up": "grid-cols-1 md:grid-cols-2",
  "3up": "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
} as const;

export function Grid({ variant = "2up", gap = "base", className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: keyof typeof gridVariants; gap?: "base" | "sm" | "lg" }) {
  return <div className={cn("grid min-w-0", gridVariants[variant], gap === "sm" ? "gap-3" : gap === "lg" ? "gap-8" : "gap-5", className)} {...props}>{children}</div>;
}
