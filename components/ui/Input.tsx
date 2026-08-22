"use client";

import * as React from "react";
import { Input as KumoInput, InputArea as KumoInputArea } from "@cloudflare/kumo/components/input";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, id, className, autoComplete, name, type, inputMode, spellCheck, ...props }, ref) => {
    const hasError = !!error;
    const inputProps: any = { autoComplete, name, type, inputMode, spellCheck, ...props };
    // Ensure non-auth fields don't trigger password manager
    if (!autoComplete && !name?.includes("password") && !name?.includes("email")) {
      inputProps.autoComplete = "off";
    }
    if (leftIcon || rightIcon) {
      return (
        <div className="w-full flex flex-col gap-2">
          <KumoInput
            ref={ref as any}
            label={label}
            description={error ? undefined : helperText}
            error={error}
            variant={hasError ? "error" : "default"}
            size="lg"
            id={id}
            className={className}
            {...inputProps}
          />
          {(leftIcon || rightIcon) && <span className="sr-only">icon adornment</span>}
        </div>
      );
    }
    return (
      <KumoInput
        ref={ref as any}
        label={label}
        description={error ? undefined : helperText}
        error={error}
        variant={hasError ? "error" : "default"}
        size="lg"
        id={id}
        className={className}
        {...inputProps}
      />
    );
  },
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, id, className, ...props }, ref) => {
    const hasError = !!error;
    return (
      <KumoInputArea
        ref={ref as any}
        label={label}
        description={error ? undefined : helperText}
        error={error}
        variant={hasError ? "error" : "default"}
        size="lg"
        id={id}
        className={className}
        {...(props as any)}
      />
    );
  },
);
Textarea.displayName = "Textarea";

// Keep legacy export for any variant helper (not used now)
export const inputVariants = () => ({ root: () => "", wrapper: () => "", input: () => "" });
