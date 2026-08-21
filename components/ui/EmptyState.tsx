"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

export interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/** Shared empty state — bordered white panel, icon well, title, description, optional action. */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "mx-auto my-8 flex max-w-md flex-col items-center justify-center rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-12 text-center",
        className,
      )}
    >
      <span className="mb-4 flex size-14 items-center justify-center rounded-xl bg-bg-weak-50 text-text-soft-400">
        <Icon className="size-6" strokeWidth={1.5} />
      </span>
      <h3 className="text-sm font-semibold leading-5 text-text-strong-950">{title}</h3>
      {description && <p className="mt-1 max-w-xs text-[13px] leading-5 text-text-sub-600">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
