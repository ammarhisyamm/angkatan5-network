"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

export interface PageHeaderProps {
  eyebrow?: string;
  icon?: React.ElementType;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, icon: Icon, title, description, actions, className }: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-1.5 flex items-center gap-1.5 text-label-xs text-text-soft-400">
            {Icon && <Icon size={14} aria-hidden="true" />}
            <span>{eyebrow}</span>
          </div>
        )}
        <h1 className="text-title-h5 text-text-strong-950 text-balance">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-paragraph-sm text-text-sub-600">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function SectionHeading({ title, description, action, className }: { title: string; description?: string; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-start justify-between gap-3", className)}>
      <div className="min-w-0">
        <h2 className="text-label-lg text-text-strong-950">{title}</h2>
        {description && <p className="mt-0.5 text-paragraph-xs text-text-sub-600">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
