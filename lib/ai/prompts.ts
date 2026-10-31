import { EventInput } from "../schemas/event";

export const SYSTEM_INSTRUCTION = `
You are Gatherly's Lead Event Orchestration Engine. 
Your task is to analyze event constraints (Type, Budget, Guest Count, Days Remaining, Location/Vibe) and return a structured planning baseline as strictly formatted JSON.

CRITICAL LOGIC RULES:
1. IF daysRemaining < 7: Set isUrgentMode to true. Reallocate budget toward immediate booking items and remove long-lead activities.
2. IF budget per guest is low: Prioritize essential venue/food categories and add cost-saving DIY options in personalizedIdeas.
3. OUTPUT FORMAT: Respond ONLY with valid JSON conforming strictly to the required schema. Do NOT include markdown code blocks (\`\`\`json ... \`\`\`), greetings, or commentary.
`;

export function generateEventPrompt(input: EventInput): string {
  const budgetPerGuest = input.totalBudget / input.guestCount;
  const isUrgent = input.daysRemaining < 7;

  return `
Create an optimal, production-ready event execution plan for the following parameters:
- Event Type: ${input.eventType}
- Total Budget: ₹${input.totalBudget.toLocaleString("en-IN")} (approx ₹${budgetPerGuest.toLocaleString("en-IN")} per guest)
- Guest Count: ${input.guestCount} guests
- Event Date: ${input.eventDate}
- Days Remaining: ${input.daysRemaining} days ${isUrgent ? "(CRITICAL: URGENT MODE ACTIVE - Less than 7 days left!)" : ""}
- Location / Vibe: ${input.locationVibe}
${input.specialNotes ? `- Special Notes/Constraints: ${input.specialNotes}` : ""}

Ensure the JSON matches this structure exactly:
{
  "eventSummary": "Concise executive overview of the event strategy and key focus areas",
  "isUrgentMode": ${isUrgent},
  "budgetAllocation": [
    {
      "id": "b1",
      "category": "Venue & Facilities",
      "percentage": 35,
      "estimatedCost": ${Math.round(input.totalBudget * 0.35)},
      "priority": "Critical"
    }
  ],
  "timelineMilestones": [
    {
      "phase": "Immediate Actions (Phase 1)",
      "tasks": [
        { "id": "t1", "taskName": "Lock down venue contract", "isCompleted": false }
      ]
    }
  ],
  "vendorChecklist": [
    {
      "vendorType": "Caterer",
      "keyQuestions": ["Can you accommodate dietary restrictions?", "What is the staffing ratio?"],
      "estimatedBudgetRange": "₹1,000 - ₹1,500"
    }
  ],
  "personalizedIdeas": [
    "Idea 1 tailored to the vibe",
    "Idea 2 tailored to budget"
  ]
}

Ensure all percentages sum to 100, priorities are either "Critical", "Flexible", or "Optional", and IDs are unique strings.
Provide realistic, highly tailored tasks, vendor questions, and creative ideas.
`;
}
