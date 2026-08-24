"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

export interface SelectItem { label: string; value: string; }
export function Select({ label, value, onValueChange, items, placeholder, className }: { label?: string; value?: string; onValueChange?: (value: string) => void; items: SelectItem[]; placeholder?: string; className?: string }) {
  return <label className={cn("flex min-w-0 flex-col gap-1.5", className)}>
    {label && <span className="text-sm font-medium text-kumo-strong">{label}</span>}
    <select value={value} onChange={(event) => onValueChange?.(event.target.value)} className="h-11 w-full min-w-0 rounded-lg bg-kumo-base px-3.5 text-base text-kumo-strong ring-1 ring-kumo-line outline-none focus:ring-2 focus:ring-kumo-brand/40">
      {placeholder && !items.some((item) => item.value === value) && <option value="">{placeholder}</option>}
      {items.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
    </select>
  </label>;
}
