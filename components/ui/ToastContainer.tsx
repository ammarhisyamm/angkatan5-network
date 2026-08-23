"use client";

import React from "react";
import { useApp } from "@/lib/store/AppContext";
import * as Alert from "@/components/ui/Alert";
import { CheckCircleIcon, XCircleIcon, WarningCircleIcon, InfoIcon } from "@phosphor-icons/react";

const iconMap = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: WarningCircleIcon,
  info: InfoIcon,
};

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
    <div aria-live="polite" aria-atomic="true" className="fixed bottom-6 right-6 z-50 flex w-full max-w-[380px] flex-col gap-3 pointer-events-none px-4 sm:px-0 overscroll-contain">
      {toasts.map((toast) => {
        const status = statusMap[toast.type || "info"] ?? "information";
        const Icon = iconMap[toast.type as keyof typeof iconMap] ?? InfoIcon;
        return (
          <div key={toast.id} className="pointer-events-auto transition-[transform,opacity] duration-300 ease-[var(--ease-out)] data-[state=open]:animate-in data-[state=closed]:animate-out" style={{ transform: 'translateY(0)', opacity: 1 }}>
            <Alert.Root status={status} variant="stroke" size="small" className="w-full shadow-md">
              <Alert.Icon as={Icon} />
              <div className="flex flex-1 flex-col gap-0">
                <span className="text-sm font-semibold leading-5 text-kumo-strong">{toast.title}</span>
                {toast.description && <span className="text-xs leading-4 text-kumo-subtle">{toast.description}</span>}
              </div>
              <button type="button" onClick={() => removeToast(toast.id)} className="shrink-0">
                <Alert.CloseIcon />
              </button>
            </Alert.Root>
          </div>
        );
      })}
    </div>
  );
}
