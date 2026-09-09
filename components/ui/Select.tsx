"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { CaretDownIcon, CaretUpIcon, CheckIcon } from "@phosphor-icons/react";
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
export function Select({ label, value, onValueChange, items, placeholder, className, helperText, error, required, "aria-label": ariaLabel }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();
  const listId = `${triggerId}-options`;
  const messageId = `${triggerId}-message`;
  const selected = items.find((item) => item.value === value);
  const allOptions = placeholder ? [{ label: placeholder, value: "" }, ...items] : items;

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open]);

  const choose = (nextValue: string) => {
    onValueChange?.(nextValue);
    setOpen(false);
  };

  return <div ref={rootRef} className={cn("relative flex min-w-0 flex-col gap-1.5", className)}>
    {label && <label htmlFor={triggerId} className="text-label-sm text-text-strong-950">{label}{required && <span className="ml-1 text-error-base">*</span>}</label>}
    <button
      id={triggerId}
      type="button"
      aria-label={ariaLabel}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={open ? listId : undefined}
      aria-invalid={error ? true : undefined}
      aria-describedby={error || helperText ? messageId : undefined}
      aria-activedescendant={open && activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined}
      onClick={() => setOpen((current) => !current)}
      onKeyDown={(event) => {
        if (event.key === "Escape") { setOpen(false); setActiveIndex(-1); }
        else if (event.key === "ArrowDown") {
          event.preventDefault();
          if (!open) { setOpen(true); setActiveIndex(0); }
          else setActiveIndex((i) => Math.min(i + 1, allOptions.length - 1));
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          if (open) setActiveIndex((i) => Math.max(i - 1, 0));
        } else if (event.key === "Enter" && open && activeIndex >= 0) {
          event.preventDefault();
          choose(allOptions[activeIndex].value);
        }
      }}
      className={cn("flex h-10 w-full min-w-0 items-center justify-between gap-2 rounded-10 bg-bg-white-0 px-3 text-left text-base text-text-strong-950 shadow-custom-input transition duration-200 ease-out hover:bg-bg-weak-25 focus-visible:bg-bg-white-0 focus-visible:outline-none focus-visible:shadow-custom-input-active sm:text-sm", error && "shadow-[0_0_0_1px_var(--color-error-base)] focus-visible:shadow-button-error-focus")}
    >
      <span className={cn("truncate", !selected && "text-text-soft-400")}>{selected?.label ?? placeholder ?? "Select an option"}</span>
      {open ? <CaretUpIcon size={18} className="shrink-0 text-text-sub-600" aria-hidden="true" /> : <CaretDownIcon size={18} className="shrink-0 text-text-sub-600" aria-hidden="true" />}
    </button>
    {open && <div id={listId} role="listbox" aria-label={label ?? "Options"} className="absolute inset-x-0 top-full z-50 mt-2 max-h-64 overflow-auto rounded-10 bg-bg-white-0 p-1.5 shadow-custom-md ring-1 ring-stroke-soft-200">
      {placeholder && <button id={`${listId}-option-0`} type="button" role="option" aria-selected={!selected} onClick={() => choose("")} className={cn("flex min-h-11 w-full items-center justify-between rounded-lg px-3.5 text-left text-base text-text-strong-950 transition-colors hover:bg-bg-weak-50", !selected && "bg-bg-weak-50", activeIndex === 0 && "bg-bg-weak-50 ring-1 ring-primary-base/20")}>{placeholder}{!selected && <CheckIcon size={18} className="text-text-sub-600" aria-hidden="true" />}</button>}
      {items.map((item, idx) => {
        const optionIndex = placeholder ? idx + 1 : idx;
        const isSelected = item.value === value;
        const isActive = activeIndex === optionIndex;
        return <button key={item.value} id={`${listId}-option-${optionIndex}`} type="button" role="option" aria-selected={isSelected} onClick={() => choose(item.value)} className={cn("flex min-h-11 w-full items-center justify-between rounded-lg px-3.5 text-left text-base text-text-strong-950 transition-colors hover:bg-bg-weak-50", isSelected && "bg-bg-weak-50", isActive && "bg-bg-weak-50 ring-1 ring-primary-base/20")}>{item.label}{isSelected && <CheckIcon size={18} className="text-text-sub-600" aria-hidden="true" />}</button>;
      })}
    </div>}
    {(error || helperText) && <span id={messageId} role={error ? "alert" : undefined} className={cn("text-paragraph-xs", error ? "text-error-base" : "text-text-sub-600")}>{error || helperText}</span>}
  </div>;
}
