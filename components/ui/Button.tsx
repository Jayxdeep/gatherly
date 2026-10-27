import React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";
export type ButtonSize = "sm" | "md" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-55";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-strong active:bg-accent-strong",
  secondary:
    "border border-line-strong bg-surface text-ink hover:border-ink-faint hover:bg-surface-muted",
  quiet: "text-ink-muted hover:bg-surface-muted hover:text-ink",
  danger: "text-danger hover:bg-danger-soft",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-[13px]",
  md: "min-h-11 px-4 text-sm",
  icon: "h-9 w-9",
};

export function buttonStyles({
  variant = "secondary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "secondary", size = "md", type = "button", ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={buttonStyles({ variant, size, className })}
        {...props}
      />
    );
  }
);
