"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import type { BudgetItem } from "@/lib/schemas/event";
import { Button } from "@/components/ui/Button";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { cn } from "@/lib/utils";
import { categoryColor } from "./colors";

type Priority = BudgetItem["priority"];

const priorityTone: Record<Priority, string> = {
  Critical: "bg-danger-soft text-danger",
  Flexible: "bg-warning-soft text-warning",
  Optional: "bg-surface-muted text-ink-muted",
};

interface BudgetCategoryRowProps {
  item: BudgetItem;
  index: number;
  onPercentageChange: (id: string, value: number) => void;
  onCostChange: (id: string, value: number) => void;
  onPriorityChange: (id: string, priority: Priority) => void;
  onRemove: (id: string) => void;
}

export function BudgetCategoryRow({
  item,
  index,
  onPercentageChange,
  onCostChange,
  onPriorityChange,
  onRemove,
}: BudgetCategoryRowProps) {
  const sliderId = `budget-slider-${item.id}`;

  return (
    <div className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6 sm:px-5">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: categoryColor(index) }}
            aria-hidden="true"
          />
          <p className="min-w-0 truncate text-sm font-medium text-ink">
            {item.category}
          </p>
          <select
            value={item.priority}
            onChange={(event) =>
              onPriorityChange(item.id, event.target.value as Priority)
            }
            aria-label={`Priority for ${item.category}`}
            className={cn(
              "cursor-pointer rounded-full border-0 py-0.5 pl-2 pr-5 text-[11px] font-medium focus:outline-none focus:ring-2 focus:ring-[#c98d97]",
              priorityTone[item.priority]
            )}
          >
            <option value="Critical">Critical</option>
            <option value="Flexible">Flexible</option>
            <option value="Optional">Optional</option>
          </select>
        </div>

        <div className="mt-2.5 flex items-center gap-3">
          <label htmlFor={sliderId} className="sr-only">
            {item.category} share of the budget
          </label>
          <input
            id={sliderId}
            type="range"
            min="0"
            max="100"
            step="0.5"
            value={Math.max(0, Math.min(100, item.percentage))}
            onChange={(event) =>
              onPercentageChange(item.id, Number(event.target.value))
            }
            className="h-1.5 w-full max-w-[280px] flex-1"
          />
          <span className="w-14 shrink-0 text-xs tabular-nums text-ink-muted">
            {item.percentage}%
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 sm:justify-end">
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-xs text-ink-faint"
          >
            {"\u20B9"}
          </span>
          <label htmlFor={`budget-cost-${item.id}`} className="sr-only">
            Amount for {item.category}
          </label>
          <CurrencyInput
            id={`budget-cost-${item.id}`}
            value={item.estimatedCost}
            onChange={(value) => onCostChange(item.id, value)}
            className="w-28 py-1.5 text-right text-sm font-medium"
          />
        </div>
        <Button
          variant="quiet"
          size="icon"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.category}`}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
