"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { EventInput, EventPlan } from "@/lib/schemas/event";
import { downloadCalendarFile } from "@/lib/export/calendarExport";
import { getShareableUrl } from "@/lib/export/shareUrl";
import { copyText } from "@/lib/clipboard";
import { formatCurrency } from "@/lib/utils";

type CopyTarget = "summary" | "link";

interface UsePlanActionsArgs {
  input: EventInput;
  plan: EventPlan;
  source: string;
}

export function usePlanActions({ input, plan, source }: UsePlanActionsArgs) {
  const [copied, setCopied] = useState<CopyTarget | null>(null);
  const [copyError, setCopyError] = useState<CopyTarget | null>(null);
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const showResult = useCallback(
    (target: CopyTarget, success: boolean) => {
      clearTimer();
      setCopied(success ? target : null);
      setCopyError(success ? null : target);
      timerRef.current = window.setTimeout(() => {
        setCopied(null);
        setCopyError(null);
        timerRef.current = null;
      }, 2500);
    },
    [clearTimer]
  );

  const copySummary = useCallback(async () => {
    const budgetPerGuest =
      input.guestCount > 0
        ? Math.round(input.totalBudget / input.guestCount)
        : 0;

    const text = [
      `Gatherly plan: ${input.eventType}`,
      `${input.locationVibe}`,
      `Date: ${input.eventDate} (${input.daysRemaining} days from planning)`,
      `Budget: ${formatCurrency(input.totalBudget)} for ${input.guestCount} guests (${formatCurrency(
        budgetPerGuest
      )} per guest)`,
      "",
      "Approach",
      plan.eventSummary,
      "",
      "Budget",
      ...plan.budgetAllocation.map(
        (item) =>
          `- ${item.category}: ${item.percentage}% (${formatCurrency(
            item.estimatedCost
          )}) [${item.priority}]`
      ),
      "",
      "Timeline",
      ...plan.timelineMilestones.map(
        (phase) =>
          `${phase.phase}\n${phase.tasks
            .map((task) => `  [ ] ${task.taskName}`)
            .join("\n")}`
      ),
      "",
      "Vendors",
      ...plan.vendorChecklist.map(
        (vendor) =>
          `- ${vendor.vendorType} (${vendor.estimatedBudgetRange})\n${vendor.keyQuestions
            .map((question) => `  ? ${question}`)
            .join("\n")}`
      ),
    ].join("\n");

    const success = await copyText(text);
    showResult("summary", success);
  }, [input, plan, showResult]);

  const shareLink = useCallback(async () => {
    const url = getShareableUrl({ input, plan, source });
    if (!url) {
      showResult("link", false);
      return;
    }
    const success = await copyText(url);
    showResult("link", success);
  }, [input, plan, source, showResult]);

  const exportCalendar = useCallback(() => {
    downloadCalendarFile(input, plan);
  }, [input, plan]);

  const exportJson = useCallback(() => {
    const payload = {
      meta: {
        generator: "Gatherly",
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
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `gatherly-${input.eventType
      .toLowerCase()
      .replace(/\s+/g, "-")}-${input.eventDate}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, [input, plan, source]);

  const printPlan = useCallback(() => {
    window.print();
  }, []);

  return {
    copied,
    copyError,
    copySummary,
    shareLink,
    exportCalendar,
    exportJson,
    printPlan,
  };
}
