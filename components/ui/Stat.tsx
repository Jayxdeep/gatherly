import React from "react";
import { cn } from "@/lib/utils";

export interface StatProps {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  tone?: "default" | "positive" | "danger" | "warning";
  className?: string;
  children?: React.ReactNode;
}

const tones = {
  default: "border-line bg-surface",
  positive: "border-line bg-positive-soft",
  danger: "border-line bg-danger-soft",
  warning: "border-line bg-warning-soft",
};

const valueTones = {
  default: "text-ink",
  positive: "text-positive",
  danger: "text-danger",
  warning: "text-warning",
};

export function Stat({ label, value, hint, tone = "default", className, children }: StatProps) {
  return (
    <div className={cn("rounded-lg border p-4", tones[tone], className)}>
      <p className="text-xs font-medium text-ink-muted">{label}</p>
      <div className={cn("mt-1.5 text-xl font-semibold tabular-nums tracking-tight", valueTones[tone])}>
        {value}
      </div>
      {hint ? <p className="mt-1 text-xs leading-5 text-ink-muted">{hint}</p> : null}
      {children}
    </div>
  );
}
