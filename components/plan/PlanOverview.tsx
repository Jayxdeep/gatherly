import React from "react";
import {
  AlertTriangle,
  CalendarDays,
  Users,
} from "lucide-react";
import type { EventInput, EventPlan } from "@/lib/schemas/event";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { formatEventDate, daysUntilDate } from "@/lib/date";
import { formatCurrency } from "@/lib/utils";

interface PlanOverviewProps {
  input: EventInput;
  plan: EventPlan;
}

const titles: Record<EventInput["eventType"], string> = {
  Wedding: "Your wedding plan",
  Birthday: "Your birthday plan",
  "Community Event": "Your community event plan",
  Other: "Your event plan",
};

function relativeDay(date: string): string {
  const days = daysUntilDate(date);
  if (days < 0) return "Date has passed";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

export function PlanOverview({ input, plan }: PlanOverviewProps) {
  const budgetPerGuest =
    input.guestCount > 0
      ? Math.round(input.totalBudget / input.guestCount)
      : 0;
  const totalTasks = plan.timelineMilestones.reduce(
    (sum, phase) => sum + phase.tasks.length,
    0
  );

  const stats = [
    { label: "Budget", value: formatCurrency(input.totalBudget) },
    { label: "Per guest", value: formatCurrency(budgetPerGuest) },
    { label: "Phases", value: String(plan.timelineMilestones.length) },
    { label: "Tasks", value: String(totalTasks) },
  ];

  return (
    <section className="print-flat overflow-hidden rounded-xl border border-line bg-surface shadow-card">
      <div className="p-5 sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              <Badge tone="accent">
                {input.eventType === "Community Event"
                  ? "Community event"
                  : input.eventType}
              </Badge>
              {plan.isUrgentMode ? (
                <Badge tone="warning">
                  <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                  Short timeline
                </Badge>
              ) : null}
            </div>

            <h1 className="mt-3 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
              {titles[input.eventType]}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">
              {input.locationVibe}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-[340px]">
            <div className="rounded-lg border border-line p-3.5">
              <CalendarDays
                className="h-4 w-4 text-ink-faint"
                aria-hidden="true"
              />
              <p className="mt-2 text-xs text-ink-muted">Event date</p>
              <p className="mt-0.5 text-sm font-medium leading-5 text-ink">
                {formatEventDate(input.eventDate, "long")}
              </p>
              <p className="mt-0.5 text-xs text-ink-faint">
                {relativeDay(input.eventDate)}
              </p>
            </div>
            <div className="rounded-lg border border-line p-3.5">
              <Users className="h-4 w-4 text-ink-faint" aria-hidden="true" />
              <p className="mt-2 text-xs text-ink-muted">Guests</p>
              <p className="mt-0.5 text-sm font-medium tabular-nums leading-5 text-ink">
                {input.guestCount.toLocaleString("en-US")} people
              </p>
              <p className="mt-0.5 text-xs text-ink-faint">
                {formatCurrency(budgetPerGuest)} per guest
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 border-l-2 border-accent pl-4 sm:pl-5">
          <p className="text-xs font-medium text-ink-muted">Planning approach</p>
          <p className="mt-1.5 max-w-3xl text-sm leading-6 text-ink">
            {plan.eventSummary}
          </p>
        </div>

        {plan.isUrgentMode ? (
          <Callout
            tone="warning"
            className="mt-5"
            title="A short timeline changes the order of work"
          >
            Confirm availability and costs before making smaller decisions. The
            timeline below assumes some tasks may happen in parallel.
          </Callout>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface px-5 py-4">
            <p className="text-xs text-ink-muted">{stat.label}</p>
            <p className="mt-0.5 text-base font-semibold tabular-nums tracking-tight text-ink">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
