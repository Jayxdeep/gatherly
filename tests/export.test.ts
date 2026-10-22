import { describe, it, expect } from "vitest";
import { generateICSContent } from "@/lib/export/calendarExport";
import { encodePlanToHash, decodePlanFromHash, SharedPlanData } from "@/lib/export/shareUrl";
import { EventInput, EventPlan } from "@/lib/schemas/event";

describe("Calendar Export (.ics) Engine", () => {
  const sampleInput: EventInput = {
    eventType: "Birthday",
    totalBudget: 4000,
    guestCount: 25,
    eventDate: "2026-11-15",
    daysRemaining: 10,
    locationVibe: "Rooftop Lounge",
  };

  const samplePlan: EventPlan = {
    eventSummary: "Executive party plan with skyline view.",
    isUrgentMode: false,
    budgetAllocation: [
      { id: "b1", category: "Venue", percentage: 50, estimatedCost: 2000, priority: "Critical" },
      { id: "b2", category: "Bar", percentage: 50, estimatedCost: 2000, priority: "Flexible" },
    ],
    timelineMilestones: [
      {
        phase: "Phase 1: Lock Venue & DJ",
        tasks: [
          { id: "t1", taskName: "Book rooftop terrace", isCompleted: true },
          { id: "t2", taskName: "Sign contract", isCompleted: false },
        ],
      },
      {
        phase: "Phase 2: Day-of Execution",
        tasks: [{ id: "t3", taskName: "Arrive 1 hr early", isCompleted: false }],
      },
    ],
    vendorChecklist: [
      {
        vendorType: "Bartender",
        keyQuestions: ["Are custom cocktails included?"],
        estimatedBudgetRange: "$800 - $1,200",
      },
    ],
    personalizedIdeas: ["Custom LED birthday sign"],
  };

  it("generates valid RFC 5545 iCalendar content with main event and milestones", () => {
    const ics = generateICSContent(sampleInput, samplePlan);

    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("END:VCALENDAR");
    expect(ics).toContain("VERSION:2.0");
    expect(ics).toContain("SUMMARY:🎉 Birthday (Rooftop Lounge)");
    expect(ics).toContain("SUMMARY:📋 Milestone: Phase 1: Lock Venue & DJ");
    expect(ics).toContain("SUMMARY:📋 Milestone: Phase 2: Day-of Execution");
    expect(ics).toContain("[X] Book rooftop terrace");
    expect(ics).toContain("[ ] Sign contract");
  });
});

describe("Collaborative Sharing URL Engine", () => {
  const sampleData: SharedPlanData = {
    input: {
      eventType: "Wedding",
      totalBudget: 25000,
      guestCount: 100,
      eventDate: "2026-12-20",
      daysRemaining: 40,
      locationVibe: "Garden Pavilion",
    },
    plan: {
      eventSummary: "Romantic garden wedding orchestration.",
      isUrgentMode: false,
      budgetAllocation: [
        { id: "b1", category: "Venue", percentage: 60, estimatedCost: 15000, priority: "Critical" },
        { id: "b2", category: "Catering", percentage: 40, estimatedCost: 10000, priority: "Critical" },
      ],
      timelineMilestones: [
        {
          phase: "Foundation",
          tasks: [{ id: "t1", taskName: "Reserve venue", isCompleted: false }],
        },
      ],
      vendorChecklist: [
        {
          vendorType: "Florist",
          keyQuestions: ["Can you do floral arch?"],
          estimatedBudgetRange: "$2,000 - $3,500",
        },
      ],
      personalizedIdeas: ["Fairy lights in olive trees"],
    },
    source: "gemini",
  };

  it("encodes and decodes shared plan accurately without data loss", () => {
    const hash = encodePlanToHash(sampleData);
    expect(typeof hash).toBe("string");
    expect(hash.length).toBeGreaterThan(20);

    const decoded = decodePlanFromHash(hash);
    expect(decoded).not.toBeNull();
    expect(decoded?.input.eventType).toBe("Wedding");
    expect(decoded?.input.totalBudget).toBe(25000);
    expect(decoded?.plan.eventSummary).toBe("Romantic garden wedding orchestration.");
    expect(decoded?.plan.budgetAllocation).toHaveLength(2);
  });

  it("handles malformed or invalid hash safely without crashing", () => {
    expect(decodePlanFromHash("")).toBeNull();
    expect(decodePlanFromHash("not-a-valid-base64-string!!@@")).toBeNull();
    expect(decodePlanFromHash("e30=")).toBeNull(); // empty object {} fails Zod schema
  });
});
