"use client";

import React, { useEffect, useState } from "react";
import { EventInput, EventPlan } from "@/lib/schemas/event";
import { EventInputForm } from "@/components/EventInputForm";
import { PlanDashboard } from "@/components/PlanDashboard";
import { decodePlanFromHash } from "@/lib/export/shareUrl";
import {
  CalendarCheck2,
  CheckCircle2,
  ClipboardCheck,
  Wallet,
} from "lucide-react";

const STORAGE_KEY = "gatherly_saved_session_v1";

export default function HomePage() {
  const [eventInput, setEventInput] = useState<EventInput | null>(null);
  const [eventPlan, setEventPlan] = useState<EventPlan | null>(null);
  const [source, setSource] = useState<string>("gemini");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sharedBanner, setSharedBanner] = useState<boolean>(false);

  useEffect(() => {
    if (window.location.hash) {
      const decoded = decodePlanFromHash(window.location.hash);
      if (decoded) {
        setEventInput(decoded.input);
        setEventPlan(decoded.plan);
        setSource(decoded.source || "shared-link");
        setSharedBanner(true);
        return;
      }
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.input && parsed.plan) {
          setEventInput(parsed.input);
          setEventPlan(parsed.plan);
          setSource(parsed.source || "local-cache");
        }
      }
    } catch {
      // Ignore cache restore errors; the planner remains usable without local storage.
    }
  }, []);

  const handleFormSubmit = async (input: EventInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      setEventInput(input);
      setEventPlan(data.plan);
      setSource(data.source || "gemini");

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ input, plan: data.plan, source: data.source })
        );
      } catch {
        // A private browsing session or full storage quota should not block planning.
      }
    } catch (err: unknown) {
      console.error("Failed to generate plan:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setEventPlan(null);
    setEventInput(null);
    setSharedBanner(false);
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage cleanup errors.
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1320px] px-4 pb-8 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12">
      {sharedBanner && (
        <div className="mb-7 flex items-start justify-between gap-4 rounded-xl border border-[#28583f] bg-[#142a23] p-4 text-sm text-[#7ac6a0]">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Shared plan opened</p>
              <p className="mt-0.5 text-[#7ac6a0]">
                You can review the details and make changes in this session.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSharedBanner(false)}
            className="rounded-md px-2 py-1 text-xs font-semibold hover:bg-[#1b382a]"
          >
            Dismiss
          </button>
        </div>
      )}

      {!eventPlan ? (
        <>
          <section className="mb-8 grid gap-7 lg:mb-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end lg:gap-12">
            <div className="max-w-[760px]">
              <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#ef8299]">
                <span className="h-px w-7 bg-[#d96e87]" />
                Celebrations, considered
              </div>
              <h1 className="font-display max-w-[720px] text-[2.55rem] font-semibold leading-[1.07] tracking-[-0.055em] text-[#f8fafc] sm:text-5xl lg:text-[3.6rem]">
                A thoughtful plan for a day that matters.
              </h1>
              <p className="mt-5 max-w-[650px] text-base leading-7 text-[#a0aec0] sm:text-lg sm:leading-8">
                Start with the occasion, budget, and a few details. Gatherly turns them into a practical plan you can actually work from.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 lg:pb-1">
              {[
                { icon: Wallet, label: "Budget", detail: "Keep costs clear" },
                { icon: CalendarCheck2, label: "Timeline", detail: "Know what’s next" },
                { icon: ClipboardCheck, label: "Vendors", detail: "Ask the right things" },
              ].map(({ icon: Icon, label, detail }) => (
                <div key={label} className="rounded-xl border border-[#263144] bg-[#111827] p-3.5 sm:p-4">
                  <Icon className="mb-3 h-[18px] w-[18px] text-[#ef8299]" strokeWidth={1.8} />
                  <p className="text-xs font-bold text-[#f1f5f9] sm:text-sm">{label}</p>
                  <p className="mt-1 hidden text-[11px] leading-4 text-[#94a3b8] sm:block">{detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-label="Create your event plan">
            <EventInputForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </section>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#94a3b8]">
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#7ac6a0]" /> Built around your budget</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#7ac6a0]" /> Editable after generation</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#7ac6a0]" /> Exportable checklist and calendar</span>
          </div>
        </>
      ) : (
        <section>
          {eventInput && (
            <PlanDashboard
              input={eventInput}
              plan={eventPlan}
              source={source}
              onReset={handleReset}
            />
          )}
        </section>
      )}
    </div>
  );
}
