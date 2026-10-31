"use client";

import React from "react";
import type { BudgetMetrics } from "@/lib/engine/useBudgetCalculator";
import { Stat } from "@/components/ui/Stat";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { formatCurrency } from "@/lib/utils";

interface BudgetSummaryProps {
  totalBudget: number;
  metrics: BudgetMetrics;
  onTotalBudgetChange: (value: number) => void;
}

export function BudgetSummary({
  totalBudget,
  metrics,
  onTotalBudgetChange,
}: BudgetSummaryProps) {
  const allocatedShare =
    totalBudget > 0
      ? Math.round((metrics.totalAllocated / totalBudget) * 100)
      : 0;

  const allocationHint = metrics.isBalanced
    ? "All 100% is assigned"
    : metrics.totalPercentage < 100
      ? `${(100 - metrics.totalPercentage).toFixed(1)}% still unassigned`
      : `${(metrics.totalPercentage - 100).toFixed(1)}% above 100%`;

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <div className="rounded-lg border border-line bg-surface p-4">
        <label
          htmlFor="plan-total-budget"
          className="text-xs font-medium text-ink-muted"
        >
          Total budget
        </label>
        <div className="relative mt-1.5">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-sm text-ink-faint"
          >
            {"\u20B9"}
          </span>
          <CurrencyInput
            id="plan-total-budget"
            value={totalBudget}
            onChange={onTotalBudgetChange}
          />
        </div>
        <p className="mt-1 text-xs leading-5 text-ink-muted">
          Change this to scale every category
        </p>
      </div>

      <Stat
        label="Allocated"
        value={formatCurrency(metrics.totalAllocated)}
        hint={`${allocatedShare}% of the total budget`}
      />

      <Stat
        label={metrics.isOverBudget ? "Over budget" : "Remaining"}
        value={formatCurrency(Math.abs(metrics.remainingBudget))}
        hint={
          metrics.isOverBudget
            ? "More is allocated than the total budget"
            : metrics.remainingBudget === 0
              ? "Every dollar is assigned"
              : "Not yet assigned to a category"
        }
        tone={metrics.isOverBudget ? "danger" : "default"}
      />

      <Stat
        label="Allocation"
        value={`${metrics.totalPercentage}%`}
        hint={allocationHint}
        tone={metrics.isBalanced ? "default" : "warning"}
      />
    </div>
  );
}
