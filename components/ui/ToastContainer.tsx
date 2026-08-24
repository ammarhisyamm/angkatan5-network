"use client";

import React from "react";
import { useApp } from "@/lib/store/AppContext";
import * as Alert from "@/components/ui/Alert";

const statusMap: Record<string, "success" | "error" | "warning" | "information" | "feature"> = {
  success: "success",
  error: "error",
  warning: "warning",
  info: "information",
};

export function ToastContainer() {
  const { toasts, removeToast } = useApp();
  if (toasts.length === 0) return null;

  return (
    <div aria-live="polite" aria-atomic="true" className="fixed left-1/2 top-6 z-50 flex w-[calc(100%-2rem)] max-w-[460px] -translate-x-1/2 flex-col gap-3 pointer-events-none overscroll-contain sm:top-8">
      {toasts.map((toast) => {
        const status = statusMap[toast.type || "info"] ?? "information";
        return (
          <div key={toast.id} className="pointer-events-auto transition-[transform,opacity] duration-300 ease-[var(--ease-out)] data-[state=open]:animate-in data-[state=closed]:animate-out" style={{ transform: 'translateY(0)', opacity: 1 }}>
            <Alert.Root status={status} variant="stroke" size="small" className="w-full shadow-md">
              <div className="flex flex-1 flex-col gap-0">
                <span className="text-sm font-semibold leading-5 text-kumo-strong">{toast.title}</span>
                {toast.description && <span className="text-xs leading-4 text-kumo-subtle">{toast.description}</span>}
              </div>
              <Alert.CloseIcon onClick={() => removeToast(toast.id)} />
            </Alert.Root>
          </div>
        );
      })}
    </div>
  );
}
