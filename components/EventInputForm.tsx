"use client";

import React, { useEffect, useId, useState } from "react";
import { EventInput, EventInputSchema } from "@/lib/schemas/event";
import {
  AlertCircle,
  ArrowRight,
  Cake,
  CalendarDays,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  MapPin,
  PartyPopper,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";

interface EventInputFormProps {
  onSubmit: (data: EventInput) => Promise<void>;
  isLoading: boolean;
}

const VIBE_PRESETS = [
  "Rustic garden with warm lights",
  "Chic rooftop dinner",
  "Sunset beach gathering",
  "Modern minimalist venue",
  "Intimate backyard dinner",
];

function getLocalDateString(daysOffset = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatEventDate(dateString: string): string {
  if (!dateString) return "Choose a date";
  const [year, month, day] = dateString.split("-").map(Number);
  if (!year || !month || !day) return "Choose a date";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export function EventInputForm({ onSubmit, isLoading }: EventInputFormProps) {
  const formId = useId();
  const [isMounted, setIsMounted] = useState(false);
  const [todayStr, setTodayStr] = useState("");
  const [eventType, setEventType] = useState<"Wedding" | "Birthday" | "Community Event" | "Other">("Wedding");
  const [totalBudget, setTotalBudget] = useState(12000);
  const [guestCount, setGuestCount] = useState(80);
  const [eventDate, setEventDate] = useState("");
  const [locationVibe, setLocationVibe] = useState("Rustic garden with warm lights");
  const [specialNotes, setSpecialNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setTodayStr(getLocalDateString());
    setEventDate((current) => current || getLocalDateString(14));
  }, []);

  const calculateDaysRemaining = (targetDateString: string): number => {
    if (!targetDateString) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [year, month, day] = targetDateString.split("-").map(Number);
    if (!year || !month || !day) return 0;
    const target = new Date(year, month - 1, day);
    target.setHours(0, 0, 0, 0);
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const rawDaysRemaining = isMounted ? calculateDaysRemaining(eventDate) : 14;
  const isPastDate = isMounted && rawDaysRemaining < 0;
  const daysRemaining = Math.max(0, rawDaysRemaining);
  const isUrgent = isMounted && daysRemaining < 7 && !isPastDate;
  const budgetPerGuest = guestCount > 0 ? Math.round(totalBudget / guestCount) : 0;

  const loadPreset = (preset: "urgent" | "wedding") => {
    if (preset === "urgent") {
      setEventType("Birthday");
      setTotalBudget(2500);
      setGuestCount(30);
      setEventDate(getLocalDateString(4));
      setLocationVibe("Chic rooftop dinner");
      setSpecialNotes("Last-minute milestone birthday. Need quick bookings.");
    } else {
      setEventType("Wedding");
      setTotalBudget(28000);
      setGuestCount(120);
      setEventDate(getLocalDateString(120));
      setLocationVibe("Rustic garden with warm lights");
      setSpecialNotes("Outdoor ceremony, indoor reception.");
    }
    setErrorMsg(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg(null);

    if (rawDaysRemaining < 0) {
      setErrorMsg("Choose today or a future date for your event.");
      return;
    }

    const inputData: EventInput = {
      eventType,
      totalBudget: Number(totalBudget),
      guestCount: Number(guestCount),
      eventDate,
      daysRemaining,
      locationVibe: locationVibe.trim(),
      specialNotes: specialNotes.trim() ? specialNotes.trim() : undefined,
    };

    const parsed = EventInputSchema.safeParse(inputData);
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message || "Please check your event details.");
      return;
    }

    try {
      await onSubmit(parsed.data);
    } catch (error: unknown) {
      setErrorMsg(error instanceof Error ? error.message : "We couldn't generate the plan. Please try again.");
    }
  };

  const eventTypes = [
    { type: "Wedding" as const, icon: HeartHandshake, title: "Wedding", description: "A day to remember" },
    { type: "Birthday" as const, icon: Cake, title: "Birthday", description: "Celebrate another year" },
    { type: "Community Event" as const, icon: Users, title: "Community", description: "Bring people together" },
    { type: "Other" as const, icon: PartyPopper, title: "Something else", description: "Your kind of gathering" },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-[#263144] bg-[#111827] shadow-[0_12px_32px_rgba(0,0,0,0.22)]">
      <div className="flex flex-col gap-4 border-b border-[#263144] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
        <div>
          <div className="mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#ef8299]">
            <Sparkles className="h-3.5 w-3.5" /> Start your plan
          </div>
          <h2 className="font-display text-[1.55rem] font-semibold tracking-[-0.035em] text-[#f8fafc] sm:text-[1.75rem]">
            Tell us about your event
          </h2>
          <p className="mt-1.5 text-sm leading-6 text-[#a0aec0]">
            A few essentials are all we need to get started.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => loadPreset("urgent")} className="secondary-button">
            <Clock3 className="h-3.5 w-3.5 text-[#ef8299]" />
            Quick plan · 4 days
          </button>
          <button type="button" onClick={() => loadPreset("wedding")} className="secondary-button">
            <HeartHandshake className="h-3.5 w-3.5 text-[#ef8299]" />
            Sample wedding
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-7 px-5 py-6 sm:px-7 sm:py-7">
          {errorMsg && (
            <div role="alert" className="flex items-start gap-3 rounded-xl border border-[#61313b] bg-[#2c171f] p-3.5 text-sm text-[#f0a0a8]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}

          {isUrgent && (
            <div role="status" className="flex items-start gap-3 rounded-xl border border-[#66512d] bg-[#2c2416] p-3.5 text-sm text-[#e8c878]">
              <Clock3 className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-semibold">A short planning window: {daysRemaining} days</p>
                <p className="mt-1 leading-5 text-[#d6bd83]">The plan will prioritize quick decisions, immediate bookings, and tasks that can realistically be completed in time.</p>
              </div>
            </div>
          )}

          <fieldset className="space-y-3">
            <legend className="mb-3 text-sm font-bold text-[#e2e8f0]">What are you celebrating?</legend>
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              {eventTypes.map(({ type, icon: Icon, title, description }) => {
                const active = eventType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setEventType(type)}
                    className={`group relative min-h-[112px] rounded-xl border p-3.5 text-left transition-colors ${active
                        ? "border-[#ef8299] bg-[#2b1c2b]"
                        : "border-[#293348] bg-[#111827] hover:border-[#334057] hover:bg-[#121b2b]"
                      }`}
                  >
                    <span className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg ${active ? "bg-[#3b2635] text-[#f09bad]" : "bg-[#1e2739] text-[#94a3b8]"}`}>
                      <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
                    </span>
                    <span className="block text-[13px] font-bold leading-5 text-[#e2e8f0]">{title}</span>
                    <span className="mt-0.5 block text-[10px] leading-4 text-[#94a3b8]">{description}</span>
                    {active && <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-[#ef8299]" />}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor={`${formId}-budget`} className="flex items-center justify-between gap-2 text-[13px] font-bold text-[#e2e8f0]">
                <span className="inline-flex items-center gap-2"><Wallet className="h-4 w-4 text-[#94a3b8]" /> Total budget (USD)</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm text-[#94a3b8]">$</span>
                <input id={`${formId}-budget`} type="number" min="100" step="50" value={totalBudget} onChange={(event) => setTotalBudget(Number(event.target.value))} required className="field-control pl-8 font-semibold tabular-nums" />
              </div>
              <p className="text-[11px] text-[#94a3b8]">About ${budgetPerGuest.toLocaleString("en-US")} per guest</p>
            </div>

            <div className="space-y-2">
              <label htmlFor={`${formId}-guests`} className="flex items-center gap-2 text-[13px] font-bold text-[#e2e8f0]">
                <Users className="h-4 w-4 text-[#94a3b8]" /> Guest count
              </label>
              <input id={`${formId}-guests`} type="number" min="1" max="100000" value={guestCount} onChange={(event) => setGuestCount(Number(event.target.value))} required className="field-control font-semibold tabular-nums" />
              <p className="text-[11px] text-[#94a3b8]">An estimate is fine for now.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor={`${formId}-date`} className="flex items-center gap-2 text-[13px] font-bold text-[#e2e8f0]">
                <CalendarDays className="h-4 w-4 text-[#94a3b8]" /> Event date
              </label>
              <input id={`${formId}-date`} type="date" min={todayStr || undefined} value={eventDate} onChange={(event) => { setEventDate(event.target.value); if (errorMsg) setErrorMsg(null); }} required className="field-control" />
              <p className="text-[11px] text-[#94a3b8]">Choose today or a future date.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor={`${formId}-vibe`} className="flex items-center gap-2 text-[13px] font-bold text-[#e2e8f0]">
                <MapPin className="h-4 w-4 text-[#94a3b8]" /> Setting and style
              </label>
              <input id={`${formId}-vibe`} type="text" value={locationVibe} onChange={(event) => setLocationVibe(event.target.value)} required maxLength={160} placeholder="e.g. rooftop dinner, relaxed garden" className="field-control" list={`${formId}-vibe-presets`} />
              <datalist id={`${formId}-vibe-presets`}>
                {VIBE_PRESETS.map((preset) => <option value={preset} key={preset} />)}
              </datalist>
              <p className="text-[11px] text-[#94a3b8]">Describe the atmosphere or venue you have in mind.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor={`${formId}-notes`} className="text-[13px] font-bold text-[#e2e8f0]">Any important details? <span className="font-medium text-[#94a3b8]">Optional</span></label>
            <textarea id={`${formId}-notes`} rows={3} maxLength={1200} value={specialNotes} onChange={(event) => setSpecialNotes(event.target.value)} className="field-control min-h-[94px] resize-y leading-6" placeholder="Dietary needs, accessibility, a surprise moment, must-haves or things to avoid…" />
            <div className="flex justify-end text-[10px] text-[#94a3b8]">{specialNotes.length}/1200</div>
          </div>
        </div>

        <aside className="flex flex-col border-t border-[#263144] bg-[#0c1424] p-5 sm:p-7 lg:border-l lg:border-t-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#d59aa5]">A first look</p>
            <h3 className="font-display mt-2 text-xl font-semibold tracking-[-0.03em] text-[#f1f5f9]">Your event at a glance</h3>
            <p className="mt-2 text-xs leading-5 text-[#94a3b8]">Your details shape the budget, timeline, and recommendations in the plan.</p>
          </div>

          <div className="mt-6 divide-y divide-[#293348] rounded-xl border border-[#293348] bg-[#111827] px-4">
            <div className="flex items-start justify-between gap-3 py-3.5">
              <span className="text-xs text-[#94a3b8]">Occasion</span>
              <span className="max-w-[145px] text-right text-xs font-bold text-[#e2e8f0]">{eventType === "Community Event" ? "Community event" : eventType}</span>
            </div>
            <div className="flex items-start justify-between gap-3 py-3.5">
              <span className="text-xs text-[#94a3b8]">Date</span>
              <span className="text-right text-xs font-semibold text-[#e2e8f0]">{formatEventDate(eventDate)}</span>
            </div>
            <div className="flex items-start justify-between gap-3 py-3.5">
              <span className="text-xs text-[#94a3b8]">Guests</span>
              <span className="text-xs font-semibold tabular-nums text-[#e2e8f0]">{Math.max(0, guestCount).toLocaleString("en-US")}</span>
            </div>
            <div className="py-4">
              <p className="text-xs text-[#94a3b8]">Working budget</p>
              <p className="font-display mt-1 text-[1.7rem] font-semibold tracking-[-0.045em] text-[#f1f5f9]">${Math.max(0, totalBudget).toLocaleString("en-US")}</p>
              <p className="mt-1 text-[11px] text-[#94a3b8]">${budgetPerGuest.toLocaleString("en-US")} per guest, estimated</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#a0aec0]">Your plan will include</p>
            {[
              "A budget split you can adjust",
              "A milestone-by-milestone checklist",
              "Vendor questions and creative ideas",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-xs leading-5 text-[#cbd5e1]">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#7ac6a0]" /> {item}
              </div>
            ))}
          </div>

          <div className="mt-7 border-t border-[#293348] pt-5 lg:mt-auto lg:pt-8">
            <button type="submit" disabled={isLoading} className="primary-button w-full">
              {isLoading ? (
                <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Building your plan…</>
              ) : (
                <>Build my event plan <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
            <p className="mt-3 text-center text-[10px] leading-4 text-[#94a3b8]">You can fine-tune your budget and checklist after it’s created.</p>
          </div>
        </aside>
      </form>
    </div>
  );
}
