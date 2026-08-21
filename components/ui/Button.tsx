"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import type { PolymorphicComponentProps } from "@/lib/utils/polymorphic";
import { recursiveCloneChildren } from "@/lib/utils/recursive-clone-children";
import { tv, type VariantProps } from "@/lib/utils/tv";

const BUTTON_ROOT_NAME = "ButtonRoot";
const BUTTON_ICON_NAME = "ButtonIcon";

export const buttonVariants = tv({
  slots: {
    root: [
      "group relative inline-flex items-center justify-center whitespace-nowrap outline-none",
      "transition duration-200 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:bg-bg-weak-50 disabled:text-text-disabled-300 disabled:ring-transparent",
    ],
    icon: ["flex size-5 shrink-0 items-center justify-center"],
  },
  variants: {
    variant: { primary: {}, neutral: {}, error: {} },
    mode: {
      filled: {},
      stroke: { root: "ring-1 ring-inset" },
      lighter: { root: "ring-1 ring-inset" },
      ghost: { root: "ring-1 ring-inset" },
    },
    size: {
      medium: { root: "h-10 gap-2 rounded-lg px-4 text-[13px] font-medium leading-5", icon: "-mx-1" },
      small: { root: "h-9 gap-2 rounded-lg px-3.5 text-[13px] font-medium leading-5", icon: "-mx-1" },
      xsmall: { root: "h-8 gap-1.5 rounded-lg px-3 text-[13px] font-medium leading-5", icon: "-mx-1" },
      xxsmall: { root: "h-7 gap-1.5 rounded-md px-2.5 text-xs font-medium leading-none", icon: "-mx-1" },
    },
  },
  compoundVariants: [
    { variant: "primary", mode: "filled", class: { root: ["bg-primary-base text-static-white hover:bg-primary-darker focus-visible:shadow-button-primary-focus"] } },
    { variant: "primary", mode: "stroke", class: { root: ["bg-bg-white-0 text-primary-base ring-primary-base hover:bg-primary-alpha-10 hover:ring-transparent focus-visible:shadow-button-primary-focus"] } },
    { variant: "primary", mode: "lighter", class: { root: ["bg-primary-alpha-10 text-primary-base ring-transparent hover:bg-bg-white-0 hover:ring-primary-base focus-visible:bg-bg-white-0 focus-visible:shadow-button-primary-focus focus-visible:ring-primary-base"] } },
    { variant: "primary", mode: "ghost", class: { root: ["bg-transparent text-primary-base ring-transparent hover:bg-primary-alpha-10 focus-visible:bg-bg-white-0 focus-visible:shadow-button-primary-focus focus-visible:ring-primary-base"] } },
    { variant: "neutral", mode: "filled", class: { root: ["bg-bg-strong-950 text-text-static-white-0 hover:bg-bg-surface-800 focus-visible:shadow-button-important-focus"] } },
    { variant: "neutral", mode: "stroke", class: { root: ["bg-bg-white-0 text-text-sub-600 shadow-regular-xs ring-stroke-soft-200 hover:bg-bg-weak-50 hover:text-text-strong-950 hover:shadow-none hover:ring-transparent focus-visible:text-text-strong-950 focus-visible:shadow-button-important-focus focus-visible:ring-stroke-strong-950"] } },
    { variant: "neutral", mode: "lighter", class: { root: ["bg-bg-weak-50 text-text-sub-600 ring-transparent hover:bg-bg-white-0 hover:text-text-strong-950 hover:shadow-regular-xs hover:ring-stroke-soft-200 focus-visible:bg-bg-white-0 focus-visible:text-text-strong-950 focus-visible:shadow-button-important-focus focus-visible:ring-stroke-strong-950"] } },
    { variant: "neutral", mode: "ghost", class: { root: ["bg-transparent text-text-sub-600 ring-transparent hover:bg-bg-weak-50 hover:text-text-strong-950 focus-visible:bg-bg-white-0 focus-visible:text-text-strong-950 focus-visible:shadow-button-important-focus focus-visible:ring-stroke-strong-950"] } },
    { variant: "error", mode: "filled", class: { root: ["bg-error-base text-static-white hover:bg-red-700 focus-visible:shadow-button-error-focus"] } },
    { variant: "error", mode: "stroke", class: { root: ["bg-bg-white-0 text-error-base ring-error-base hover:bg-red-alpha-10 hover:ring-transparent focus-visible:shadow-button-error-focus"] } },
    { variant: "error", mode: "lighter", class: { root: ["bg-red-alpha-10 text-error-base ring-transparent hover:bg-bg-white-0 hover:ring-error-base focus-visible:bg-bg-white-0 focus-visible:shadow-button-error-focus focus-visible:ring-error-base"] } },
    { variant: "error", mode: "ghost", class: { root: ["bg-transparent text-error-base ring-transparent hover:bg-red-alpha-10 focus-visible:bg-bg-white-0 focus-visible:shadow-button-error-focus focus-visible:ring-error-base"] } },
  ],
  defaultVariants: { variant: "primary", mode: "filled", size: "medium" },
});

