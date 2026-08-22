"use client";

import * as React from "react";
import { Dialog } from "@cloudflare/kumo/components/dialog";
import { Button } from "@cloudflare/kumo/components/button";
import { XIcon } from "@phosphor-icons/react";
import type { RemixiconComponentType } from "@remixicon/react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  icon?: RemixiconComponentType;
}

const sizeMap: Record<string, "sm" | "base" | "lg" | "xl"> = {
  sm: "sm",
  md: "base",
  lg: "lg",
  xl: "xl",
  "2xl": "xl",
};

export function Modal({ isOpen, onClose, title, description, children, footer, maxWidth = "md", icon: Icon }: ModalProps) {
  const size = sizeMap[maxWidth] ?? "base";
  if (!isOpen) return null;
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <Dialog size={size} className="p-0 overflow-hidden">
        {(title || description || Icon) && (
          <div className="flex items-start gap-3 border-b border-kumo-line px-5 py-4 pr-12">
            {Icon && (
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-kumo-tint ring-1 ring-inset ring-kumo-line">
                <Icon className="size-5 text-kumo-subtle" />
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
        {!title && !description && !Icon && (
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
