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
      <Dialog size={size} className="p-0 overflow-hidden">
        {showHeader && (
          <div className="flex items-start gap-3 border-b border-kumo-line px-5 py-4 pr-12">
            {IconComponent && (
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-kumo-tint ring-1 ring-inset ring-kumo-line">
                <IconComponent size={24} weight="fill" className={`text-${icon === "success" ? "success" : icon === "error" ? "error" : icon === "warning" ? "warning" : "kumo-brand"}`} />
              </span>
            )}
            <div className="min-w-0 flex-1">
              {title && <Dialog.Title className="text-base font-semibold leading-6 text-kumo-strong">{title}</Dialog.Title>}
              {description && <Dialog.Description className="mt-1 text-sm leading-5 text-kumo-subtle">{description}</Dialog.Description>}
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
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-kumo-line">
        <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant={variant as "primary" | "secondary" | "outline"} size="sm" onClick={onConfirm} isLoading={loading} {...({} as any)}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}