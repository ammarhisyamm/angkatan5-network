"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";
}

export function Avatar({ name, className, ...props }: React.HTMLAttributes<HTMLSpanElement> & { name: string }) {
  return <span aria-label={name} role="img" className={cn("grid shrink-0 place-items-center rounded-full bg-primary-alpha-10 font-semibold text-primary-base ring-1 ring-stroke-soft-200", className)} {...props}>{initials(name)}</span>;
}