type ButtonSharedProps = VariantProps<typeof buttonVariants>;
type ButtonRootProps = VariantProps<typeof buttonVariants> &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean };

const ButtonRoot = React.forwardRef<HTMLButtonElement, ButtonRootProps>(
  ({ children, variant, mode, size, asChild, className, ...rest }, forwardedRef) => {
    const uniqueId = React.useId();
    const Component = asChild ? Slot : "button";
    const { root } = buttonVariants({ variant, mode, size });
    const sharedProps: ButtonSharedProps = { variant, mode, size };
    const extendedChildren = recursiveCloneChildren(children as React.ReactElement[], sharedProps, [BUTTON_ICON_NAME], uniqueId, asChild);
    return (
      <Component ref={forwardedRef} className={root({ class: className })} {...rest}>
        {extendedChildren}
      </Component>
    );
  },
);
ButtonRoot.displayName = BUTTON_ROOT_NAME;

function ButtonIcon<T extends React.ElementType>({ variant, mode, size, as, className, ...rest }: PolymorphicComponentProps<T, ButtonSharedProps>) {
  const Component = as || "div";
  const { icon } = buttonVariants({ mode, variant, size });
  return <Component className={icon({ class: className })} {...rest} />;
}
ButtonIcon.displayName = BUTTON_ICON_NAME;

// Compatibility wrapper for existing codebase (variant: primary|secondary|outline|ghost|subtle|danger|link)
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "subtle" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const variantMap: Record<string, { variant: "primary" | "neutral" | "error"; mode: "filled" | "stroke" | "lighter" | "ghost" }> = {
  primary: { variant: "primary", mode: "filled" },
  secondary: { variant: "neutral", mode: "lighter" },
  outline: { variant: "neutral", mode: "stroke" },
  ghost: { variant: "neutral", mode: "ghost" },
  subtle: { variant: "primary", mode: "lighter" },
  danger: { variant: "error", mode: "filled" },
  link: { variant: "primary", mode: "ghost" },
};
const sizeMap: Record<string, "medium" | "small" | "xsmall" | "xxsmall"> = {
  sm: "xsmall",
  md: "small",
  lg: "medium",
  icon: "xsmall",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, disabled, children, ...props }, ref) => {
    const mapped = variantMap[variant] ?? variantMap.primary;
    const mappedSize = sizeMap[size] ?? "small";
    const linkExtra = variant === "link" ? "underline-offset-4 hover:underline p-0 h-auto" : "";
    return (
      <ButtonRoot ref={ref} variant={mapped.variant} mode={mapped.mode} size={mappedSize} disabled={disabled || isLoading} className={`${linkExtra} ${className ?? ""}`} {...props}>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </ButtonRoot>
    );
  },
);
Button.displayName = "Button";

export { ButtonRoot as Root, ButtonIcon as Icon };
