"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";
}

export function Avatar({ name, src, className, ...props }: React.HTMLAttributes<HTMLSpanElement> & { name: string; src?: string }) {
  const [imgError, setImgError] = React.useState(false);
  if (src && !imgError) {
    return (
      <span className={cn("relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-bg-weak-50 ring-1 ring-stroke-soft-200", className)} {...props}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={name} onError={() => setImgError(true)} className="size-full object-cover aspect-square" loading="lazy" decoding="async" />
      </span>
    );
  }
  return <span aria-label={name} role="img" className={cn("grid shrink-0 place-items-center rounded-full bg-primary-alpha-10 font-semibold text-primary-base ring-1 ring-stroke-soft-200", className)} {...props}>{initials(name)}</span>;
}
