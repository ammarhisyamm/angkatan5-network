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
  const isNeutral = variant === "neutral";
  return (
    <KumoBadge
      variant={variant}
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-medium leading-none min-h-[24px] h-auto",
        isNeutral && "bg-white text-kumo-strong border border-kumo-line",
        className,
      )}
      {...(props as any)}
    >
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
  const isNeutral = variant === "neutral";
  const useDot = variant === "success" || variant === "warning" || variant === "neutral";
  return (
    <KumoBadge
      variant={variant as any}
      appearance={useDot ? "dot" : undefined}
      className={cn(
        "rounded-full px-2.5 py-0.5 gap-1.5 text-xs font-semibold uppercase tracking-[0.02em] min-h-[24px] h-auto",
        isNeutral && "bg-white text-kumo-strong border border-kumo-line",
        className,
      )}
      {...(props as any)}
    >
      {label}
    </KumoBadge>
  );
}
