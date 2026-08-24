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
  return <div className={`flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-stroke-soft-200 bg-bg-weak-50 p-8 text-center ${className ?? ""}`}>
    <Icon size={32} className="text-text-sub-600" aria-hidden="true" />
    <h2 className="mt-4 text-base font-semibold text-text-strong-950">{title}</h2>
    {description && <p className="mt-1 max-w-md text-sm leading-6 text-text-sub-600">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>;
}
