"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { CalendarBlankIcon, CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils/cn";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function parseDate(value?: string) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function toValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export interface DatePickerProps {
  label?: string;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  min?: string;
  required?: boolean;
  className?: string;
}

export function DatePicker({ label, name, value, onChange, placeholder = "Select a date", min, required, className }: DatePickerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerId = React.useId();
  const [open, setOpen] = useState(false);
  const selectedDate = parseDate(value);
  const minimumDate = parseDate(min);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const initial = selectedDate ?? minimumDate ?? startOfToday();
    return new Date(initial.getFullYear(), initial.getMonth(), 1);
  });

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open]);

  useEffect(() => {
    const nextSelectedDate = parseDate(value);
    if (nextSelectedDate) setVisibleMonth(new Date(nextSelectedDate.getFullYear(), nextSelectedDate.getMonth(), 1));
  }, [value]);

  const days = useMemo(() => {
    const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1).getDay();
    const totalDays = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
    return [...Array(firstDay).fill(null), ...Array.from({ length: totalDays }, (_, index) => index + 1)];
  }, [visibleMonth]);

  const monthLabel = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(visibleMonth);
  const isPreviousMonthDisabled = !!minimumDate && visibleMonth <= new Date(minimumDate.getFullYear(), minimumDate.getMonth(), 1);
  const dateLabel = selectedDate
    ? new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" }).format(selectedDate)
    : placeholder;

  const moveMonth = (amount: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  };

  const chooseDate = (day: number) => {
    const nextDate = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
    if (minimumDate && nextDate < minimumDate) return;
    onChange?.(toValue(nextDate));
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn("relative flex min-w-0 flex-col gap-1.5", className)}>
      {label && <label htmlFor={triggerId} className="text-label-sm text-text-strong-950">{label}{required && <span className="ml-1 text-error-base">*</span>}</label>}
      {name && <input type="hidden" name={name} value={value ?? ""} required={required} readOnly />}
      <button
        id={triggerId}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}
        className="flex h-10 w-full min-w-0 items-center justify-between gap-2 rounded-10 bg-bg-white-0 px-3 text-left text-base text-text-strong-950 ring-1 ring-stroke-soft-200 shadow-regular-xs transition duration-200 ease-out hover:bg-bg-weak-50 hover:shadow-none focus-visible:outline-none focus-visible:shadow-button-important-focus focus-visible:ring-stroke-strong-950 sm:text-sm"
      >
        <span className={cn("truncate", !selectedDate && "text-text-soft-400")}>{dateLabel}</span>
        <CalendarBlankIcon size={18} className="shrink-0 text-text-sub-600" aria-hidden="true" />
      </button>

      {open && (
        <div role="dialog" aria-label={`${label ?? "Date"} calendar`} onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }} className="absolute inset-x-0 top-full z-50 mt-2 rounded-xl bg-bg-white-0 p-3 shadow-regular-md ring-1 ring-stroke-soft-200">
          <div className="mb-3 flex items-center justify-between">
            <button type="button" aria-label="Previous month" disabled={isPreviousMonthDisabled} onClick={() => moveMonth(-1)} className="flex size-8 items-center justify-center rounded-lg text-text-sub-600 hover:bg-bg-weak-50 hover:text-text-strong-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent">
              <CaretLeftIcon size={16} aria-hidden="true" />
            </button>
            <p className="text-sm font-semibold text-text-strong-950">{monthLabel}</p>
            <button type="button" aria-label="Next month" onClick={() => moveMonth(1)} className="flex size-8 items-center justify-center rounded-lg text-text-sub-600 hover:bg-bg-weak-50 hover:text-text-strong-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base">
              <CaretRightIcon size={16} aria-hidden="true" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-label-sm text-text-soft-400">
            {WEEKDAYS.map((day) => <span key={day} className="py-1">{day}</span>)}
            {days.map((day, index) => {
              if (!day) return <span key={`empty-${index}`} className="size-10" aria-hidden="true" />;
              const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
              const dateValue = toValue(date);
              const isSelected = dateValue === value;
              const isDisabled = !!minimumDate && date < minimumDate;
              return (
                <button
                  key={dateValue}
                  type="button"
                  disabled={isDisabled}
                  aria-label={new Intl.DateTimeFormat(undefined, { dateStyle: "full" }).format(date)}
                  aria-pressed={isSelected}
                  onClick={() => chooseDate(day)}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg text-label-sm text-text-strong-950 transition duration-200 ease-out hover:bg-bg-weak-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base",
                    isSelected && "bg-primary-base font-semibold text-static-white hover:bg-primary-darker",
                    isDisabled && "cursor-not-allowed text-text-disabled-300 hover:bg-transparent",
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
