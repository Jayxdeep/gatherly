"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface MenuAction {
  label: string;
  icon?: LucideIcon;
  onSelect: () => void;
}

interface MenuProps {
  label: string;
  actions: MenuAction[];
}

export function Menu({ label, actions }: MenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    itemRefs.current[0]?.focus();

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <Button
        ref={triggerRef}
        size="sm"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </Button>

      {open ? (
        <div
          role="menu"
          aria-label={label}
          className="absolute right-0 z-30 mt-2 w-52 rounded-lg border border-line bg-surface p-1 shadow-raised"
        >
          {actions.map(({ label: actionLabel, icon: Icon, onSelect }, index) => (
            <button
              key={actionLabel}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
                onSelect();
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
            >
              {Icon ? (
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              ) : null}
              {actionLabel}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
