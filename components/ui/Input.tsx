"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils/cn";
import { tv, type VariantProps } from "@/lib/utils/tv";

export const inputVariants = tv({
  slots: {
    root: [
      "group relative flex w-full overflow-hidden bg-bg-white-0 text-text-strong-950 shadow-regular-xs",
      "transition duration-200 ease-out",
      "divide-x divide-stroke-soft-200",
      "before:absolute before:inset-0 before:ring-1 before:ring-inset before:ring-stroke-soft-200",
      "before:pointer-events-none before:rounded-[inherit]",
      "before:transition before:duration-200 before:ease-out",
      "hover:shadow-none",
      "has-[input:focus]:shadow-button-important-focus has-[input:focus]:before:ring-stroke-strong-950",
      "has-[input:disabled]:shadow-none has-[input:disabled]:before:ring-transparent",
    ],
    wrapper: [
      "group/input-wrapper flex w-full cursor-text items-center bg-bg-white-0",
      "transition duration-200 ease-out",
      "hover:[&:not(&:has(input:focus))]:bg-bg-weak-50",
      "has-[input:disabled]:pointer-events-none has-[input:disabled]:bg-bg-weak-50",
    ],
    input: [
      "w-full bg-transparent bg-none text-[13px] leading-5 text-text-strong-950 outline-none",
      "transition duration-200 ease-out",
      "placeholder:select-none placeholder:text-text-soft-400 placeholder:transition placeholder:duration-200 placeholder:ease-out",
      "group-hover/input-wrapper:placeholder:text-text-sub-600",
      "focus:outline-none",
      "group-has-[input:focus]:placeholder:text-text-sub-600",
      "disabled:text-text-disabled-300 disabled:placeholder:text-text-disabled-300",
    ],
  },
  variants: {
    size: { medium: { root: "rounded-xl", wrapper: "gap-2 px-3", input: "h-10" }, small: { root: "rounded-lg", wrapper: "gap-2 px-2", input: "h-9" }, xsmall: { root: "rounded-lg", wrapper: "gap-1 px-2", input: "h-8" } },
    hasError: {
      true: { root: ["before:ring-error-base", "has-[input:focus]:shadow-button-error-focus has-[input:focus]:before:ring-error-base"] },
      false: { root: ["hover:[&:not(:has(input:focus)):has(>:only-child)]:before:ring-transparent"] },
    },
  },
  defaultVariants: { size: "medium" },
});

// Legacy-compatible Input (label/error/helper)
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const hasError = !!error;
    const { root, wrapper, input } = inputVariants({ size: "medium", hasError });
    return (
      <div className="w-full flex flex-col gap-2">
        {label && <label htmlFor={inputId} className="text-label-sm text-text-strong-950 select-none">{label}</label>}
        <div className={root()}>
          <label className={wrapper()} htmlFor={inputId}>
            {leftIcon && <span className="flex size-5 shrink-0 items-center justify-center text-text-soft-400">{leftIcon}</span>}
            <input ref={ref} id={inputId} type={type} className={cn(input(), leftIcon && "", rightIcon && "", className)} {...props} />
            {rightIcon && <span className="flex size-5 shrink-0 items-center justify-center text-text-soft-400">{rightIcon}</span>}
          </label>
        </div>
        {error ? <p className="text-[11px] leading-4 text-error-base">{error}</p> : helperText ? <p className="text-[11px] leading-4 text-text-sub-600">{helperText}</p> : null}
      </div>
    );
  },
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, label, error, helperText, id, rows = 3, ...props }, ref) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  return (
    <div className="w-full flex flex-col gap-2">
      {label && <label htmlFor={textareaId} className="text-label-sm text-text-strong-950 select-none">{label}</label>}
      <div className={cn("group relative flex w-full overflow-hidden rounded-xl bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 has-[textarea:focus]:shadow-button-important-focus has-[textarea:focus]:ring-stroke-strong-950", error && "ring-error-base has-[textarea:focus]:shadow-button-error-focus has-[textarea:focus]:ring-error-base")}>
        <textarea ref={ref} id={textareaId} rows={rows} className={cn("w-full bg-transparent p-3 text-[13px] leading-5 text-text-strong-950 placeholder:text-text-soft-400 outline-none", className)} {...props} />
      </div>
      {error ? <p className="text-[11px] leading-4 text-error-base">{error}</p> : helperText ? <p className="text-[11px] leading-4 text-text-sub-600">{helperText}</p> : null}
    </div>
  );
});
Textarea.displayName = "Textarea";
