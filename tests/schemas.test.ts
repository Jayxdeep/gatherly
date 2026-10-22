import { describe, it, expect } from "vitest";
import { EventInputSchema, EventPlanSchema } from "@/lib/schemas/event";

describe("EventInputSchema Validation", () => {
  it("successfully parses valid input parameters", () => {
    const validData = {
      eventType: "Wedding",
      totalBudget: 15000,
      guestCount: 100,
      eventDate: "2026-11-20",
      daysRemaining: 30,
      locationVibe: "Rustic Vineyard",
      specialNotes: "Gluten free options",
    };
    const result = EventInputSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails if totalBudget is zero or negative", () => {
    const invalidZero = {
      eventType: "Birthday",
      totalBudget: 0,
      guestCount: 20,
      eventDate: "2026-11-20",
      daysRemaining: 5,
      locationVibe: "Arcade Bar",
    };
    expect(EventInputSchema.safeParse(invalidZero).success).toBe(false);

    const invalidNegative = {
      ...invalidZero,
      totalBudget: -500,
    };
    expect(EventInputSchema.safeParse(invalidNegative).success).toBe(false);
  });

  it("fails if guestCount is non-positive or not an integer", () => {
    const invalidGuest = {
      eventType: "Community Event",
      totalBudget: 5000,
      guestCount: 0,
      eventDate: "2026-11-20",
      daysRemaining: 12,
      locationVibe: "Public Park",
    };
    expect(EventInputSchema.safeParse(invalidGuest).success).toBe(false);

    const decimalGuest = {
      ...invalidGuest,
      guestCount: 12.5,
    };
    expect(EventInputSchema.safeParse(decimalGuest).success).toBe(false);
  });

  it("fails if eventType is invalid", () => {
    const invalidType = {
      eventType: "SecretMission",
      totalBudget: 1000,
      guestCount: 10,
      eventDate: "2026-11-20",
      daysRemaining: 10,
      locationVibe: "Space Station",
    };
    expect(EventInputSchema.safeParse(invalidType).success).toBe(false);
  });
});

describe("EventPlanSchema Validation (LLM Output)", () => {
  const validMockLLMPayload = {
    eventSummary: "Executive plan for rustic autumn wedding with 80 guests.",
    isUrgentMode: false,
    budgetAllocation: [
      {
        id: "b1",
        category: "Venue & Catering",
        percentage: 60,
        estimatedCost: 6000,
        priority: "Critical",
      },
      {
        id: "b2",
        category: "Photography",
        percentage: 20,
        estimatedCost: 2000,
        priority: "Flexible",
      },
      {
        id: "b3",
        category: "Decor & Lighting",
        percentage: 20,
        estimatedCost: 2000,
        priority: "Optional",
      },
    ],
    timelineMilestones: [
      {
        phase: "Phase 1: Foundation",
        tasks: [
          { id: "t1", taskName: "Book venue", isCompleted: false },
          { id: "t2", taskName: "Order cake", isCompleted: true },
        ],
      },
    ],
    vendorChecklist: [
      {
        vendorType: "Catering",
        keyQuestions: ["Are tastings included?", "Do you provide barware?"],
        estimatedBudgetRange: "$4,000 - $6,000",
      },
    ],
    personalizedIdeas: [
      "Custom signature cider cocktail upon arrival",
      "Polaroid photo station with craft paper guestbook",
    ],
  };

  it("successfully parses compliant LLM payload", () => {
    const result = EventPlanSchema.safeParse(validMockLLMPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.budgetAllocation).toHaveLength(3);
      expect(result.data.isUrgentMode).toBe(false);
    }
  });

  it("rejects LLM payload with missing required fields", () => {
    const missingSummary = {
      ...validMockLLMPayload,
      eventSummary: undefined,
    };
    expect(EventPlanSchema.safeParse(missingSummary).success).toBe(false);

    const missingMilestones = {
      ...validMockLLMPayload,
      timelineMilestones: undefined,
    };
    expect(EventPlanSchema.safeParse(missingMilestones).success).toBe(false);
  });

  it("rejects invalid budget priorities", () => {
    const badPriority = {
      ...validMockLLMPayload,
      budgetAllocation: [
        {
          id: "b1",
          category: "Venue",
          percentage: 100,
          estimatedCost: 10000,
          priority: "UltraSuperUrgent", // Not in enum
        },
      ],
    };
    expect(EventPlanSchema.safeParse(badPriority).success).toBe(false);
  });
});
