"use client";

import React from "react";

export interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return <div className={`flex min-h-56 flex-col items-center justify-center rounded-10 border border-dashed border-stroke-soft-200 bg-bg-weak-50 p-8 text-center ${className ?? ""}`}>
    <span className="grid size-12 place-items-center rounded-full bg-bg-white-0 text-text-sub-600 shadow-regular-xs ring-1 ring-stroke-soft-200">
      <Icon size={24} aria-hidden="true" />
    </span>
    <h2 className="mt-4 text-label-lg text-text-strong-950">{title}</h2>
    {description && <p className="mt-1 max-w-md text-paragraph-sm text-text-sub-600">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>;
}
