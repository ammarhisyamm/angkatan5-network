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
  xs: "h-8 rounded-lg px-2.5 text-label-xs", sm: "h-9 rounded-lg px-3 text-label-sm", base: "h-9 rounded-10 px-3.5 text-label-sm", md: "h-10 rounded-10 px-3.5 text-label-sm", lg: "h-11 rounded-10 px-4 text-label-sm", icon: "size-9 rounded-lg p-0 text-label-sm",
} as const;

const variants = {
  primary: "bg-primary-base text-static-white shadow-regular-xs hover:bg-primary-darker focus-visible:shadow-button-primary-focus",
  secondary: "bg-bg-white-0 text-text-strong-950 ring-1 ring-stroke-soft-200 shadow-regular-xs hover:bg-bg-weak-50 hover:shadow-none focus-visible:shadow-button-important-focus",
  outline: "bg-transparent text-text-strong-950 ring-1 ring-stroke-soft-200 hover:bg-bg-weak-50 focus-visible:shadow-button-important-focus",
  ghost: "bg-transparent text-text-sub-600 hover:bg-bg-weak-50 hover:text-text-strong-950 focus-visible:shadow-button-important-focus",
  danger: "bg-error-base text-static-white shadow-regular-xs hover:bg-error-dark focus-visible:shadow-button-error-focus",
  subtle: "bg-primary-alpha-10 text-primary-base hover:bg-bg-white-0 hover:ring-1 hover:ring-primary-base focus-visible:shadow-button-primary-focus",
  link: "h-auto px-0 text-primary-base underline-offset-4 hover:underline focus-visible:shadow-button-primary-focus",
} as const;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", isLoading = false, loading = false, disabled, children, icon, shape = "base", ...props }, ref,
) {
  const busy = isLoading || loading;
  return <button ref={ref} type={props.type ?? "button"} aria-busy={busy || undefined} disabled={disabled || busy} className={cn("inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-medium leading-none transition-[background-color,border-color,color,box-shadow,transform] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50", sizes[size], variants[variant], shape === "circle" && "rounded-full", variant === "link" && "rounded-sm", className)} {...props}>
    {busy ? <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> : icon && <span aria-hidden={!children}>{icon}</span>}{children}
  </button>;
});

Button.displayName = "Button";
export const Root = Button;
export const Icon = ({ children }: { children?: React.ReactNode }) => <span className="flex size-5 shrink-0 items-center justify-center">{children}</span>;
export const buttonVariants = () => ({ root: () => "", icon: () => "" });
