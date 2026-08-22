"use client";

import React from "react";
import { Badge as KumoBadge } from "@cloudflare/kumo/components/badge";
import { cn } from "@/lib/utils/cn";

export type TagTone = "neutral" | "success" | "warning" | "information" | "primary";

const toneMap: Record<TagTone, "neutral" | "success" | "warning" | "info" | "blue"> = {
  neutral: "neutral",
  success: "success",
  warning: "warning",
  information: "info",
  primary: "blue",
};

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: TagTone;
}

export function Tag({ className, tone = "neutral", children, ...props }: TagProps) {
  const variant = toneMap[tone] ?? "neutral";
  return (
    <KumoBadge variant={variant} className={cn("rounded-md px-3 py-1 text-xs font-medium leading-none tracking-[0.01em] min-h-6 h-auto", className)} {...(props as any)}>
      {children}
    </KumoBadge>
  );
}

/* StatusBadge — uses Kumo dot appearance for semantic status */
export type StatusTone = "success" | "warning" | "information" | "primary" | "neutral";

const statusVariantMap: Record<StatusTone, "success" | "warning" | "info" | "blue" | "neutral"> = {
  success: "success",
  warning: "warning",
  information: "info",
  primary: "blue",
  neutral: "neutral",
};

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone: StatusTone;
  label: string;
}

export function StatusBadge({ tone, label, className, ...props }: StatusBadgeProps) {
  const variant = statusVariantMap[tone] ?? "neutral";
  const useKumoDot = variant === "success" || variant === "warning" || variant === "neutral";
  if (useKumoDot) {
    return (
      <KumoBadge variant={variant as any} appearance="dot" className={cn("rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.02em] min-h-6 h-auto", className)} {...(props as any)}>
        {label}
      </KumoBadge>
    );
  }
  return (
    <KumoBadge variant={variant as any} className={cn("rounded-full px-3 py-1 gap-1.5 text-xs font-semibold uppercase tracking-[0.02em] min-h-6 h-auto", className)} {...(props as any)}>
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-current opacity-80" />
      {label}
    </KumoBadge>
  );
}
