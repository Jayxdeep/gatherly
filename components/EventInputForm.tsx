"use client";

import React, { useEffect, useId, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Cake,
  CalendarDays,
  Check,
  Clock3,
  HeartHandshake,
  Loader2,
  MapPin,
  PartyPopper,
  Users,
  Wallet,
} from "lucide-react";
import { EventInput, EventInputSchema } from "@/lib/schemas/event";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Controls";
import {
  daysUntilDate,
  formatEventDate,
  getLocalDateString,
} from "@/lib/date";
import { formatCurrency } from "@/lib/utils";

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

const EVENT_TYPES = [
  {
    type: "Wedding" as const,
    icon: HeartHandshake,
    title: "Wedding",
    description: "Ceremony and reception",
  },
  {
    type: "Birthday" as const,
    icon: Cake,
    title: "Birthday",
    description: "A milestone or a small gathering",
  },
  {
    type: "Community Event" as const,
    icon: Users,
    title: "Community event",
    description: "A festival or local meet-up",
  },
  {
    type: "Other" as const,
    icon: PartyPopper,
    title: "Something else",
    description: "Any occasion worth planning",
  },
];

function formatSummaryDate(dateString: string): string {
  return dateString ? formatEventDate(dateString) : "Not set yet";
}

export function EventInputForm({ onSubmit, isLoading }: EventInputFormProps) {
  const formId = useId();
  const [isMounted, setIsMounted] = useState(false);
  const [todayStr, setTodayStr] = useState("");
  const [eventType, setEventType] =
    useState<EventInput["eventType"]>("Wedding");
  const [totalBudget, setTotalBudget] = useState(12000);
  const [guestCount, setGuestCount] = useState(80);
  const [eventDate, setEventDate] = useState("");
  const [locationVibe, setLocationVibe] = useState(VIBE_PRESETS[0]);
  const [specialNotes, setSpecialNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setTodayStr(getLocalDateString());
    setEventDate((current) => current || getLocalDateString(14));
  }, []);

  const rawDaysRemaining = isMounted ? daysUntilDate(eventDate) : 14;
  const isPastDate = isMounted && rawDaysRemaining < 0;
  const daysRemaining = Math.max(0, rawDaysRemaining);
  const isUrgent = isMounted && daysRemaining < 7 && !isPastDate;
  const budgetPerGuest =
    guestCount > 0 ? Math.round(totalBudget / guestCount) : 0;

  const loadExample = (example: "urgent" | "wedding") => {
    if (example === "urgent") {
      setEventType("Birthday");
      setTotalBudget(2500);
      setGuestCount(30);
      setEventDate(getLocalDateString(4));
      setLocationVibe("Chic rooftop dinner");
      setSpecialNotes(
        "Last-minute milestone birthday. We would like a short, simple evening."
      );
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
    if (!Number.isFinite(totalBudget) || totalBudget <= 0) {
      setErrorMsg("Enter a budget greater than zero.");
      return;
    }
    if (!Number.isFinite(guestCount) || guestCount < 1) {
      setErrorMsg("Enter at least one guest.");
      return;
    }

    const inputData: EventInput = {
      eventType,
      totalBudget: Math.round(totalBudget),
      guestCount: Math.round(guestCount),
      eventDate,
      daysRemaining,
      locationVibe: locationVibe.trim(),
      specialNotes: specialNotes.trim() || undefined,
    };

    const parsed = EventInputSchema.safeParse(inputData);
    if (!parsed.success) {
      setErrorMsg(
        parsed.error.issues[0]?.message || "Please check your event details."
      );
      return;
    }

    try {
      await onSubmit(parsed.data);
    } catch (error: unknown) {
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "We could not build the plan. Please try again."
      );
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-line px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-ink-faint">
              Start here
            </p>
            <h2 className="mt-2 font-serif text-2xl leading-tight text-ink">
              Tell us about the day
            </h2>
            <p className="mt-1.5 max-w-md text-sm leading-6 text-ink-muted">
              A few details are enough to begin. Every number, task, and note
              can be changed afterwards.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-ink-faint">Try an example</span>
            <Button size="sm" onClick={() => loadExample("urgent")}>
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              4-day birthday
            </Button>
            <Button size="sm" onClick={() => loadExample("wedding")}>
              <HeartHandshake className="h-3.5 w-3.5" aria-hidden="true" />
              Garden wedding
            </Button>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px]"
      >
        <div className="min-w-0 space-y-7 px-5 py-6 sm:px-6">
          {errorMsg ? (
            <Callout tone="danger" role="alert" title="Check your details">
              {errorMsg}
            </Callout>
          ) : null}

          {isUrgent ? (
            <Callout
              tone="warning"
              role="status"
              title={`${daysRemaining} ${daysRemaining === 1 ? "day" : "days"} to go`}
            >
              The plan will focus on decisions that can be made quickly and
              bookings that are realistic for a short timeline.
            </Callout>
          ) : null}

          <fieldset>
            <legend className="mb-3 text-sm font-medium text-ink">
              What are you celebrating?
            </legend>
            <div className="grid grid-cols-2 gap-2.5">
              {EVENT_TYPES.map(
                ({ type, icon: Icon, title, description }) => {
                  const active = eventType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setEventType(type)}
                      className={`relative min-h-[92px] rounded-lg border p-3.5 text-left transition-colors ${
                        active
                          ? "border-accent bg-accent-soft"
                          : "border-line bg-surface hover:border-line-strong hover:bg-surface-muted"
                      }`}
                    >
                      <span
                        className={`mb-2 flex h-8 w-8 items-center justify-center rounded-md ${
                          active
                            ? "bg-surface text-accent"
                            : "bg-surface-muted text-ink-faint"
                        }`}
                      >
                        <Icon
                          className="h-4 w-4"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </span>
                      <span className="block text-sm font-medium text-ink">
                        {title}
                      </span>
                      <span className="mt-0.5 block pr-5 text-xs leading-5 text-ink-muted">
                        {description}
                      </span>
                      {active ? (
                        <Check
                          className="absolute right-3 top-3 h-4 w-4 text-accent"
                          aria-hidden="true"
                        />
                      ) : null}
                    </button>
                  );
                }
              )}
            </div>
          </fieldset>

          <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
            <Field
              label="Total budget"
              htmlFor={`${formId}-budget`}
              hint={`About ${formatCurrency(budgetPerGuest)} per guest.`}
            >
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-ink-faint"
                >
                  {"\u20B9"}
                </span>
                <Input
                  id={`${formId}-budget`}
                  type="number"
                  min="100"
                  step="50"
                  inputMode="numeric"
                  value={totalBudget}
                  onChange={(event) =>
                    setTotalBudget(Number(event.target.value))
                  }
                  required
                  className="pl-7 font-medium"
                  aria-describedby={`${formId}-budget-hint`}
                />
              </div>
            </Field>

            <Field
              label="Guest count"
              htmlFor={`${formId}-guests`}
              hint="An estimate is fine for now."
            >
              <Input
                id={`${formId}-guests`}
                type="number"
                min="1"
                max="100000"
                inputMode="numeric"
                value={guestCount}
                onChange={(event) => setGuestCount(Number(event.target.value))}
                required
                className="font-medium"
                aria-describedby={`${formId}-guests-hint`}
              />
            </Field>

            <Field
              label="Event date"
              htmlFor={`${formId}-date`}
              hint="Choose today or a future date."
            >
              <Input
                id={`${formId}-date`}
                type="date"
                min={todayStr || undefined}
                value={eventDate}
                onChange={(event) => {
                  setEventDate(event.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                required
                className="font-medium"
                aria-describedby={`${formId}-date-hint`}
              />
            </Field>

            <Field
              label="Setting and style"
              htmlFor={`${formId}-vibe`}
              hint="Describe the atmosphere or venue you have in mind."
            >
              <Input
                id={`${formId}-vibe`}
                type="text"
                value={locationVibe}
                onChange={(event) => setLocationVibe(event.target.value)}
                required
                maxLength={160}
                placeholder="e.g. rooftop dinner, relaxed garden"
                list={`${formId}-vibe-presets`}
                aria-describedby={`${formId}-vibe-hint`}
              />
              <datalist id={`${formId}-vibe-presets`}>
                {VIBE_PRESETS.map((preset) => (
                  <option value={preset} key={preset} />
                ))}
              </datalist>
            </Field>
          </div>

          <Field
            label="Anything important we should know?"
            htmlFor={`${formId}-notes`}
            optional
            hint="Dietary needs, accessibility, a surprise moment, or things to avoid."
          >
            <Textarea
              id={`${formId}-notes`}
              rows={3}
              maxLength={1200}
              value={specialNotes}
              onChange={(event) => setSpecialNotes(event.target.value)}
              placeholder="e.g. two guests use wheelchairs; we would like a quiet space for older relatives."
              aria-describedby={`${formId}-notes-hint`}
            />
            <div className="flex justify-end text-xs tabular-nums text-ink-faint">
              {specialNotes.length}/1200
            </div>
          </Field>
        </div>

        <aside className="border-t border-line bg-surface-muted px-5 py-6 sm:px-6 lg:sticky lg:top-20 lg:self-start lg:border-l lg:border-t-0">
          <p className="text-[10px] uppercase tracking-[0.18em] text-ink-faint">
            Your plan so far
          </p>

          <dl className="mt-3 divide-y divide-line rounded-lg border border-line bg-surface px-4">
            <div className="flex items-start justify-between gap-4 py-3">
              <dt className="text-xs text-ink-muted">Occasion</dt>
              <dd className="text-right text-xs font-medium text-ink">
                {eventType === "Community Event" ? "Community event" : eventType}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4 py-3">
              <dt className="text-xs text-ink-muted">Date</dt>
              <dd className="text-right text-xs font-medium text-ink">
                {formatSummaryDate(eventDate)}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4 py-3">
              <dt className="text-xs text-ink-muted">Guests</dt>
              <dd className="text-right text-xs font-medium tabular-nums text-ink">
                {Math.max(0, guestCount).toLocaleString("en-US")}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4 py-3">
              <dt className="shrink-0 text-xs text-ink-muted">Setting</dt>
              <dd className="max-w-[180px] text-right text-xs font-medium leading-5 text-ink">
                {locationVibe.trim() || "Not set yet"}
              </dd>
            </div>
          </dl>

          <div className="mt-4 rounded-lg border border-line bg-surface p-4">
            <p className="text-xs text-ink-muted">Working budget</p>
            <p className="mt-1 font-serif text-3xl leading-none text-ink">
              {formatCurrency(Math.max(0, totalBudget))}
            </p>
            <p className="mt-2 text-xs text-ink-muted">
              {formatCurrency(budgetPerGuest)} per guest, estimated
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="mt-5 w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2
                  className="h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
                Building your plan
              </>
            ) : (
              <>
                Build my plan
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </Button>
          <p className="mt-3 text-center text-xs leading-5 text-ink-faint">
            You can change the budget, tasks, and vendor notes afterwards.
          </p>
          <p className="mt-2 text-center text-[11px] leading-5 text-ink-faint">
            No account needed. Your plan stays in this browser unless you
            choose to share it.
          </p>
        </aside>
      </form>
    </Card>
  );
}
