"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; helperText?: string; leftIcon?: React.ReactNode; rightIcon?: React.ReactNode; }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input({ label, error, helperText, leftIcon, rightIcon, id, className, required, disabled, ...props }, ref) {
  const inputId = id ?? props.name;
  const messageId = inputId ? `${inputId}-message` : undefined;
  return <label className="flex w-full flex-col gap-1.5" htmlFor={inputId}>
    {label && <span className="text-label-sm text-text-strong-950">{label}{required && <span className="ml-1 text-error-base">*</span>}</span>}
    <span className="relative flex items-center">
      {leftIcon && <span aria-hidden="true" className="pointer-events-none absolute left-3 text-text-sub-600">{leftIcon}</span>}
      <input ref={ref} id={inputId} required={required} disabled={disabled} aria-invalid={error ? true : undefined} aria-describedby={error || helperText ? messageId : undefined} className={cn("h-10 w-full rounded-10 bg-bg-white-0 px-3 text-base text-text-strong-950 shadow-custom-input outline-none transition duration-200 ease-out placeholder:text-text-soft-400 hover:bg-bg-weak-25 focus:bg-bg-white-0 focus:shadow-custom-input-active disabled:cursor-not-allowed disabled:bg-bg-weak-50 disabled:text-text-disabled-300 sm:text-sm", leftIcon && "pl-10", rightIcon && "pr-10", error && "shadow-[0_0_0_1px_var(--color-error-base)] focus:shadow-button-error-focus", className)} {...props} />
      {rightIcon && <span aria-hidden="true" className="pointer-events-none absolute right-3 text-text-sub-600">{rightIcon}</span>}
    </span>
    {(error || helperText) && <span id={messageId} role={error ? "alert" : undefined} className={cn("text-paragraph-xs", error ? "text-error-base" : "text-text-sub-600")}>{error || helperText}</span>}
  </label>;
});
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { label?: string; error?: string; helperText?: string; }
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ label, error, helperText, id, className, required, disabled, ...props }, ref) {
  const textareaId = id ?? props.name;
  const messageId = textareaId ? `${textareaId}-message` : undefined;
  return <label className="flex w-full flex-col gap-1.5" htmlFor={textareaId}>
    {label && <span className="text-label-sm text-text-strong-950">{label}{required && <span className="ml-1 text-error-base">*</span>}</span>}
    <textarea ref={ref} id={textareaId} required={required} disabled={disabled} aria-invalid={error ? true : undefined} aria-describedby={error || helperText ? messageId : undefined} className={cn("min-h-24 w-full resize-y rounded-10 bg-bg-white-0 px-3 py-2.5 text-base text-text-strong-950 shadow-custom-input outline-none transition duration-200 ease-out placeholder:text-text-soft-400 hover:bg-bg-weak-25 focus:bg-bg-white-0 focus:shadow-custom-input-active disabled:cursor-not-allowed disabled:bg-bg-weak-50 disabled:text-text-disabled-300 sm:text-sm", error && "shadow-[0_0_0_1px_var(--color-error-base)] focus:shadow-button-error-focus", className)} {...props} />
    {(error || helperText) && <span id={messageId} role={error ? "alert" : undefined} className={cn("text-paragraph-xs", error ? "text-error-base" : "text-text-sub-600")}>{error || helperText}</span>}
  </label>;
});
Textarea.displayName = "Textarea";
export const inputVariants = () => ({ root: () => "", wrapper: () => "", input: () => "" });
