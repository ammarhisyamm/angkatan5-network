"use client";

import * as React from "react";
import { format, parse } from "date-fns";
import { CalendarBlankIcon } from "@phosphor-icons/react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils/cn";

export interface DatePickerProps {
  label?: string;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  min?: string;
  required?: boolean;
  className?: string;
  helperText?: string;
  error?: string;
}

const parseDate = (value?: string) => (value ? parse(value, "yyyy-MM-dd", new Date()) : undefined);

export function DatePicker({
  label,
  name,
  value,
  onChange,
  placeholder = "Select a date",
  min,
  required,
  className,
  helperText,
  error,
}: DatePickerProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerId = React.useId();
  const messageId = `${triggerId}-message`;
  const [open, setOpen] = React.useState(false);
  const selectedDate = parseDate(value);
  const minimumDate = parseDate(min);
  const [month, setMonth] = React.useState(selectedDate ?? minimumDate ?? new Date());

  React.useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative flex min-w-0 flex-col gap-1.5", className)}>
      {label && <label htmlFor={triggerId} className="text-label-sm text-text-strong-950">{label}{required && <span className="ml-1 text-error-base">*</span>}</label>}
      {name && <input type="hidden" name={name} value={value ?? ""} required={required} readOnly />}
      <button
        id={triggerId}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        data-invalid={error ? true : undefined}
        aria-describedby={error || helperText ? messageId : undefined}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-10 w-full min-w-0 items-center justify-between gap-2 rounded-10 bg-bg-white-0 px-3 text-left text-sm text-text-strong-950 shadow-custom-input transition duration-200 hover:bg-bg-weak-25 focus-visible:outline-none focus-visible:shadow-custom-input-active",
          !selectedDate && "text-text-soft-400",
          error && "shadow-[0_0_0_1px_var(--color-error-base)] focus-visible:shadow-button-error-focus",
        )}
      >
        <span className="truncate">{selectedDate ? format(selectedDate, "dd MMM yyyy") : placeholder}</span>
        <CalendarBlankIcon size={18} className="shrink-0 text-text-sub-600" aria-hidden="true" />
      </button>
      {open && (
        <div role="dialog" aria-label={label ?? "Select date"} className="absolute inset-x-0 top-full z-50 mt-2 w-fit min-w-full rounded-10 bg-bg-white-0 p-2 shadow-custom-md ring-1 ring-stroke-soft-200">
          <Calendar
            mode="single"
            selected={selectedDate}
            month={month}
            onMonthChange={setMonth}
            onSelect={(date) => {
              if (date) {
                onChange?.(format(date, "yyyy-MM-dd"));
                setOpen(false);
              }
            }}
            disabled={minimumDate ? { before: minimumDate } : undefined}
          />
        </div>
      )}
      {(error || helperText) && <span id={messageId} role={error ? "alert" : undefined} className={cn("text-paragraph-xs", error ? "text-error-base" : "text-text-sub-600")}>{error || helperText}</span>}
    </div>
  );
}
