"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; helperText?: string; leftIcon?: React.ReactNode; rightIcon?: React.ReactNode; }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input({ label, error, helperText, leftIcon, rightIcon, id, className, ...props }, ref) {
  const inputId = id ?? props.name;
  return <label className="flex w-full flex-col gap-1.5" htmlFor={inputId}>
    {label && <span className="text-sm font-medium text-text-strong-950">{label}</span>}
    <span className="relative flex items-center">
      {leftIcon && <span aria-hidden="true" className="pointer-events-none absolute left-3 text-text-sub-600">{leftIcon}</span>}
      <input ref={ref} id={inputId} aria-invalid={error ? true : undefined} className={cn("h-11 w-full rounded-lg bg-bg-white-0 px-3.5 text-base text-text-strong-950 ring-1 ring-stroke-soft-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-colors placeholder:text-text-soft-400 hover:ring-text-sub-600 focus:ring-2 focus:ring-primary-base/40", leftIcon && "pl-10", rightIcon && "pr-10", error && "ring-error-base focus:ring-error-base/40", className)} {...props} />
      {rightIcon && <span aria-hidden="true" className="pointer-events-none absolute right-3 text-text-sub-600">{rightIcon}</span>}
    </span>
    {(error || helperText) && <span className={cn("text-xs", error ? "text-error-base" : "text-text-sub-600")}>{error || helperText}</span>}
  </label>;
});
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { label?: string; error?: string; helperText?: string; }
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ label, error, helperText, id, className, ...props }, ref) {
  const textareaId = id ?? props.name;
  return <label className="flex w-full flex-col gap-1.5" htmlFor={textareaId}>
    {label && <span className="text-sm font-medium text-text-strong-950">{label}</span>}
    <textarea ref={ref} id={textareaId} aria-invalid={error ? true : undefined} className={cn("min-h-28 w-full rounded-lg bg-bg-white-0 px-3.5 py-3 text-base text-text-strong-950 ring-1 ring-stroke-soft-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-colors placeholder:text-text-soft-400 focus:ring-2 focus:ring-primary-base/40", error && "ring-error-base", className)} {...props} />
    {(error || helperText) && <span className={cn("text-xs", error ? "text-error-base" : "text-text-sub-600")}>{error || helperText}</span>}
  </label>;
});
Textarea.displayName = "Textarea";
export const inputVariants = () => ({ root: () => "", wrapper: () => "", input: () => "" });
