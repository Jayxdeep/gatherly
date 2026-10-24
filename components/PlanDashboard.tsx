"use client";

import React, { useState } from "react";
import { EventInput, EventPlan } from "@/lib/schemas/event";
import { BudgetManager } from "./BudgetManager";
import { TimelineMilestones } from "./TimelineMilestones";
import { VendorChecklist } from "./VendorChecklist";
import { PersonalizedIdeas } from "./PersonalizedIdeas";
import { formatCurrency } from "@/lib/utils";
import { downloadCalendarFile } from "@/lib/export/calendarExport";
import { getShareableUrl } from "@/lib/export/shareUrl";
import {
  CalendarDays,
  Check,
  ClipboardList,
  Copy,
  Download,
  Lightbulb,
  ListChecks,
  Printer,
  RotateCcw,
  Share2,
  Users,
  Wallet,
  AlertTriangle,
} from "lucide-react";

interface PlanDashboardProps {
  input: EventInput;
  plan: EventPlan;
  source: string;
  onReset: () => void;
}

type PlanTab = "budget" | "timeline" | "vendors" | "ideas";

function formatEventDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  if (!year || !month || !day) return dateString;
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export function PlanDashboard({ input, plan, source, onReset }: PlanDashboardProps) {
  const [activeTab, setActiveTab] = useState<PlanTab>("budget");
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const budgetPerGuest = input.guestCount > 0 ? Math.round(input.totalBudget / input.guestCount) : 0;

  const copyToClipboard = async (value: string) => {
    if (!navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText(value);
    return true;
  };

  const handleCopySummary = async () => {
    const text = `
Gatherly Event Plan: ${input.eventType}
----------------------------------------
Style: ${input.locationVibe}
Date: ${input.eventDate} (${input.daysRemaining} days left)
Budget: ${formatCurrency(input.totalBudget)} (${input.guestCount} guests, ~${formatCurrency(budgetPerGuest)}/guest)
Planning pace: ${plan.isUrgentMode ? "Short timeline" : "Standard timeline"}

Event strategy:
${plan.eventSummary}

Budget categories:
${plan.budgetAllocation.map((item) => `- ${item.category}: ${item.percentage}% (${formatCurrency(item.estimatedCost)}) [${item.priority}]`).join("\n")}

Planning milestones:
${plan.timelineMilestones.map((phase) => `${phase.phase}:\n${phase.tasks.map((task) => `  [ ] ${task.taskName}`).join("\n")}`).join("\n")}
    `.trim();

    try {
      const success = await copyToClipboard(text);
      if (success) {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("Could not copy the plan summary:", error);
    }
  };

  const handleShareLink = async () => {
    const shareUrl = getShareableUrl({ input, plan, source });
    if (!shareUrl) return;
    try {
      const success = await copyToClipboard(shareUrl);
      if (success) {
        setShareCopied(true);
        window.setTimeout(() => setShareCopied(false), 2500);
      }
    } catch (error) {
      console.error("Could not copy the share link:", error);
    }
  };

  const handleExportCalendar = () => downloadCalendarFile(input, plan);

  const handleExportJSON = () => {
    const payload = {
      meta: {
        generator: "Gatherly",
        generatedAt: new Date().toISOString(),
        source,
      },
      input,
      plan,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `gatherly-plan-${input.eventType.toLowerCase().replace(/\s+/g, "-")}-${input.eventDate}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: "budget" as const, label: "Budget", icon: Wallet },
    { id: "timeline" as const, label: "Timeline", icon: ListChecks },
    { id: "vendors" as const, label: "Vendors", icon: ClipboardList },
    { id: "ideas" as const, label: "Ideas", icon: Lightbulb },
  ];

  return (
    <div className="mx-auto w-full max-w-[1240px] space-y-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between no-print">
        <button type="button" onClick={onReset} className="inline-flex w-fit items-center gap-2 rounded-lg px-1 py-2 text-sm font-semibold text-[#a0aec0] transition-colors hover:text-[#ef8299]">
          <RotateCcw className="h-4 w-4" /> Edit details or plan another event
        </button>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={handleShareLink} className="secondary-button">
            {shareCopied ? <Check className="h-3.5 w-3.5 text-[#7ac6a0]" /> : <Share2 className="h-3.5 w-3.5" />}
            {shareCopied ? "Link copied" : "Share plan"}
          </button>
          <button type="button" onClick={handleExportCalendar} className="secondary-button"><CalendarDays className="h-3.5 w-3.5" /> Calendar</button>
          <button type="button" onClick={handleCopySummary} className="secondary-button">
            {copied ? <Check className="h-3.5 w-3.5 text-[#7ac6a0]" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Summary copied" : "Copy summary"}
          </button>
          <button type="button" onClick={handleExportJSON} className="secondary-button"><Download className="h-3.5 w-3.5" /> Export data</button>
          <button type="button" onClick={() => window.print()} className="secondary-button"><Printer className="h-3.5 w-3.5" /> Print</button>
        </div>
      </div>

      <section className="clean-card overflow-hidden">
        <div className="p-5 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-[760px]">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-[#2b1c2b] px-2.5 py-1 text-[11px] font-bold text-[#ffa1b3]">{input.eventType}</span>
                {plan.isUrgentMode && <span className="inline-flex items-center gap-1.5 rounded-md bg-[#2c2416] px-2.5 py-1 text-[11px] font-semibold text-[#e8c878]"><AlertTriangle className="h-3 w-3" /> Short timeline</span>}
              </div>
              <h1 className="font-display text-3xl font-semibold leading-tight tracking-[-0.045em] text-[#f8fafc] sm:text-4xl">Your event plan</h1>
              <p className="mt-2 text-sm leading-6 text-[#a0aec0]">{input.locationVibe}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:min-w-[390px]">
              <div className="rounded-xl border border-[#293348] bg-[#121b2b] p-4">
                <CalendarDays className="mb-3 h-4 w-4 text-[#ef8299]" />
                <p className="text-[11px] font-semibold text-[#94a3b8]">Event date</p>
                <p className="mt-1 text-sm font-bold leading-5 text-[#e2e8f0]">{formatEventDate(input.eventDate)}</p>
              </div>
              <div className="rounded-xl border border-[#293348] bg-[#121b2b] p-4">
                <Users className="mb-3 h-4 w-4 text-[#ef8299]" />
                <p className="text-[11px] font-semibold text-[#94a3b8]">Guests</p>
                <p className="mt-1 text-sm font-bold leading-5 text-[#e2e8f0]">{input.guestCount.toLocaleString("en-US")} people</p>
              </div>
            </div>
          </div>

          {plan.isUrgentMode && (
            <div role="status" className="mt-6 flex items-start gap-3 rounded-xl border border-[#66512d] bg-[#2c2416] p-4 text-sm text-[#e8c878]">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div><p className="font-semibold">A shorter runway needs a tighter plan.</p><p className="mt-1 leading-5 text-[#d6bd83]">Prioritize availability checks and decisions that unblock the rest of your event. Review dates with vendors before committing.</p></div>
            </div>
          )}

          <div className="mt-6 rounded-xl border border-[#293348] bg-[#221827] p-4 sm:p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#e0a1ad]">Planning direction</p>
            <p className="mt-2 text-sm leading-6 text-[#cbd5e1] sm:text-[15px] sm:leading-7">{plan.eventSummary}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 divide-y divide-[#263144] border-t border-[#263144] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="flex items-center gap-4 px-5 py-4 sm:px-7">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2b1c2b] text-[#ef8299]"><Wallet className="h-[18px] w-[18px]" /></span>
            <div><p className="text-[11px] font-semibold text-[#94a3b8]">Working budget</p><p className="mt-0.5 text-lg font-bold tracking-tight text-[#f1f5f9]">{formatCurrency(input.totalBudget)}</p></div>
          </div>
          <div className="flex items-center gap-4 px-5 py-4 sm:px-7">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#202538] text-[#c4b09a]"><Users className="h-[18px] w-[18px]" /></span>
            <div><p className="text-[11px] font-semibold text-[#94a3b8]">Budget per guest</p><p className="mt-0.5 text-lg font-bold tracking-tight text-[#f1f5f9]">{formatCurrency(budgetPerGuest)}</p></div>
          </div>
          <div className="flex items-center gap-4 px-5 py-4 sm:px-7">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#142a23] text-[#7ac6a0]"><ClipboardList className="h-[18px] w-[18px]" /></span>
            <div><p className="text-[11px] font-semibold text-[#94a3b8]">Planning phases</p><p className="mt-0.5 text-lg font-bold tracking-tight text-[#f1f5f9]">{plan.timelineMilestones.length} phases</p></div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div><h2 className="font-display text-2xl font-semibold tracking-[-0.035em] text-[#f1f5f9]">Make the plan yours</h2><p className="mt-1 text-sm text-[#94a3b8]">Adjust your budget, work through tasks, and keep vendor conversations organized.</p></div>
          <p className="mt-1 text-[10px] text-[#94a3b8]">Plan source: {source}</p>
        </div>

        <div className="no-print mb-5 grid grid-cols-2 gap-2 rounded-xl border border-[#293348] bg-[#111827] p-1.5 sm:grid-cols-4">
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button key={id} type="button" onClick={() => setActiveTab(id)} aria-pressed={active} className={`flex min-h-[45px] items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${active ? "border border-[#3d3040] bg-[#202538] text-[#ffa1b3] shadow-sm" : "border border-transparent text-[#a0aec0] hover:bg-[#1c2435] hover:text-[#e2e8f0]"}`}>
                <Icon className="h-4 w-4 shrink-0" /> <span>{label}</span>
              </button>
            );
          })}
        </div>

        <div>
          {/* Keep tab panels mounted so checklist and vendor status edits survive tab changes. */}
          <div hidden={activeTab !== "budget"}><BudgetManager initialItems={plan.budgetAllocation} initialBudget={input.totalBudget} /></div>
          <div hidden={activeTab !== "timeline"}><TimelineMilestones initialMilestones={plan.timelineMilestones} /></div>
          <div hidden={activeTab !== "vendors"}><VendorChecklist vendors={plan.vendorChecklist} /></div>
          <div hidden={activeTab !== "ideas"}><PersonalizedIdeas ideas={plan.personalizedIdeas} vibe={input.locationVibe} isUrgentMode={plan.isUrgentMode} /></div>
        </div>
      </section>
    </div>
  );
}
