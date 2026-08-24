"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { XIcon, CheckCircleIcon, WarningCircleIcon, InfoIcon, WarningIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";

export const ModalIconKind = { success: "success", error: "error", warning: "warning", info: "info", question: "question" } as const;
export type ModalIconKindType = typeof ModalIconKind[keyof typeof ModalIconKind];
type ModalProps = { isOpen: boolean; onClose: () => void; title?: string; description?: string; children?: React.ReactNode; footer?: React.ReactNode; maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl"; icon?: ModalIconKindType; centered?: boolean };
const widths = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-xl", "2xl": "max-w-2xl" };
const icons = { success: CheckCircleIcon, error: XIcon, warning: WarningCircleIcon, info: InfoIcon, question: WarningIcon };

export function Modal({ isOpen, onClose, title, description, children, footer, maxWidth = "md", icon, centered }: ModalProps) {
  const Icon = icon ? icons[icon] : null;
  if (centered) {
    return <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" />
        <Dialog.Content className={`fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-bg-white-0 shadow-2xl focus:outline-none ${widths[maxWidth]}`}>
          <div className="relative flex flex-col items-center gap-4 px-6 pt-8 pb-6 text-center">
            <Dialog.Close asChild><Button variant="ghost" size="icon" aria-label="Close" className="absolute right-3 top-3"><XIcon size={16} /></Button></Dialog.Close>
            {Icon && <span className="grid size-12 place-items-center rounded-full bg-success-lighter text-success-base"><Icon size={24} weight="fill" /></span>}
            <div>{title && <Dialog.Title className="text-base font-semibold text-text-strong-950">{title}</Dialog.Title>}{description && <Dialog.Description className="mt-1 text-sm leading-5 text-text-sub-600">{description}</Dialog.Description>}</div>
          </div>
          {(children || footer) && <div className="border-t border-stroke-soft-200 bg-bg-white-0 px-6 py-4">{footer ? <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">{footer}</div> : <div className="flex justify-center">{children}</div>}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>;
  }
  return <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
    <Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" />
      <Dialog.Content className={`fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-bg-white-0 shadow-2xl focus:outline-none ${widths[maxWidth]}`}>
        <div className="flex items-start gap-3 border-b border-stroke-soft-200 px-5 py-4">
          {Icon && <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-bg-weak-50 text-primary-base"><Icon size={18} weight="fill" /></span>}
          <div className="min-w-0 flex-1">{title && <Dialog.Title className="text-base font-semibold text-text-strong-950">{title}</Dialog.Title>}{description && <Dialog.Description className="mt-1 text-sm leading-5 text-text-sub-600">{description}</Dialog.Description>}</div>
          <Dialog.Close asChild><Button variant="ghost" size="icon" aria-label="Close"><XIcon size={16} /></Button></Dialog.Close>
        </div>
        <div className="p-5">{children}</div>
        {footer && <div className="flex flex-col-reverse gap-2 border-t border-stroke-soft-200 px-5 py-4 sm:flex-row sm:justify-end">{footer}</div>}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title = "Confirm", description, icon = "question", confirmText = "Confirm", cancelText = "Cancel", variant = "primary", loading = false }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; title?: string; description?: string; icon?: ModalIconKindType; confirmText?: string; cancelText?: string; variant?: "primary" | "secondary" | "outline"; loading?: boolean; }) {
  return <Modal isOpen={isOpen} onClose={onClose} title={title} description={description} icon={icon} maxWidth="sm"><div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button variant="outline" size="md" className="w-full sm:w-auto" onClick={onClose} disabled={loading}>{cancelText}</Button><Button variant={variant === "outline" ? "outline" : variant} size="md" className="w-full sm:w-auto" onClick={onConfirm} loading={loading}>{confirmText}</Button></div></Modal>;
}
