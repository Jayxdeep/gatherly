import { describe, it, expect } from "vitest";
import {
  calculateAllocatedTotal,
  calculatePercentageTotal,
  recalculateCostsFromPercentages,
  normalizePercentages,
} from "@/lib/engine/useBudgetCalculator";
import { BudgetItem } from "@/lib/schemas/event";

describe("Budget Engine Math Routines", () => {
  const sampleItems: BudgetItem[] = [
    {
      id: "b1",
      category: "Venue",
      percentage: 50,
      estimatedCost: 5000,
      priority: "Critical",
    },
    {
      id: "b2",
      category: "Catering",
      percentage: 30,
      estimatedCost: 3000,
      priority: "Critical",
    },
    {
      id: "b3",
      category: "Decor",
      percentage: 20,
      estimatedCost: 2000,
      priority: "Optional",
    },
  ];

  it("calculates allocated total and percentage total accurately", () => {
    expect(calculateAllocatedTotal(sampleItems)).toBe(10000);
    expect(calculatePercentageTotal(sampleItems)).toBe(100);
  });

  it("recalculates dollar costs when total budget changes", () => {
    const updated = recalculateCostsFromPercentages(sampleItems, 20000);
    expect(updated[0].estimatedCost).toBe(10000); // 50% of 20000
    expect(updated[1].estimatedCost).toBe(6000);  // 30% of 20000
    expect(updated[2].estimatedCost).toBe(4000);  // 20% of 20000
  });

  it("handles zero-budget edge case without divide-by-zero or crashing", () => {
    const updated = recalculateCostsFromPercentages(sampleItems, 0);
    expect(updated[0].estimatedCost).toBe(0);
    expect(updated[1].estimatedCost).toBe(0);
    expect(updated[2].estimatedCost).toBe(0);
    expect(calculateAllocatedTotal(updated)).toBe(0);
  });

  it("handles negative budget values gracefully", () => {
    const updated = recalculateCostsFromPercentages(sampleItems, -500);
    expect(updated[0].estimatedCost).toBe(0);
  });

  it("handles NaN budget values safely without producing NaN costs", () => {
    const updated = recalculateCostsFromPercentages(sampleItems, NaN);
    expect(updated[0].estimatedCost).toBe(0);
    expect(updated[1].estimatedCost).toBe(0);
    expect(updated[2].estimatedCost).toBe(0);
  });

  it("normalizes when all categories start at 0% by distributing evenly to 100%", () => {
    const zeroPctItems: BudgetItem[] = [
      { id: "1", category: "A", percentage: 0, estimatedCost: 0, priority: "Critical" },
      { id: "2", category: "B", percentage: 0, estimatedCost: 0, priority: "Flexible" },
      { id: "3", category: "C", percentage: 0, estimatedCost: 0, priority: "Optional" },
      { id: "4", category: "D", percentage: 0, estimatedCost: 0, priority: "Optional" },
    ];

    const normalized = normalizePercentages(zeroPctItems);
    const sum = calculatePercentageTotal(normalized);
    expect(sum).toBe(100);
    expect(normalized[0].percentage).toBe(25);
    expect(normalized[1].percentage).toBe(25);
    expect(normalized[2].percentage).toBe(25);
    expect(normalized[3].percentage).toBe(25);
  });
});
