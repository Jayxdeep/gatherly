import { describe, it, expect } from "vitest";
import { generateDeterministicPlan } from "@/lib/ai/fallbackEngine";
import { EventPlanSchema } from "@/lib/schemas/event";

describe("Orchestration Fallback Engine & Dynamic Context Rules", () => {
  it("triggers Urgent Mode when daysRemaining < 7", () => {
    const urgentInput = {
      eventType: "Birthday" as const,
      totalBudget: 3000,
      guestCount: 30,
      eventDate: "2026-10-25",
      daysRemaining: 4,
      locationVibe: "Rooftop Lounge",
    };

    const plan = generateDeterministicPlan(urgentInput);
    expect(plan.isUrgentMode).toBe(true);

    // Urgent mode must allocate contingency funds
    const hasContingency = plan.budgetAllocation.some((b) =>
      b.category.toLowerCase().includes("contingency")
    );
    expect(hasContingency).toBe(true);

    // Output must strictly conform to EventPlanSchema
    const parseResult = EventPlanSchema.safeParse(plan);
    expect(parseResult.success).toBe(true);
  });

  it("does not trigger Urgent Mode when daysRemaining >= 7", () => {
    const standardInput = {
      eventType: "Wedding" as const,
      totalBudget: 25000,
      guestCount: 100,
      eventDate: "2026-12-15",
      daysRemaining: 55,
      locationVibe: "Coastal Resort",
    };

    const plan = generateDeterministicPlan(standardInput);
    expect(plan.isUrgentMode).toBe(false);

    const parseResult = EventPlanSchema.safeParse(plan);
    expect(parseResult.success).toBe(true);
  });

  it("prioritizes DIY and cost-saving ideas when budget per guest is low", () => {
    const lowBudgetInput = {
      eventType: "Community Event" as const,
      totalBudget: 600,
      guestCount: 50, // $12 per guest (< $45)
      eventDate: "2026-11-15",
      daysRemaining: 25,
      locationVibe: "Neighborhood Park",
    };

    const plan = generateDeterministicPlan(lowBudgetInput);
    expect(plan.personalizedIdeas.length).toBeGreaterThan(0);
    expect(
      plan.personalizedIdeas.some(
        (idea) =>
          idea.toLowerCase().includes("diy") ||
          idea.toLowerCase().includes("spotify") ||
          idea.toLowerCase().includes("food truck")
      )
    ).toBe(true);
  });

  it("produces valid schema outputs for all event types", () => {
    const types = ["Wedding", "Birthday", "Community Event", "Other"] as const;

    for (const t of types) {
      const plan = generateDeterministicPlan({
        eventType: t,
        totalBudget: 10000,
        guestCount: 80,
        eventDate: "2026-11-20",
        daysRemaining: 30,
        locationVibe: "Modern Minimalist",
      });

      const parsed = EventPlanSchema.safeParse(plan);
      expect(parsed.success).toBe(true);
    }
  });
});
