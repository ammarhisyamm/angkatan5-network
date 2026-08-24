"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { CaretDownIcon, CaretUpIcon, CheckIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils/cn";

export interface SelectItem { label: string; value: string; }
export function Select({ label, value, onValueChange, items, placeholder, className }: { label?: string; value?: string; onValueChange?: (value: string) => void; items: SelectItem[]; placeholder?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();
  const listId = `${triggerId}-options`;
  const selected = items.find((item) => item.value === value);

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
    {label && <label htmlFor={triggerId} className="text-sm font-medium text-text-strong-950">{label}</label>}
    <button
      id={triggerId}
      type="button"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={open ? listId : undefined}
      onClick={() => setOpen((current) => !current)}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
        if (event.key === "ArrowDown" && !open) { event.preventDefault(); setOpen(true); }
      }}
      className="flex h-11 w-full min-w-0 items-center justify-between gap-3 rounded-lg bg-bg-white-0 px-3.5 text-left text-base text-text-strong-950 ring-1 ring-stroke-soft-200 transition-colors hover:bg-bg-weak-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40"
    >
      <span className={cn("truncate", !selected && "text-text-soft-400")}>{selected?.label ?? placeholder ?? "Select an option"}</span>
      {open ? <CaretUpIcon size={18} className="shrink-0 text-text-sub-600" aria-hidden="true" /> : <CaretDownIcon size={18} className="shrink-0 text-text-sub-600" aria-hidden="true" />}
    </button>
    {open && <div id={listId} role="listbox" aria-label={label ?? "Options"} className="absolute inset-x-0 top-full z-50 mt-2 max-h-64 overflow-auto rounded-xl bg-bg-white-0 p-1.5 shadow-[0_16px_32px_rgba(16,24,40,0.14)] ring-1 ring-stroke-soft-200">
      {placeholder && <button type="button" role="option" aria-selected={!selected} onClick={() => choose("")} className={cn("flex min-h-11 w-full items-center justify-between rounded-lg px-3.5 text-left text-base text-text-strong-950 transition-colors hover:bg-bg-weak-50", !selected && "bg-bg-weak-50")}>{placeholder}{!selected && <CheckIcon size={18} className="text-text-sub-600" aria-hidden="true" />}</button>}
      {items.map((item) => {
        const isSelected = item.value === value;
        return <button key={item.value} type="button" role="option" aria-selected={isSelected} onClick={() => choose(item.value)} className={cn("flex min-h-11 w-full items-center justify-between rounded-lg px-3.5 text-left text-base text-text-strong-950 transition-colors hover:bg-bg-weak-50", isSelected && "bg-bg-weak-50")}>{item.label}{isSelected && <CheckIcon size={18} className="text-text-sub-600" aria-hidden="true" />}</button>;
      })}
    </div>}
  </div>;
}
