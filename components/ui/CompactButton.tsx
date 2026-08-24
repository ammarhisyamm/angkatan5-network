"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";

export const compactButtonVariants = () => ({ root: () => "", icon: () => "" });

type CompactProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "stroke" | "ghost" | "white" | "modifiable";
  size?: "large" | "medium";
  fullRadius?: boolean;
};

export const Root = React.forwardRef<HTMLButtonElement, CompactProps>(function CompactButton(
  { variant = "stroke", size = "large", fullRadius, children, className, ...rest }, ref,
) {
  const buttonVariant = variant === "ghost" ? "ghost" : variant === "white" ? "secondary" : variant === "modifiable" ? "subtle" : "outline";
  return <Button ref={ref} variant={buttonVariant} size={size === "large" ? "base" : "sm"} shape={fullRadius ? "circle" : "square"} className={className} {...rest}>{children}</Button>;
});
Root.displayName = "CompactButtonRoot";

export function Icon({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span {...props}>{children}</span>;
}
