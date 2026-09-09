"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

export interface SegmentedControlItem<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ElementType;
}

export function SegmentedControl<T extends string>({
  value,
  onValueChange,
  items,
  ariaLabel,
  className,
}: {
  value: T;
  onValueChange: (value: T) => void;
  items: SegmentedControlItem<T>[];
  ariaLabel: string;
  className?: string;
}) {
  return (
    <div role="tablist" aria-label={ariaLabel} className={cn("flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-10 bg-bg-weak-50 p-1 ring-1 ring-stroke-soft-200", className)}>
      {items.map(({ value: itemValue, label, icon: Icon }) => {
        const active = itemValue === value;
        return (
          <button
            key={itemValue}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onValueChange(itemValue)}
            className={cn(
              "flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 text-label-sm transition-[background-color,color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40",
              active ? "bg-bg-white-0 text-text-strong-950 shadow-regular-xs" : "text-text-sub-600 hover:bg-bg-white-0/70 hover:text-text-strong-950",
            )}
          >
            {Icon && <Icon size={15} aria-hidden="true" />}
            {label}
          </button>
        );
      })}
    </div>
  );
}
