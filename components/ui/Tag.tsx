"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

export type TagTone = "neutral" | "success" | "warning" | "information" | "primary";
const tones: Record<TagTone, string> = {
  neutral: "bg-bg-white-0 text-text-strong-950 ring-stroke-soft-200",
  success: "bg-success-lighter text-success-dark ring-success-base/20",
  warning: "bg-warning-lighter text-warning-dark ring-warning-base/20",
  information: "bg-information-lighter text-information-dark ring-information-base/20",
  primary: "bg-primary-alpha-10 text-primary-base ring-primary-base/20",
};

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> { tone?: TagTone; }
export function Tag({ className, tone = "neutral", children, ...props }: TagProps) {
  return <span className={cn("inline-flex min-h-6 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium leading-none ring-1", tones[tone], className)} {...props}>{children}</span>;
}

export type StatusTone = "success" | "warning" | "information" | "primary" | "neutral";
export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> { tone: StatusTone; label: string; }
export function StatusBadge({ tone, label, className, ...props }: StatusBadgeProps) {
  return <Tag tone={tone} className={cn("gap-1.5", className)} {...props}><span aria-hidden="true" className="size-1.5 rounded-full bg-current" />{label}</Tag>;
}
