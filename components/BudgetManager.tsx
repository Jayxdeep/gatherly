"use client";

import React, { useState } from "react";
import { Plus, Scale } from "lucide-react";
import { useBudgetCalculator } from "@/lib/engine/useBudgetCalculator";
import type { BudgetItem } from "@/lib/schemas/event";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BudgetSummary } from "@/components/budget/BudgetSummary";
import { AllocationBreakdown } from "@/components/budget/AllocationBreakdown";
import { BudgetCategoryRow } from "@/components/budget/BudgetCategoryRow";
import { AddCategoryForm } from "@/components/budget/AddCategoryForm";

interface BudgetManagerProps {
  initialItems: BudgetItem[];
  initialBudget: number;
}

export function BudgetManager({
  initialItems,
  initialBudget,
}: BudgetManagerProps) {
  const {
    items,
    totalBudget,
    metrics,
    updateTotalBudget,
    updateItemPercentage,
    updateItemCost,
    updateItemPriority,
    addCategory,
    removeCategory,
    autoBalance,
  } = useBudgetCalculator(initialItems, initialBudget);

  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl leading-tight text-ink">Budget</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-muted">
            Move money between categories or edit an amount directly. Every
            total updates as you type.
          </p>
        </div>
        <Button size="sm" onClick={autoBalance} className="w-fit">
          <Scale className="h-3.5 w-3.5" aria-hidden="true" />
          Balance to 100%
        </Button>
      </div>

      <BudgetSummary
        totalBudget={totalBudget}
        metrics={metrics}
        onTotalBudgetChange={updateTotalBudget}
      />

      <AllocationBreakdown
        items={items}
        totalPercentage={metrics.totalPercentage}
      />

      <Card>
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-4 sm:px-5">
          <div>
            <h3 className="text-sm font-semibold text-ink">Categories</h3>
            <p className="mt-0.5 text-xs text-ink-muted">
              Set the share and the amount for each part of the event.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setShowAddForm((current) => !current)}
          >
            {showAddForm ? (
              "Close"
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                Add category
              </>
            )}
          </Button>
        </div>

        {showAddForm ? (
          <div className="border-b border-line bg-surface-muted px-4 py-4 sm:px-5">
            <AddCategoryForm
              onAdd={(name, percentage, priority) => {
                addCategory(name, percentage, priority);
                setShowAddForm(false);
              }}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        ) : null}

        {items.length > 0 ? (
          <div className="divide-y divide-line">
            {items.map((item, index) => (
              <BudgetCategoryRow
                key={item.id}
                item={item}
                index={index}
                onPercentageChange={updateItemPercentage}
                onCostChange={updateItemCost}
                onPriorityChange={updateItemPriority}
                onRemove={removeCategory}
              />
            ))}
          </div>
        ) : (
          <p className="px-5 py-8 text-sm text-ink-muted">
            No categories yet. Add one to begin splitting the budget.
          </p>
        )}
      </Card>
    </div>
  );
}
