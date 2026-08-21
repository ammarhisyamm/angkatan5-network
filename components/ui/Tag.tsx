"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

/* ------------------------------------------------------------------
   Tag — skill / category / metadata chip
   24px height, radius-6 (6px), px-2.5, text-[11px] medium
   Soft background + readable dark text. Wraps with gap-2.
------------------------------------------------------------------- */

export type TagTone = "neutral" | "success" | "warning" | "information" | "primary";

const toneClasses: Record<TagTone, string> = {
  neutral: "bg-[#F2F4F7] text-[#344054]",
  success: "bg-success-lighter text-success-base",
  warning: "bg-warning-lighter text-warning-base",
  information: "bg-information-lighter text-information-dark",
  primary: "bg-primary-alpha-10 text-primary-base",
};

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: TagTone;
}

export function Tag({ className, tone = "neutral", children, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 select-none items-center whitespace-nowrap rounded-md px-2.5",
        "text-[11px] font-medium leading-none tracking-[0.01em]",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------
   StatusBadge — semantic status pill
   24px height, 999px pill, px-2.5 (10px), text-[11px] medium,
   consistent 6px status dot. Same component on every screen.
   Dot ensures status is not communicated by color alone.
------------------------------------------------------------------- */

export type StatusTone = "success" | "warning" | "information" | "primary" | "neutral";

const statusToneClasses: Record<StatusTone, string> = {
  success: "bg-success-lighter text-success-dark",
  warning: "bg-warning-lighter text-warning-base",
  information: "bg-information-lighter text-information-dark",
  primary: "bg-primary-alpha-10 text-primary-base",
  neutral: "bg-[#F2F4F7] text-[#344054]",
};

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone: StatusTone;
  label: string;
}

export function StatusBadge({ tone, label, className, ...props }: StatusBadgeProps) {
  return (
    <span
      role="status"
      className={cn(
        "inline-flex h-6 shrink-0 select-none items-center gap-1.5 whitespace-nowrap rounded-full px-2.5",
        "text-[11px] font-semibold uppercase leading-none tracking-[0.02em]",
        statusToneClasses[tone],
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-current opacity-80" />
      {label}
    </span>
  );
}
