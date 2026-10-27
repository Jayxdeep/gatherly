import React from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutTone = "info" | "warning" | "positive" | "danger";

const tones: Record<CalloutTone, { shell: string; icon: string }> = {
  info: { shell: "bg-surface-muted text-ink-muted", icon: "text-ink-3" },
  warning: { shell: "bg-warning-soft text-warning", icon: "text-warning" },
  positive: { shell: "bg-positive-soft text-positive", icon: "text-positive" },
  danger: { shell: "bg-danger-soft text-danger", icon: "text-danger" },
};

const icons = {
  info: Info,
  warning: AlertTriangle,
  positive: CheckCircle2,
  danger: AlertTriangle,
};

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: CalloutTone;
  title?: string;
}

export function Callout({
  tone = "info",
  title,
  className,
  children,
  ...props
}: CalloutProps) {
  const Icon = icons[tone];
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg px-4 py-3.5 text-sm leading-6",
        tones[tone].shell,
        className
      )}
      {...props}
    >
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", tones[tone].icon)} aria-hidden="true" />
      <div className="min-w-0">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className={cn(title && "mt-0.5")}>{children}</div>
      </div>
    </div>
  );
}
