"use client";

import * as React from "react";
import { Banner as KumoBanner } from "@cloudflare/kumo/components/banner";
import { InfoIcon, WarningCircleIcon, CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";

// Wrapper keeping legacy Alert API but rendering Kumo Banner
export const alertVariants = () => ({ root: () => "", wrapper: () => "", icon: () => "", closeIcon: () => "" });

type AlertStatus = "error" | "warning" | "success" | "information" | "feature";
type AlertVariant = "filled" | "light" | "lighter" | "stroke";

function mapStatusToKumoVariant(status: AlertStatus): "default" | "alert" | "error" | "secondary" {
  switch (status) {
    case "error": return "error";
    case "warning": return "alert";
    case "success": return "default";
    case "information": return "default";
    case "feature": return "secondary";
    default: return "default";
  }
}

function mapStatusToIcon(status: AlertStatus) {
  switch (status) {
    case "error": return <XCircleIcon weight="fill" />;
    case "warning": return <WarningCircleIcon weight="fill" />;
    case "success": return <CheckCircleIcon weight="fill" />;
    case "information": return <InfoIcon weight="fill" />;
    case "feature": return <InfoIcon weight="fill" />;
    default: return <InfoIcon weight="fill" />;
  }
}

export function Root({ children, status = "information", variant: _variant, size: _size, className, ...rest }: any) {
  const kumoVariant = mapStatusToKumoVariant(status);
  // Extract text from children for Banner title/description if possible, else render as children
  // For Toast usage, children contains Alert.Icon + div with title/description + close
  // We detect if children is the legacy structure and map appropriately, otherwise render Banner with children
  const hasLegacyStructure = React.Children.toArray(children).some((c: any) => c?.props?.children);
  if (hasLegacyStructure && React.Children.count(children) > 1) {
    // Legacy Toast pattern: Icon + div + CloseIcon — render as Banner with title/description
    // Fallback: just render Banner with children as is for flexibility
    return (
      <KumoBanner variant={kumoVariant} icon={mapStatusToIcon(status)} className={className} {...rest}>
        <div className="flex flex-1 flex-col gap-0">{children}</div>
      </KumoBanner>
    );
  }
  return (
    <KumoBanner variant={kumoVariant} icon={mapStatusToIcon(status)} className={className} {...rest}>
      {children}
    </KumoBanner>
  );
}

export function Icon({ as: As, ...props }: any) {
  const Component = As || "span";
  return <Component {...props} />;
}

export function CloseIcon(props: any) {
  return <span {...props} />;
}

// Legacy exports
export const AlertRoot = Root;
export const AlertIcon = Icon;
export const AlertCloseIcon = CloseIcon;
