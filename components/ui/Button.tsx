"use client";

import * as React from "react";
import { Button as KumoButton } from "@cloudflare/kumo/components/button";

// Compatibility wrapper — keeps existing app API (variant/size) but renders Kumo.
// Maps AlignUI variants → Kumo variants. Subtle preserved as blue-tint via Kumo ghost + custom class.

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "subtle" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  icon?: React.ReactNode;
  shape?: "base" | "square" | "circle";
}

const variantMap: Record<string, "primary" | "secondary" | "ghost" | "outline" | "destructive"> = {
  primary: "primary",
  secondary: "secondary",
  outline: "outline",
  ghost: "ghost",
  subtle: "ghost", // blue-tint handled via className below
  danger: "destructive",
  link: "ghost",
};

const sizeMap: Record<string, "xs" | "sm" | "base" | "lg"> = {
  sm: "base",
  md: "lg",
  lg: "lg",
  icon: "sm",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, disabled, children, icon, shape, ...props }, ref) => {
    const kumoVariant = variantMap[variant] ?? "secondary";
    const kumoSize = sizeMap[size] ?? "base";
    const isIcon = size === "icon";
    const kumoShape = shape ?? (isIcon ? "square" : "base");
    const subtleClass = variant === "subtle" ? "bg-primary-alpha-10 text-kumo-brand hover:bg-kumo-base hover:ring-1 hover:ring-kumo-brand" : "";
    const linkClass = variant === "link" ? "underline-offset-4 hover:underline p-0 h-auto" : "";
    return (
      <KumoButton
        ref={ref as any}
        variant={kumoVariant}
        size={kumoSize}
        shape={kumoShape as any}
        icon={icon}
        loading={isLoading}
        disabled={disabled || isLoading}
        className={`${subtleClass} ${linkClass} ${className ?? ""}`}
        {...(props as any)}
      >
        {children}
      </KumoButton>
    );
  },
);
Button.displayName = "Button";

// Keep legacy exports for any direct Root/Icon usage (not used in pages, but preserve)
export const Root = Button;
export const Icon = ({ children }: { children?: React.ReactNode }) => <span className="flex size-5 shrink-0 items-center justify-center">{children}</span>;
export const buttonVariants = () => ({ root: () => "", icon: () => "" });
