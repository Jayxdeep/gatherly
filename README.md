# Gatherly 
### AI-Powered Event & Celebration Orchestrator
**Hack2Skill Google PromptWars Virtual — Challenge 5: Celebration & Event Planner**

---

## Executive Summary
**Gatherly** is an autonomous event planning engine designed to eliminate planning chaos for weddings, milestone birthdays, and community festivals. Built on Next.js App Router and TypeScript, Gatherly pairs Google's Gemini models with a dedicated **Client-Side Recalculation Engine** (`useBudgetCalculator`).

Instead of rigid, static AI responses that force wasteful re-prompts for every adjustment, Gatherly implements an **Editable Baseline Strategy**:
1. Gemini synthesizes the high-level strategic roadmap, vendor vetting questions, and budget allocations.
2. Users adjust sliders, tweak costs, and check off milestones locally in browser memory with zero latency and zero token leakage.

---

##  Key Highlights & Competition Constraint Compliance

| Constraint / Target | Implementation | Verification |
| :--- | :--- | :--- |
| **Repository Size (< 10 MB)** | Zero heavy media; inline SVG via `lucide-react`; strict `.gitignore` excluding build artifacts & node_modules | `git count-objects -vH` < 1 MB |
| **Single Branch Rule** | All commits directly on `main` branch | Single `main` branch maintained |
| **Zero Token Leakage** | Edge/Serverless Route `app/api/planner/route.ts` with `process.env.GEMINI_API_KEY`. No API keys shipped to client. | Verified via bundle inspection |
| **Urgent Mode (< 7 Days)** | Automated detection: truncates long-lead vendors, reserves emergency contingency, activates rapid 24-hr milestones. | Unit tested with Vitest |
| **Value Optimization** | Low budget-per-guest trigger introduces DIY alternatives and communal formats. | Unit tested with Vitest |
| **Type Safety & Schema Validation** | End-to-end Zod contracts for both input parameters and Gemini JSON output. | Strict TypeScript + Zod |

---

##  Architecture Directory Structure

```text
gatherly/
├── app/
│   ├── page.tsx                 # Main Interactive Dashboard (Input Step & Plan View)
│   ├── layout.tsx               # Root Layout with WCAG AA Meta & Accessibility
│   ├── globals.css              # Tailwind CSS styles and print stylesheets
│   └── api/
│       └── planner/route.ts     # Edge/Serverless Route for Gemini API & Fallback
├── lib/
│   ├── schemas/
│   │   └── event.ts             # Strict Zod Schemas for System IO & LLM Output
│   ├── engine/
│   │   └── useBudgetCalculator.ts # Local In-Memory Budget Recalculator with Zero/NaN guards
│   ├── export/
│   │   ├── calendarExport.ts    # RFC 5545 iCalendar (.ics) schedule generator
│   │   └── shareUrl.ts          # URL-safe Base64 collaborative shareable plan encoder
│   ├── ai/
│   │   ├── prompts.ts           # System Instructions & Structured Prompt Generators
│   │   └── fallbackEngine.ts    # Deterministic Baseline Generator for offline/test resilience
│   └── utils.ts                 # Formatting & class merging utilities
├── components/
│   ├── EventInputForm.tsx       # Hydration-guarded Form with Date Bounds & Scenario Presets
│   ├── PlanDashboard.tsx        # Multi-tab Dashboard, Calendar (.ics), Share Link & Export Hub
│   ├── BudgetManager.tsx        # Dynamic Sliders, Breakdown Bar & Category Editor
│   ├── TimelineMilestones.tsx   # Phase-by-phase task checklist with Calendar Sync
│   ├── VendorChecklist.tsx      # Vendor vetting questions & price range tiers
│   └── PersonalizedIdeas.tsx    # Curated aesthetic inspiration & DIY hacks
├── tests/
│   ├── schemas.test.ts          # Zod validation & LLM response parsing tests
│   ├── budgetEngine.test.ts     # Budget math, normalization, & zero/NaN edge case tests
│   ├── fallbackEngine.test.ts   # Urgent mode (< 7 days) & budget scaling tests
│   └── export.test.ts           # RFC 5545 .ics generation & Base64 sharing tests
├── .gitignore                   # Critical repository size protection
├── README.md                    # Project Brief & Blueprint Explanation
└── package.json
```

---

## Dynamic Urgency & Value Rules

### 1. Urgent Mode (`daysRemaining < 7`)
- **Automatic Trigger:** The moment an event date is within 7 days (or using the `⚡ Urgent (<7d)` preset), Gatherly sets `isUrgentMode: true`.
- **Budget Realignment:** Allocates a mandatory 15% emergency contingency fund and shifts allocations toward turnkey venues with in-house catering.
- **Timeline Compression:** Replaces multi-month milestones with a 24-Hour Immediate Blitz, Days 3-4 Lockdown, and Days 5-7 Execution roadmap.

### 2. Tight Budget Rule (Low Budget / Guest)
- Prioritizes core guest hospitality (food and space).
- Automatically generates creative DIY alternatives in `personalizedIdeas` (e.g., collaborative Spotify queues, family-style grazing boards, fairy light ambiance).

### 3. Collaborative Sharing & Calendar Sync
- **Frictionless Sharing:** Generates a zero-database, URL-safe Base64 hash `#share=...` containing validated plan state that can be shared with clients, co-planners, or judges.
- **Calendar Integration (.ics):** Generates RFC 5545 `.ics` event schedules that import directly into Apple Calendar, Google Calendar, or Outlook with scheduled milestone phase reminders.

---

## Testing Suite (Vitest)

All 20 unit tests cover Zod schemas, budget recalculation math, zero/NaN safeguards, dynamic urgency logic, calendar serialization, and URL hash sharing:

```bash
npm test
```

Sample output:
```text
 ✓ tests/budgetEngine.test.ts (6 tests)
 ✓ tests/schemas.test.ts (7 tests)
 ✓ tests/fallbackEngine.test.ts (4 tests)
 ✓ tests/export.test.ts (3 tests)

 Test Files  4 passed (4)
      Tests  20 passed (20)
```

---

## Getting Started Locally

### Prerequisites
- Node.js 18+ or 20+
- npm

### 1. Clone & Install
```bash
git clone <repo-url>
cd gatherly
npm install
```

### 2. Configure Environment (Optional)
Create `.env.local` in the project root:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```
> **Note:** If `GEMINI_API_KEY` is omitted, Gatherly's deterministic orchestration engine automatically generates rich, production-grade baselines that adhere 100% to all schema and urgency rules.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view Gatherly.

### 4. Production Build
```bash
npm run build
npm start
```

---

## Accessibility & UX Standards
- **Semantic HTML5:** `<header>`, `<main>`, `<section>`, `<fieldset>`, `<legend>`.
- **Keyboard Navigation:** Full tab order across sliders, task checkboxes, and tabs.
- **High Contrast:** Compliant with WCAG AA standards.
- **Export Capabilities:** One-click JSON export, RFC 5545 `.ics` calendar download, Base64 collaborative share links, formatted summary clipboard copying, and print-optimized PDF styling.
