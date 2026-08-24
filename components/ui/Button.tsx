"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "subtle" | "link";
  size?: "xs" | "sm" | "base" | "md" | "lg" | "icon";
  isLoading?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  shape?: "base" | "square" | "circle";
}

const sizes = {
  xs: "h-7 px-2 text-xs", sm: "h-8 px-3 text-sm", base: "h-9 px-3.5 text-sm", md: "h-10 px-4 text-sm", lg: "h-11 px-4.5 text-sm", icon: "size-9 p-0 text-sm",
} as const;

const variants = {
  primary: "bg-kumo-brand text-static-white hover:bg-kumo-brand-hover focus-visible:ring-kumo-brand/40",
  secondary: "bg-kumo-base text-kumo-strong ring-1 ring-kumo-line hover:bg-kumo-tint focus-visible:ring-kumo-brand/40",
  outline: "bg-transparent text-kumo-strong ring-1 ring-kumo-line hover:bg-kumo-tint focus-visible:ring-kumo-brand/40",
  ghost: "bg-transparent text-kumo-subtle hover:bg-kumo-tint hover:text-kumo-strong focus-visible:ring-kumo-brand/40",
  danger: "bg-error-base text-static-white hover:bg-error-dark focus-visible:ring-error-base/40",
  subtle: "bg-primary-alpha-10 text-kumo-brand hover:bg-kumo-base hover:ring-1 hover:ring-kumo-brand focus-visible:ring-kumo-brand/40",
  link: "h-auto px-0 text-kumo-brand underline-offset-4 hover:underline focus-visible:ring-kumo-brand/40",
} as const;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", isLoading = false, loading = false, disabled, children, icon, shape = "base", ...props }, ref,
) {
  const busy = isLoading || loading;
  return <button ref={ref} type={props.type ?? "button"} aria-busy={busy || undefined} disabled={disabled || busy} className={cn("inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50", sizes[size], variants[variant], shape === "circle" && "rounded-full", variant === "link" && "rounded-sm", className)} {...props}>
    {busy ? <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> : icon}{children}
  </button>;
});

Button.displayName = "Button";
export const Root = Button;
export const Icon = ({ children }: { children?: React.ReactNode }) => <span className="flex size-5 shrink-0 items-center justify-center">{children}</span>;
export const buttonVariants = () => ({ root: () => "", icon: () => "" });
