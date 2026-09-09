import React from "react";
import { cn } from "@/lib/utils/cn";

export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "grid gap-4 border-t border-stroke-soft-200 px-5 py-5 first:border-t-0 sm:px-6 sm:py-6 md:grid-cols-[168px_minmax(0,1fr)] md:gap-8",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="text-label-sm text-text-strong-950">{title}</h2>
        {description && (
          <p className="mt-1 max-w-[28ch] text-paragraph-xs text-text-sub-600">
            {description}
          </p>
        )}
      </div>
      <div className="min-w-0 space-y-4">{children}</div>
    </section>
  );
}

export function FormActions({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse items-stretch justify-end gap-2 border-t border-stroke-soft-200 bg-bg-weak-25 px-5 py-4 sm:flex-row sm:items-center sm:px-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
