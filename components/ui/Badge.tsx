import React from "react";
import { UserStatus } from "@/lib/types";
import { Tag, StatusBadge as StatusPill, type TagTone } from "@/components/ui/Tag";

/* Legacy re-exports — one badge & one tag base everywhere */

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: {
  className?: string;
  variant?: "default" | "primary" | "secondary" | "outline" | "success" | "warning" | "danger" | "info" | "neutral";
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>) {
  const toneMap: Record<string, TagTone> = {
    default: "neutral",
    primary: "primary",
    secondary: "neutral",
    outline: "neutral",
    success: "success",
    warning: "warning",
    danger: "success",
    info: "information",
    neutral: "neutral",
  };
  return (
    <Tag tone={toneMap[variant] ?? "neutral"} className={className} {...props}>
      {children}
    </Tag>
  );
}

const statusConfig: Record<string, { tone: Parameters<typeof StatusPill>[0]["tone"]; label: string }> = {
  "Available to Help": { tone: "success", label: "Available to help" },
  "Open to Work": { tone: "warning", label: "Open to work" },
  "Open to Collaboration": { tone: "primary", label: "Open to collab" },
  "Hiring": { tone: "information", label: "Hiring" },
};

export function StatusBadge({ status, className }: { status: UserStatus; className?: string }) {
  const cfg = statusConfig[status] ?? { tone: "neutral" as const, label: status };
  return <StatusPill tone={cfg.tone} label={cfg.label} className={className} />;
}

export { Tag };
