"use client";

import * as React from "react";
import { Button as KumoButton } from "@cloudflare/kumo/components/button";

export const compactButtonVariants = () => ({ root: () => "", icon: () => "" });

type CompactProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "stroke" | "ghost" | "white" | "modifiable";
  size?: "large" | "medium";
  fullRadius?: boolean;
};

export const Root = React.forwardRef<HTMLButtonElement, CompactProps>(
  ({ variant = "stroke", size = "large", fullRadius, children, className, ...rest }, ref) => {
    const kumoVariant = variant === "ghost" ? "ghost" : variant === "white" ? "secondary" : "outline";
    const kumoSize = size === "large" ? "base" : "sm";
    const shape = fullRadius ? "circle" : "square";
    return (
      <KumoButton ref={ref as any} variant={kumoVariant as any} size={kumoSize as any} shape={shape as any} className={className} {...(rest as any)}>
        {children}
      </KumoButton>
    );
  },
);
Root.displayName = "CompactButtonRoot";

export function Icon({ children, ...props }: any) {
  return <span {...props}>{children}</span>;
}
