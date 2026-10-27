import React from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "neutral" | "accent" | "positive" | "warning" | "danger";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-surface-muted text-ink-muted",
  accent: "bg-accent-soft text-accent",
  positive: "bg-positive-soft text-positive",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
