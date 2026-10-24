"use client";

import React, { useState } from "react";
import {
  ClipboardList,
  Lightbulb,
  ListChecks,
  Wallet,
} from "lucide-react";
import type { EventInput, EventPlan } from "@/lib/schemas/event";
import { usePlanActions } from "@/lib/hooks/usePlanActions";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { PlanOverview } from "@/components/plan/PlanOverview";
import { PlanToolbar } from "@/components/plan/PlanToolbar";
import { BudgetManager } from "./BudgetManager";
import { TimelineMilestones } from "./TimelineMilestones";
import { VendorChecklist } from "./VendorChecklist";
import { PersonalizedIdeas } from "./PersonalizedIdeas";

interface PlanDashboardProps {
  input: EventInput;
  plan: EventPlan;
  source: string;
  onReset: () => void;
}

type PlanTab = "budget" | "timeline" | "vendors" | "ideas";

export function PlanDashboard({
  input,
  plan,
  source,
  onReset,
}: PlanDashboardProps) {
  const [activeTab, setActiveTab] = useState<PlanTab>("budget");
  const actions = usePlanActions({ input, plan, source });

  const totalTasks = plan.timelineMilestones.reduce(
    (sum, phase) => sum + phase.tasks.length,
    0
  );

  const tabs: TabItem[] = [
    {
      id: "budget",
      label: "Budget",
      icon: Wallet,
      count: plan.budgetAllocation.length,
    },
    {
      id: "timeline",
      label: "Timeline",
      icon: ListChecks,
      count: totalTasks,
    },
    {
      id: "vendors",
      label: "Vendors",
      icon: ClipboardList,
      count: plan.vendorChecklist.length,
    },
    {
      id: "ideas",
      label: "Ideas",
      icon: Lightbulb,
      count: plan.personalizedIdeas.length,
    },
  ];

  const panels: Array<{ id: PlanTab; content: React.ReactNode }> = [
    {
      id: "budget",
      content: (
        <BudgetManager
          initialItems={plan.budgetAllocation}
          initialBudget={input.totalBudget}
        />
      ),
    },
    {
      id: "timeline",
      content: (
        <TimelineMilestones initialMilestones={plan.timelineMilestones} />
      ),
    },
    {
      id: "vendors",
      content: <VendorChecklist vendors={plan.vendorChecklist} />,
    },
    {
      id: "ideas",
      content: (
        <PersonalizedIdeas
          ideas={plan.personalizedIdeas}
          vibe={input.locationVibe}
          isUrgentMode={plan.isUrgentMode}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PlanToolbar
        onReset={onReset}
        onShare={actions.shareLink}
        onExportCalendar={actions.exportCalendar}
        onCopySummary={actions.copySummary}
        onExportJson={actions.exportJson}
        onPrint={actions.printPlan}
        copied={actions.copied}
        copyError={actions.copyError}
      />

      <PlanOverview input={input} plan={plan} />

      <section aria-label="Plan details">
        <Tabs
          items={tabs}
          value={activeTab}
          onChange={(id) => setActiveTab(id as PlanTab)}
          idBase="plan"
          label="Plan sections"
        />

        <div className="mt-6">
          {panels.map((panel) => (
            <div
              key={panel.id}
              role="tabpanel"
              id={`plan-panel-${panel.id}`}
              aria-labelledby={`plan-tab-${panel.id}`}
              hidden={activeTab !== panel.id}
            >
              {panel.content}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
