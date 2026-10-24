"use client";

import React from "react";
import { EventInputForm } from "@/components/EventInputForm";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PlanDashboard } from "@/components/PlanDashboard";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { usePlanSession } from "@/lib/hooks/usePlanSession";

export default function HomePage() {
  const {
    input,
    plan,
    source,
    isLoading,
    sharedNotice,
    submitPlan,
    resetPlan,
    dismissSharedNotice,
  } = usePlanSession();

  const showPlan = Boolean(input && plan);

  return (
    <div className="mx-auto w-full max-w-content px-4 sm:px-6 lg:px-8">
      {showPlan && input && plan ? (
        <div className="py-8 sm:py-10">
          {sharedNotice ? (
            <Callout tone="info" role="status" className="mb-5">
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-ink">
                    You are viewing a shared plan.
                  </p>
                  <p className="text-xs leading-5">
                    Changes you make here stay in this browser and are not sent
                    back to the person who shared it.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={dismissSharedNotice}
                >
                  Dismiss
                </Button>
              </div>
            </Callout>
          ) : null}

          <PlanDashboard
            input={input}
            plan={plan}
            source={source}
            onReset={resetPlan}
          />
        </div>
      ) : (
        <>
          <Hero />
          <HowItWorks />
          <section
            id="planner"
            aria-label="Create your event plan"
            className="scroll-mt-24 py-12 sm:py-16"
          >
            <EventInputForm onSubmit={submitPlan} isLoading={isLoading} />
          </section>
        </>
      )}
    </div>
  );
}
