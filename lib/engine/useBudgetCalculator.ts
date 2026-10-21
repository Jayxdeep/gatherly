"use client";

import { useState, useCallback, useMemo } from "react";
import { BudgetItem } from "../schemas/event";

export interface BudgetMetrics {
  totalBudget: number;
  totalAllocated: number;
  remainingBudget: number;
  totalPercentage: number;
  isOverBudget: boolean;
  isBalanced: boolean;
  criticalTotal: number;
  flexibleTotal: number;
  optionalTotal: number;
}

/**
 * Pure math helper functions for budget calculations (testable in Vitest)
 */
export function calculateAllocatedTotal(items: BudgetItem[]): number {
  return items.reduce((sum, item) => sum + (Number(item.estimatedCost) || 0), 0);
}

export function calculatePercentageTotal(items: BudgetItem[]): number {
  return items.reduce((sum, item) => sum + (Number(item.percentage) || 0), 0);
}

export function recalculateCostsFromPercentages(
  items: BudgetItem[],
  totalBudget: number
): BudgetItem[] {
  if (totalBudget <= 0) {
    return items.map((item) => ({ ...item, estimatedCost: 0 }));
  }
  return items.map((item) => ({
    ...item,
    estimatedCost: Math.round(((Number(item.percentage) || 0) / 100) * totalBudget),
  }));
}

export function normalizePercentages(items: BudgetItem[]): BudgetItem[] {
  const currentTotal = calculatePercentageTotal(items);
  if (currentTotal === 0 || items.length === 0) return items;

  let accumulated = 0;
  return items.map((item, index) => {
    if (index === items.length - 1) {
      // Avoid rounding errors by assigning remainder to the last item
      const lastPct = Math.max(0, 100 - accumulated);
      return { ...item, percentage: Math.round(lastPct * 10) / 10 };
    }
    const normalized = Math.round(((item.percentage / currentTotal) * 100) * 10) / 10;
    accumulated += normalized;
    return { ...item, percentage: normalized };
  });
}

/**
 * Dedicated React hook managing local budget mutations without API re-prompts
 */
export function useBudgetCalculator(
  initialItems: BudgetItem[],
  initialTotalBudget: number
) {
  const [totalBudget, setTotalBudget] = useState<number>(initialTotalBudget);
  const [items, setItems] = useState<BudgetItem[]>(initialItems);

  // Sync state if initial props change
  const resetBudget = useCallback(
    (newItems: BudgetItem[], newTotal: number) => {
      setTotalBudget(newTotal);
      setItems(newItems);
    },
    []
  );

  // Update total event budget and recalculate all item dollar costs
  const updateTotalBudget = useCallback((newTotal: number) => {
    const validTotal = Math.max(0, newTotal);
    setTotalBudget(validTotal);
    setItems((prev) => recalculateCostsFromPercentages(prev, validTotal));
  }, []);

  // Update a single item's percentage slider
  const updateItemPercentage = useCallback(
    (id: string, newPercentage: number) => {
      const validPct = Math.max(0, Math.min(100, Math.round(newPercentage * 10) / 10));
      setItems((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            const cost = Math.round((validPct / 100) * totalBudget);
            return { ...item, percentage: validPct, estimatedCost: cost };
          }
          return item;
        })
      );
    },
    [totalBudget]
  );

  // Update a single item's dollar cost directly
  const updateItemCost = useCallback(
    (id: string, newCost: number) => {
      const validCost = Math.max(0, newCost);
      setItems((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            const pct =
              totalBudget > 0
                ? Math.round((validCost / totalBudget) * 1000) / 10
                : 0;
            return { ...item, estimatedCost: validCost, percentage: pct };
          }
          return item;
        })
      );
    },
    [totalBudget]
  );

  // Update priority tag
  const updateItemPriority = useCallback(
    (id: string, priority: "Critical" | "Flexible" | "Optional") => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, priority } : item))
      );
    },
    []
  );

  // Add a new budget category
  const addCategory = useCallback(
    (category: string, percentage: number = 5, priority: "Critical" | "Flexible" | "Optional" = "Flexible") => {
      const id = `custom-${Date.now()}`;
      const estimatedCost = Math.round((percentage / 100) * totalBudget);
      setItems((prev) => [
        ...prev,
        { id, category, percentage, estimatedCost, priority },
      ]);
    },
    [totalBudget]
  );

  // Remove a budget category
  const removeCategory = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Auto-balance all percentages to sum to exactly 100%
  const autoBalance = useCallback(() => {
    setItems((prev) => {
      const normalized = normalizePercentages(prev);
      return recalculateCostsFromPercentages(normalized, totalBudget);
    });
  }, [totalBudget]);

  // Derived metrics
  const metrics: BudgetMetrics = useMemo(() => {
    const totalAllocated = calculateAllocatedTotal(items);
    const totalPercentage = Math.round(calculatePercentageTotal(items) * 10) / 10;
    const remainingBudget = totalBudget - totalAllocated;
    const isOverBudget = remainingBudget < 0;
    const isBalanced = Math.abs(totalPercentage - 100) < 0.5;

    let criticalTotal = 0;
    let flexibleTotal = 0;
    let optionalTotal = 0;

    items.forEach((it) => {
      if (it.priority === "Critical") criticalTotal += it.estimatedCost;
      else if (it.priority === "Flexible") flexibleTotal += it.estimatedCost;
      else optionalTotal += it.estimatedCost;
    });

    return {
      totalBudget,
      totalAllocated,
      remainingBudget,
      totalPercentage,
      isOverBudget,
      isBalanced,
      criticalTotal,
      flexibleTotal,
      optionalTotal,
    };
  }, [items, totalBudget]);

  return {
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
    resetBudget,
  };
}
