"use client";

import * as React from "react";
import { CheckCircleIcon, InfoIcon, WarningCircleIcon, XCircleIcon, XIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils/cn";

export const alertVariants = () => ({ root: () => "", wrapper: () => "", icon: () => "", closeIcon: () => "" });

type AlertStatus = "error" | "warning" | "success" | "information" | "feature";
type AlertVariant = "filled" | "light" | "lighter" | "stroke";

function statusIcon(status: AlertStatus) {
  const props = { weight: "fill" as const, size: 20 };
  if (status === "error") return <XCircleIcon {...props} />;
  if (status === "warning") return <WarningCircleIcon {...props} />;
  if (status === "success") return <CheckCircleIcon {...props} />;
  return <InfoIcon {...props} />;
}

export function Root({ children, status = "information", variant: _variant, size: _size, className, ...rest }: React.HTMLAttributes<HTMLDivElement> & { status?: AlertStatus; variant?: AlertVariant; size?: string }) {
  const tone = {
    error: "border-error-base/30 bg-error-lighter text-error-dark",
    warning: "border-warning-base/30 bg-warning-lighter text-warning-dark",
    success: "border-success-base/30 bg-success-lighter text-success-dark",
    information: "border-information-base/30 bg-information-lighter text-information-dark",
    feature: "border-purple-300 bg-purple-50 text-purple-950",
  }[status];
  return <div role="status" className={cn("flex items-start gap-3 rounded-xl border px-4 py-3 text-sm", tone, className)} {...rest}>
    <span className="mt-0.5 shrink-0" aria-hidden="true">{statusIcon(status)}</span>
    <div className="flex min-w-0 flex-1 flex-col gap-0">{children}</div>
  </div>;
}

export function Icon({ as: As, ...props }: { as?: React.ElementType } & React.HTMLAttributes<HTMLElement>) {
  const Component = As || "span";
  return <Component {...props} />;
}

export function CloseIcon(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" aria-label="Close" className="shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current" {...props}><XIcon size={16} aria-hidden="true" /></button>;
}

export const AlertRoot = Root;
export const AlertIcon = Icon;
export const AlertCloseIcon = CloseIcon;
