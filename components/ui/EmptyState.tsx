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
  return <div className={`flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-kumo-line bg-kumo-tint p-8 text-center ${className ?? ""}`}>
    <Icon size={32} className="text-kumo-subtle" aria-hidden="true" />
    <h2 className="mt-4 text-base font-semibold text-kumo-strong">{title}</h2>
    {description && <p className="mt-1 max-w-md text-sm leading-6 text-kumo-subtle">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>;
}
