import React from "react";
import { cn } from "@/lib/utils/cn";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-bg-weak-50", className)} {...props} />;
}

export function ProfileCardSkeleton() {
  return (
    <div className="bg-bg-white-0 border border-stroke-soft-200 rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <Skeleton className="w-12 h-12 rounded-full shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <Skeleton className="h-3 w-1/2 rounded-md" />
          <Skeleton className="h-3 w-1/3 rounded-md" />
        </div>
      </div>
      <div className="flex gap-1 flex-wrap">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-stroke-soft-200">
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  );
}

export function OpportunityCardSkeleton() {
  return (
    <div className="bg-bg-white-0 border border-stroke-soft-200 rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-5 w-4/5 rounded-md" />
          <Skeleton className="h-3 w-full rounded-md" />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-stroke-soft-200">
        <div className="flex items-center gap-2">
          <Skeleton className="w-7 h-7 rounded-full" />
          <Skeleton className="h-3 w-24 rounded-md" />
        </div>
        <Skeleton className="h-8 w-28 rounded-md" />
      </div>
    </div>
  );
}
