import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  value: number;
  label: string;
  tone?: "accent" | "positive";
  className?: string;
}

export function ProgressBar({
  value,
  label,
  tone = "accent",
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-surface-sunken",
        className
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-300",
          tone === "positive" ? "bg-positive" : "bg-accent"
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
