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
  Calendar,
  DollarSign,
  Users,
  Clock,
  Sparkles,
  Download,
  Printer,
  Copy,
  Check,
  RotateCcw,
  AlertTriangle,
  PieChart,
  ListTodo,
  Briefcase,
  Lightbulb,
  Share2,
} from "lucide-react";

interface PlanDashboardProps {
  input: EventInput;
  plan: EventPlan;
  source: string;
  onReset: () => void;
}

export function PlanDashboard({ input, plan, source, onReset }: PlanDashboardProps) {
  const [activeTab, setActiveTab] = useState<"budget" | "timeline" | "vendors" | "ideas">("budget");
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const budgetPerGuest = Math.round(input.totalBudget / input.guestCount);

  // Copy summary to clipboard
  const handleCopySummary = () => {
    const text = `
Gatherly Event Plan: ${input.eventType}
----------------------------------------
Vibe: ${input.locationVibe}
Date: ${input.eventDate} (${input.daysRemaining} days left)
Budget: ${formatCurrency(input.totalBudget)} (${input.guestCount} guests, ~${formatCurrency(budgetPerGuest)}/guest)
Mode: ${plan.isUrgentMode ? "URGENT MODE (<7 Days)" : "Standard Timeline"}

AI Strategy:
${plan.eventSummary}

Budget Categories:
${plan.budgetAllocation.map((b) => `- ${b.category}: ${b.percentage}% (${formatCurrency(b.estimatedCost)}) [${b.priority}]`).join("\n")}

Key Milestone Phases:
${plan.timelineMilestones.map((m) => `${m.phase}:\n${m.tasks.map((t) => `  [ ] ${t.taskName}`).join("\n")}`).join("\n")}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Copy shareable URL with encoded plan payload
  const handleShareLink = () => {
    const shareUrl = getShareableUrl({ input, plan, source });
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  // Export RFC 5545 iCalendar file
  const handleExportCalendar = () => {
    downloadCalendarFile(input, plan);
  };

  // Export JSON file
  const handleExportJSON = () => {
    const payload = {
      meta: {
        generator: "Gatherly AI Orchestration Engine",
        generatedAt: new Date().toISOString(),
        source,
      },
      input,
      plan,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gatherly-plan-${input.eventType.toLowerCase()}-${input.eventDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          Edit Parameters / Plan New Event
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Collaborative Share Link Button */}
          <button
            type="button"
            onClick={handleShareLink}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-brand-50 text-brand-700 hover:bg-brand-100 hover:text-brand-900 px-3.5 py-2 rounded-xl border border-brand-200 shadow-sm transition-colors"
            title="Generate and copy an instant shareable URL containing full plan data"
          >
            {shareCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-brand-600" />
                <span>Share Plan Link</span>
              </>
            )}
          </button>

          {/* Export Calendar (.ics) Button */}
          <button
            type="button"
            onClick={handleExportCalendar}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-colors"
            title="Download Apple/Google Calendar .ics milestone schedule"
          >
            <Calendar className="w-3.5 h-3.5 text-rose-500" />
            <span>Calendar (.ics)</span>
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 px-3.5 py-2 rounded-xl shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-300" />
            Print Plan
          </button>
        </div>
      </div>

      {/* Hero Overview Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-100 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full uppercase tracking-wider">
                {input.eventType} Plan
              </span>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {input.locationVibe}
              </span>
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Source: {source}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Event Orchestration Master Blueprint
            </h1>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-2xl text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Target Date
              </span>
              <span className="text-xs font-bold text-slate-800">
                {input.eventDate}
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-2xl text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Guest Capacity
              </span>
              <span className="text-xs font-bold text-slate-800">
                {input.guestCount} Guests
              </span>
            </div>
          </div>
        </div>

        {/* Urgent Mode Warning Banner */}
        {plan.isUrgentMode && (
          <div
            role="status"
            className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-400/80 text-amber-950 flex items-start gap-3 shadow-sm"
          >
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-sm flex items-center gap-2">
                <span>URGENT MODE ENFORCED ({input.daysRemaining} Days Remaining)</span>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-black">
                  Rule Triggered
                </span>
              </div>
              <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
                Because this event is in under 7 days, long-lead vendor procurement has been truncated. The baseline allocates emergency contingency and prioritizes turnkey lock-ins.
              </p>
            </div>
          </div>
        )}

        {/* AI Strategy Summary Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-50/70 via-pink-50/40 to-amber-50/50 border border-rose-100 flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-brand-500/20">
            <Sparkles className="w-4 h-4 text-amber-200" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-brand-800 uppercase tracking-wider block mb-1">
              AI Strategy Directive
            </span>
            <p className="text-sm font-medium text-slate-800 leading-relaxed">
              {plan.eventSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Tabs Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm no-print gap-1">
        {[
          { id: "budget" as const, label: "Budget & Sliders", icon: PieChart },
          { id: "timeline" as const, label: "Timeline Milestones", icon: ListTodo },
          { id: "vendors" as const, label: "Vendor Playbook", icon: Briefcase },
          { id: "ideas" as const, label: "Personalized Ideas", icon: Lightbulb },
        ].map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                active
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="transition-all">
        {activeTab === "budget" && (
          <BudgetManager
            initialItems={plan.budgetAllocation}
            initialBudget={input.totalBudget}
          />
        )}

        {activeTab === "timeline" && (
          <TimelineMilestones
            initialMilestones={plan.timelineMilestones}
            onExportCalendar={handleExportCalendar}
          />
        )}

        {activeTab === "vendors" && (
          <VendorChecklist vendors={plan.vendorChecklist} />
        )}

        {activeTab === "ideas" && (
          <PersonalizedIdeas
            ideas={plan.personalizedIdeas}
            vibe={input.locationVibe}
            isUrgentMode={plan.isUrgentMode}
          />
        )}
      </div>
    </div>
  );
}
