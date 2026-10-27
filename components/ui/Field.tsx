import React from "react";
import { cn } from "@/lib/utils";

export interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Field({
  label,
  htmlFor,
  hint,
  optional = false,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
          {label}
        </label>
        {optional ? (
          <span className="text-xs text-ink-faint">Optional</span>
        ) : null}
      </div>
      {children}
      {hint ? (
        <p id={`${htmlFor}-hint`} className="text-xs leading-5 text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
