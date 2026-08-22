"use client";

import React from "react";
import { Empty as KumoEmpty } from "@cloudflare/kumo/components/empty";
import { Button } from "@cloudflare/kumo/components/button";

export interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <KumoEmpty
      icon={<Icon size={32} className="text-kumo-inactive" />}
      title={title}
      description={description}
      contents={action}
      className={className}
      size="base"
    />
  );
}
