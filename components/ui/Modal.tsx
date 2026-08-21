"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { RiCloseLine, type RemixiconComponentType } from "@remixicon/react";
import { cn } from "@/lib/utils/cn";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  /** Optional footer row (actions). Rendered below body with top divider. */
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  icon?: RemixiconComponentType;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

/**
 * Unified modal — AlignUI-style:
 * - Overlay: bg-overlay + backdrop-blur
 * - Content: rounded-2xl (16px), border, minimal shadow
 * - Header: icon well (rounded-lg ring-stroke-soft-200) + title/description, bottom divider
 * - Body: p-5 (20px)
 * - Footer: optional, top divider, right-aligned actions
 * - Close: ghost compact button, consistent position
 */
export function Modal({ isOpen, onClose, title, description, children, footer, maxWidth = "md", icon: Icon }: ModalProps) {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-overlay backdrop-blur-[8px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-stroke-soft-200 bg-bg-white-0 shadow-regular-md focus:outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            maxWidthClasses[maxWidth],
          )}
          aria-describedby={undefined}
        >
          {(title || description || Icon) && (
            <div className="flex items-start gap-3 border-b border-stroke-soft-200 py-4 pl-5 pr-12">
              {Icon && (
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-weak-50 ring-1 ring-inset ring-stroke-soft-200">
                  <Icon className="size-5 text-text-sub-600" strokeWidth={1.5} />
                </span>
              )}
              <div className="min-w-0 flex-1">
                {title && (
                  <DialogPrimitive.Title className="text-base font-semibold leading-6 text-text-strong-950">
                    {title}
                  </DialogPrimitive.Title>
                )}
                {description && (
                  <DialogPrimitive.Description className="mt-0.5 text-[13px] leading-5 text-text-sub-600">
                    {description}
                  </DialogPrimitive.Description>
                )}
              </div>
            </div>
          )}

          <DialogPrimitive.Close
            asChild
            className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-lg text-text-soft-400 transition-colors hover:bg-bg-weak-50 hover:text-text-strong-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base"
          >
            <button aria-label="Close">
              <RiCloseLine size={18} />
            </button>
          </DialogPrimitive.Close>

          <div className="max-h-[60vh] overflow-y-auto p-5">{children}</div>

          {footer && (
            <div className="flex items-center justify-end gap-2 border-t border-stroke-soft-200 bg-bg-weak-50/50 px-5 py-4">
              {footer}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
