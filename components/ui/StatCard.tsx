"use client";

import React from "react";
import { LayerCard } from "@/components/ui/Surface";
import { cn } from "@/lib/utils/cn";

export function StatCard({ label, value, supporting, accent = "text-text-strong-950", className }: { label: string; value: React.ReactNode; supporting?: React.ReactNode; accent?: string; className?: string }) {
  return (
    <LayerCard className={cn("p-4 sm:p-5", className)}>
      <span className="text-label-xs text-text-sub-600">{label}</span>
      <span className={cn("mt-1 block text-title-h5 font-semibold tabular-nums", accent)} data-numeric>{value}</span>
      {supporting && <span className="mt-1 block text-paragraph-xs text-text-soft-400">{supporting}</span>}
    </LayerCard>
  );
}
