"use client";

import React, { useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
  count?: number;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  idBase: string;
  label: string;
  className?: string;
}

export function Tabs({
  items,
  value,
  onChange,
  idBase,
  label,
  className,
}: TabsProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusTab = (rawIndex: number) => {
    const nextIndex = (rawIndex + items.length) % items.length;
    refs.current[nextIndex]?.focus();
    onChange(items[nextIndex].id);
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        "no-print grid grid-cols-2 gap-1 rounded-lg border border-line bg-surface p-1 sm:flex sm:gap-1 sm:overflow-x-auto sm:rounded-none sm:border-0 sm:border-b sm:border-line sm:bg-transparent sm:p-0",
        className
      )}
    >
      {items.map(({ id, label: tabLabel, icon: Icon, count }, index) => {
        const active = value === id;
        return (
          <button
            key={id}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${idBase}-tab-${id}`}
            aria-selected={active}
            aria-controls={`${idBase}-panel-${id}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(id)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                focusTab(index + 1);
              } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                focusTab(index - 1);
              } else if (event.key === "Home") {
                event.preventDefault();
                focusTab(0);
              } else if (event.key === "End") {
                event.preventDefault();
                focusTab(items.length - 1);
              }
            }}
            className={cn(
              "inline-flex shrink-0 items-center justify-center gap-2 rounded-md border-b-2 border-transparent px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-accent-soft text-accent sm:bg-transparent sm:text-ink sm:border-accent"
                : "text-ink-muted hover:bg-surface-muted hover:text-ink sm:hover:border-line-strong sm:hover:bg-transparent sm:hover:text-ink",
              "sm:justify-start sm:rounded-none sm:py-3"
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {tabLabel}
            {typeof count === "number" ? (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[11px] tabular-nums",
                  active
                    ? "bg-accent-soft text-accent"
                    : "bg-surface-muted text-ink-faint"
                )}
              >
                {count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
