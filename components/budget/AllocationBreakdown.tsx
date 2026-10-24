import React from "react";
import type { BudgetItem } from "@/lib/schemas/event";
import { Card, CardContent } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { categoryColor } from "./colors";

interface AllocationBreakdownProps {
  items: BudgetItem[];
  totalPercentage: number;
}

export function AllocationBreakdown({
  items,
  totalPercentage,
}: AllocationBreakdownProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold text-ink">
            Where the money goes
          </h3>
          <p className="text-xs tabular-nums text-ink-muted">
            {items.length} {items.length === 1 ? "category" : "categories"} ·{" "}
            {totalPercentage}% assigned
          </p>
        </div>

        {items.length > 0 ? (
          <>
            <div
              className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-surface-sunken"
              aria-hidden="true"
            >
              {items.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    width: `${Math.max(0, Math.min(100, item.percentage))}%`,
                    backgroundColor: categoryColor(index),
                  }}
                  title={`${item.category}: ${item.percentage}%`}
                />
              ))}
            </div>

            <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {items.map((item, index) => (
                <li
                  key={item.id}
                  className="flex items-center gap-2 text-xs text-ink-muted"
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: categoryColor(index) }}
                    aria-hidden="true"
                  />
                  <span className="truncate text-ink">{item.category}</span>
                  <span className="ml-auto shrink-0 tabular-nums">
                    {item.percentage}% · {formatCurrency(item.estimatedCost)}
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-3 text-sm text-ink-muted">
            No categories yet. Add one to start assigning the budget.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
