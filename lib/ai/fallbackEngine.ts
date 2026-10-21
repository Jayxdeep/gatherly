import { EventInput, EventPlan } from "../schemas/event";

/**
 * Intelligent deterministic fallback generator.
 * Used when GEMINI_API_KEY is not set or during offline evaluations / test suites.
 * Complies 100% with all rules: Urgent Mode, tight budgets, and event scale.
 */
export function generateDeterministicPlan(input: EventInput): EventPlan {
  const isUrgent = input.daysRemaining < 7;
  const budgetPerGuest = input.totalBudget / input.guestCount;
  const isTightBudget = budgetPerGuest < 45;

  let summary = "";
  if (isUrgent) {
    summary = `URGENT 7-DAY SPRINT: Plan optimized for rapid execution with only ${input.daysRemaining} days left. Skipped long-lead custom items, prioritized pre-equipped venues with in-house catering, and reserved an emergency contingency cushion.`;
  } else if (isTightBudget) {
    summary = `VALUE-OPTIMIZED STRATEGY: Tailored for high guest density ($${budgetPerGuest.toFixed(0)}/guest). Maximized core hospitality (food & venue) with creative DIY decor, digital invitations, and community-driven entertainment.`;
  } else {
    summary = `BALANCED BESPOKE EXECUTION: Standard structured milestone timeline with curated vendor allocations reflecting a "${input.locationVibe}" aesthetic for ${input.guestCount} guests.`;
  }

  // Budget allocations based on mode and event type
  let budgetAllocation: EventPlan["budgetAllocation"] = [];

  if (isUrgent) {
    budgetAllocation = [
      {
        id: "urg-venue-cat",
        category: "Venue & In-House Catering",
        percentage: 50,
        estimatedCost: Math.round(input.totalBudget * 0.50),
        priority: "Critical",
      },
      {
        id: "urg-audio-visual",
        category: "Fast Audio/Visual & DJ",
        percentage: 15,
        estimatedCost: Math.round(input.totalBudget * 0.15),
        priority: "Critical",
      },
      {
        id: "urg-decor-express",
        category: "Turnkey Decor & Rentals",
        percentage: 15,
        estimatedCost: Math.round(input.totalBudget * 0.15),
        priority: "Flexible",
      },
      {
        id: "urg-contingency",
        category: "Emergency Contingency & Rush Fees",
        percentage: 15,
        estimatedCost: Math.round(input.totalBudget * 0.15),
        priority: "Critical",
      },
      {
        id: "urg-digital-invites",
        category: "Digital Invites & Incidentals",
        percentage: 5,
        estimatedCost: Math.round(input.totalBudget * 0.05),
        priority: "Optional",
      },
    ];
  } else if (input.eventType === "Wedding") {
    budgetAllocation = [
      {
        id: "wed-venue",
        category: "Venue & Ceremony Space",
        percentage: 35,
        estimatedCost: Math.round(input.totalBudget * 0.35),
        priority: "Critical",
      },
      {
        id: "wed-catering",
        category: "Catering & Bar Service",
        percentage: 30,
        estimatedCost: Math.round(input.totalBudget * 0.30),
        priority: "Critical",
      },
      {
        id: "wed-photo",
        category: "Photography & Videography",
        percentage: 15,
        estimatedCost: Math.round(input.totalBudget * 0.15),
        priority: "Flexible",
      },
      {
        id: "wed-florals",
        category: "Floral & Styling Design",
        percentage: 10,
        estimatedCost: Math.round(input.totalBudget * 0.10),
        priority: "Flexible",
      },
      {
        id: "wed-music",
        category: "Entertainment & Live DJ",
        percentage: 6,
        estimatedCost: Math.round(input.totalBudget * 0.06),
        priority: "Optional",
      },
      {
        id: "wed-contingency",
        category: "Contingency Fund",
        percentage: 4,
        estimatedCost: Math.round(input.totalBudget * 0.04),
        priority: "Critical",
      },
    ];
  } else if (input.eventType === "Birthday") {
    budgetAllocation = [
      {
        id: "bday-venue-food",
        category: "Venue & Food / Beverage",
        percentage: 50,
        estimatedCost: Math.round(input.totalBudget * 0.50),
        priority: "Critical",
      },
      {
        id: "bday-cake-dessert",
        category: "Custom Cake & Dessert Bar",
        percentage: 12,
        estimatedCost: Math.round(input.totalBudget * 0.12),
        priority: "Critical",
      },
      {
        id: "bday-entertainment",
        category: "DJ, Games & Entertainment",
        percentage: 18,
        estimatedCost: Math.round(input.totalBudget * 0.18),
        priority: "Flexible",
      },
      {
        id: "bday-decor",
        category: "Theme Decor & Balloons",
        percentage: 12,
        estimatedCost: Math.round(input.totalBudget * 0.12),
        priority: "Flexible",
      },
      {
        id: "bday-party-favors",
        category: "Favors & Welcome Tokens",
        percentage: 8,
        estimatedCost: Math.round(input.totalBudget * 0.08),
        priority: "Optional",
      },
    ];
  } else {
    // Community Event / Other
    budgetAllocation = [
      {
        id: "comm-permits-venue",
        category: "Space Rental & Municipal Permits",
        percentage: 30,
        estimatedCost: Math.round(input.totalBudget * 0.30),
        priority: "Critical",
      },
      {
        id: "comm-logistics",
        category: "Staging, Tables & Audio",
        percentage: 25,
        estimatedCost: Math.round(input.totalBudget * 0.25),
        priority: "Critical",
      },
      {
        id: "comm-food-vendors",
        category: "Communal Catering & Refreshments",
        percentage: 25,
        estimatedCost: Math.round(input.totalBudget * 0.25),
        priority: "Flexible",
      },
      {
        id: "comm-signage-promo",
        category: "Signage & Community Outreach",
        percentage: 10,
        estimatedCost: Math.round(input.totalBudget * 0.10),
        priority: "Optional",
      },
      {
        id: "comm-safety",
        category: "Sanitation & First Aid",
        percentage: 10,
        estimatedCost: Math.round(input.totalBudget * 0.10),
        priority: "Critical",
      },
    ];
  }

  // Timeline Milestones
  let timelineMilestones: EventPlan["timelineMilestones"] = [];

  if (isUrgent) {
    timelineMilestones = [
      {
        phase: "Immediate 24-Hour Blitz (Days 1-2)",
        tasks: [
          { id: "urg-t1", taskName: "Lock available turn-key venue with instant deposit", isCompleted: false },
          { id: "urg-t2", taskName: "Confirm set buffet/family-style menu with caterer", isCompleted: false },
          { id: "urg-t3", taskName: "Send digital RSVP wave via SMS and WhatsApp", isCompleted: false },
        ],
      },
      {
        phase: "Lockdown & Rentals (Days 3-4)",
        tasks: [
          { id: "urg-t4", taskName: "Rent ready-to-go sound system & curated playlist", isCompleted: false },
          { id: "urg-t5", taskName: "Purchase pre-assembled floral accents & lighting", isCompleted: false },
          { id: "urg-t6", taskName: "Finalize guaranteed headcount with kitchen", isCompleted: false },
        ],
      },
      {
        phase: "Final 48 Hours & Show Time (Days 5-7)",
        tasks: [
          { id: "urg-t7", taskName: "Distribute master run-of-show to key helpers", isCompleted: false },
          { id: "urg-t8", taskName: "Load-in venue setup 3 hours prior to guest arrival", isCompleted: false },
          { id: "urg-t9", taskName: "Commence event & celebrate seamlessly", isCompleted: false },
        ],
      },
    ];
  } else {
    timelineMilestones = [
      {
        phase: "Phase 1: Foundation & Securing Anchors",
        tasks: [
          { id: "std-t1", taskName: `Confirm ${input.eventType} vision board matching "${input.locationVibe}"`, isCompleted: false },
          { id: "std-t2", taskName: "Book primary venue and review safety permits", isCompleted: false },
          { id: "std-t3", taskName: `Draft initial guest list targeting ${input.guestCount} attendees`, isCompleted: false },
        ],
      },
      {
        phase: "Phase 2: Vendor Selection & Design Curation",
        tasks: [
          { id: "std-t4", taskName: "Tasting session and dietary menu customization", isCompleted: false },
          { id: "std-t5", taskName: "Contract photographer/videographer with shot list", isCompleted: false },
          { id: "std-t6", taskName: "Finalize theme color palette and centerpiece layout", isCompleted: false },
        ],
      },
      {
        phase: "Phase 3: Invitations & Logistics Lock",
        tasks: [
          { id: "std-t7", taskName: "Distribute formal invitations with clear RSVP deadline", isCompleted: false },
          { id: "std-t8", taskName: "Coordinate rental deliveries (tables, chairs, AV setup)", isCompleted: false },
          { id: "std-t9", taskName: "Compile musical playlists and special announcement cues", isCompleted: false },
        ],
      },
      {
        phase: "Phase 4: Final Countdown & Rehearsal",
        tasks: [
          { id: "std-t10", taskName: "Transmit final headcounts to catering team", isCompleted: false },
          { id: "std-t11", taskName: "Assemble welcome table and emergency kit", isCompleted: false },
          { id: "std-t12", taskName: "Walk-through of day-of timeline with point persons", isCompleted: false },
        ],
      },
    ];
  }

  // Vendor Checklist
  const vendorChecklist: EventPlan["vendorChecklist"] = [
    {
      vendorType: "Venue Coordinator",
      keyQuestions: [
        "What are the hard curfew and sound decibel restrictions?",
        "Are tables, chairs, and standard linens included in the fee?",
        "Is there an on-site facility manager during the entire duration?",
      ],
      estimatedBudgetRange: `$${Math.round(input.totalBudget * 0.30).toLocaleString()} - $${Math.round(input.totalBudget * 0.40).toLocaleString()}`,
    },
    {
      vendorType: "Catering & Beverage",
      keyQuestions: [
        "How do you accommodate vegan, gluten-free, and allergen requests?",
        "What is the server-to-guest ratio for the meal service?",
        "Is cleanup and trash disposal included in the quote?",
      ],
      estimatedBudgetRange: `$${Math.round(input.totalBudget * 0.25).toLocaleString()} - $${Math.round(input.totalBudget * 0.35).toLocaleString()}`,
    },
    {
      vendorType: "Photographer / Media",
      keyQuestions: [
        "How many edited high-res photos are guaranteed?",
        "What is the turnaround timeline for the digital gallery?",
        "Do you carry full commercial liability insurance?",
      ],
      estimatedBudgetRange: `$${Math.round(input.totalBudget * 0.10).toLocaleString()} - $${Math.round(input.totalBudget * 0.18).toLocaleString()}`,
    },
    {
      vendorType: "Entertainment & Sound",
      keyQuestions: [
        "Do you supply wireless handheld microphones for toasts/speeches?",
        "Can we provide a 'must-play' and 'do-not-play' track list?",
        "What backup equipment do you bring in case of technical issues?",
      ],
      estimatedBudgetRange: `$${Math.round(input.totalBudget * 0.08).toLocaleString()} - $${Math.round(input.totalBudget * 0.15).toLocaleString()}`,
    },
  ];

  // Personalized Ideas tailored to vibe & budget
  const personalizedIdeas: string[] = [];
  if (isTightBudget) {
    personalizedIdeas.push("Create a collaborative Spotify queue where guests submit their favorite dance tracks with their RSVP.");
    personalizedIdeas.push("Opt for family-style grazing boards or food truck catering instead of formal plated courses.");
    personalizedIdeas.push("Use warm fairy string lights, taper candles, and potted greenery that double as guest takeaways.");
  } else {
    personalizedIdeas.push(`Infuse the "${input.locationVibe}" aesthetic with customized signature welcome drinks upon arrival.`);
    personalizedIdeas.push("Set up an interactive polaroid guestbook station with metallic pens and adhesive photo mounts.");
    personalizedIdeas.push("Design an ambient acoustic transition during cocktail hour before ramping up high-energy music.");
  }
  if (isUrgent) {
    personalizedIdeas.push("Deploy a digital QR code at each table linking directly to a shared Google Photos album for real-time guest uploads.");
    personalizedIdeas.push("Bundle venue and bar packages directly to eliminate multiple vendor coordination bottlenecks.");
  } else {
    personalizedIdeas.push("Host a brief mid-event gratitude toast honoring key supporters and attendees.");
  }

  return {
    eventSummary: summary,
    isUrgentMode: isUrgent,
    budgetAllocation,
    timelineMilestones,
    vendorChecklist,
    personalizedIdeas,
  };
}
