"use client";

import React, { useState, useEffect } from "react";
import { EventInput, EventPlan } from "@/lib/schemas/event";
import { EventInputForm } from "@/components/EventInputForm";
import { PlanDashboard } from "@/components/PlanDashboard";
import { decodePlanFromHash } from "@/lib/export/shareUrl";
import { Sparkles, ShieldCheck, Zap, Sliders, CheckCircle2 } from "lucide-react";

const STORAGE_KEY = "gatherly_saved_session_v1";

export default function HomePage() {
  const [eventInput, setEventInput] = useState<EventInput | null>(null);
  const [eventPlan, setEventPlan] = useState<EventPlan | null>(null);
  const [source, setSource] = useState<string>("gemini");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sharedBanner, setSharedBanner] = useState<boolean>(false);

  // Restore session: checks share URL hash first, then falls back to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
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
      // Ignore cache restore errors
    }
  }, []);

  const handleFormSubmit = async (input: EventInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/planner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      // Auto-save to localStorage
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ input, plan: data.plan, source: data.source })
        );
      } catch {
        // storage quota fallback
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
    setSharedBanner(false);
    if (typeof window !== "undefined" && window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {sharedBanner && (
        <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 text-brand-950 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0" />
            <span>
              Loaded shared plan via collaborative link. You can edit budgets, tweak sliders, and export to calendar in real time.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSharedBanner(false)}
            className="text-brand-700 hover:text-brand-900 font-bold px-2 py-1 text-xs rounded-lg hover:bg-brand-100/60 transition-colors shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}
      {!eventPlan ? (
        <>
          {/* Hero Pitch & Architecture Overview */}
          <section className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold tracking-wide">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>PromptWars Virtual Challenge 5: Celebration & Event Planner</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              AI Event Orchestration with{" "}
              <span className="bg-gradient-to-r from-brand-600 via-rose-600 to-amber-600 bg-clip-text text-transparent">
                Dynamic Recalculation
              </span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Generate production-grade event baselines powered by Gemini. Edit budgets, tweak category sliders in real-time without re-prompting, and execute with precision.
            </p>

            {/* Architecture Highlights Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                Zero Token Leakage (Edge/Serverless Proxy)
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Dynamic Urgency Engine (&lt; 7 Days)
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                In-Memory Budget Math
              </span>
            </div>
          </section>

          {/* Form Step */}
          <section>
            <EventInputForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </section>
        </>
      ) : (
        /* Plan Dashboard Step */
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
