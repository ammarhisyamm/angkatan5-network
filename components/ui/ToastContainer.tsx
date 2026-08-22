"use client";

import React from "react";
import { useApp } from "@/lib/store/AppContext";
import * as Alert from "@/components/ui/Alert";
import { RiCheckboxCircleFill, RiErrorWarningFill, RiAlertFill, RiInformationFill } from "@remixicon/react";

const iconMap = {
  success: RiCheckboxCircleFill,
  error: RiErrorWarningFill,
  warning: RiAlertFill,
  info: RiInformationFill,
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
    <div className="fixed bottom-6 right-6 z-50 flex w-full max-w-[380px] flex-col gap-3 pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const status = statusMap[toast.type || "info"] ?? "information";
        const Icon = iconMap[toast.type as keyof typeof iconMap] ?? RiInformationFill;
        return (
          <div key={toast.id} className="pointer-events-auto animate-in slide-in-from-bottom-2 fade-in duration-200">
            <Alert.Root status={status} variant="stroke" size="small" className="w-full shadow-regular-md">
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
