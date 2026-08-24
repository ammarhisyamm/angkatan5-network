"use client";

import * as React from "react";
import { Dialog } from "@cloudflare/kumo/components/dialog";
import { Button } from "@cloudflare/kumo/components/button";
import { XIcon, CheckCircleIcon, WarningCircleIcon, InfoIcon, WarningIcon } from "@phosphor-icons/react";

export const ModalIconKind = {
  success: "success",
  error: "error",
  warning: "warning",
  info: "info",
  question: "question",
} as const;

export type ModalIconKindType = typeof ModalIconKind[keyof typeof ModalIconKind];

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  icon?: ModalIconKindType;
  iconSize?: number;
}

const sizeMap: Record<string, "sm" | "base" | "lg" | "xl" | undefined> = {
  sm: "sm",
  md: "base",
  lg: "lg",
  xl: "lg",
  "2xl": "xl",
};

const iconComponents = {
  success: CheckCircleIcon,
  error: XIcon,
  warning: WarningCircleIcon,
  info: InfoIcon,
  question: WarningIcon,
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "md",
  icon,
  iconSize = 24,
}: ModalProps) {
  const size = sizeMap[maxWidth] ?? "base";
  const showHeader = title || description || icon;
  const IconComponent = typeof icon === "string" ? iconComponents[icon] : undefined;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <Dialog size={size} className="p-0 overflow-hidden rounded-2xl">
        {showHeader && (
          <div className="flex items-start gap-4 border-b border-zinc-200 px-6 py-5 pr-12">
            {IconComponent && (
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200">
                <IconComponent size={20} weight="fill" className={icon === "success" ? "text-success-base" : icon === "error" ? "text-error-base" : icon === "warning" ? "text-warning-base" : "text-[#2563EB]"} />
              </span>
            )}
            <div className="min-w-0 flex-1">
              {title && <Dialog.Title className="text-[16px] font-semibold leading-5 text-[#111827]">{title}</Dialog.Title>}
              {description && <Dialog.Description className="mt-1.5 text-[13.5px] leading-5 text-zinc-500">{description}</Dialog.Description>}
            </div>
            <Dialog.Close
              aria-label="Close"
              render={(props: any) => (
                <Button {...props} variant="ghost" shape="square" icon={<XIcon />} aria-label="Close" className="absolute right-3 top-3" />
              )}
            />
          </div>
        )}
        {!showHeader && (
          <Dialog.Close
            aria-label="Close"
            render={(props: any) => (
              <Button {...props} variant="ghost" shape="square" icon={<XIcon />} aria-label="Close" className="absolute right-3 top-3" />
            )}
          />
        )}
        <div className="p-5">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 border-t border-kumo-line px-5 py-4">{footer}</div>}
      </Dialog>
    </Dialog.Root>
  );
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm",
  description,
  icon = "question",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  loading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  icon?: ModalIconKindType;
  confirmText?: string;
  cancelText?: string;
  variant?: "primary" | "secondary" | "outline";
  loading?: boolean;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} description={description} icon={icon} maxWidth="sm">
      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" size="base" onClick={onClose} disabled={loading} className="px-5">
          {cancelText}
        </Button>
        <Button variant={variant as any} size="lg" onClick={onConfirm} loading={loading} {...({} as any)} className="px-5">
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}