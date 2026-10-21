import { z } from "zod";

export const EventInputSchema = z.object({
  eventType: z.enum(["Wedding", "Birthday", "Community Event", "Other"]),
  totalBudget: z.number().positive(),
  guestCount: z.number().int().positive(),
  eventDate: z.string(),
  daysRemaining: z.number().int(),
  locationVibe: z.string(),
  specialNotes: z.string().optional(),
});

export const EventPlanSchema = z.object({
  eventSummary: z.string().describe("AI strategy summary outlining key focus areas"),
  isUrgentMode: z.boolean().describe("True if daysRemaining < 7"),
  budgetAllocation: z.array(
    z.object({
      id: z.string(),
      category: z.string(),
      percentage: z.number(),
      estimatedCost: z.number(),
      priority: z.enum(["Critical", "Flexible", "Optional"]),
    })
  ),
  timelineMilestones: z.array(
    z.object({
      phase: z.string(),
      tasks: z.array(
        z.object({
          id: z.string(),
          taskName: z.string(),
          isCompleted: z.boolean().default(false),
        })
      ),
    })
  ),
  vendorChecklist: z.array(
    z.object({
      vendorType: z.string(),
      keyQuestions: z.array(z.string()),
      estimatedBudgetRange: z.string(),
    })
  ),
  personalizedIdeas: z.array(z.string()),
});

export type EventInput = z.infer<typeof EventInputSchema>;
export type EventPlan = z.infer<typeof EventPlanSchema>;
export type BudgetItem = EventPlan["budgetAllocation"][number];
export type MilestonePhase = EventPlan["timelineMilestones"][number];
export type MilestoneTask = MilestonePhase["tasks"][number];
export type VendorItem = EventPlan["vendorChecklist"][number];
