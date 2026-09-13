"use client";

import * as React from "react";
import {
  Select as SelectRoot,
  SelectContent,
  SelectItem as SelectOption,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select-primitive";
import { cn } from "@/lib/utils/cn";

export interface SelectItem { label: string; value: string; }
export interface SelectProps {
  label?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  items: SelectItem[];
  placeholder?: string;
  className?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  "aria-label"?: string;
}

export function Select({ label, value, onValueChange, items, placeholder = "Select an option", className, helperText, error, required, "aria-label": ariaLabel }: SelectProps) {
  const triggerId = React.useId();
  const messageId = `${triggerId}-message`;
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      {label && <label htmlFor={triggerId} className="text-label-sm text-text-strong-950">{label}{required && <span className="ml-1 text-error-base">*</span>}</label>}
      <SelectRoot value={value || null} onValueChange={(nextValue) => onValueChange?.(nextValue ?? "")}>
        <SelectTrigger id={triggerId} aria-label={ariaLabel} aria-invalid={error ? true : undefined} aria-describedby={error || helperText ? messageId : undefined} className="h-10 w-full rounded-10 border-0 bg-bg-white-0 px-3 text-sm text-text-strong-950 shadow-custom-input hover:bg-bg-weak-25 data-placeholder:text-text-soft-400">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent align="start" className="rounded-10 bg-bg-white-0 p-1.5 ring-1 ring-stroke-soft-200">
          {items.map((item) => <SelectOption key={item.value} value={item.value} className="min-h-10 rounded-lg px-3 text-sm text-text-strong-950 focus:bg-bg-weak-50 focus:text-text-strong-950">{item.label}</SelectOption>)}
        </SelectContent>
      </SelectRoot>
      {(error || helperText) && <span id={messageId} role={error ? "alert" : undefined} className={cn("text-paragraph-xs", error ? "text-error-base" : "text-text-sub-600")}>{error || helperText}</span>}
    </div>
  );
}
