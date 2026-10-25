import React from "react";
import { ArrowRight } from "lucide-react";
import { ExamplePlanCard } from "@/components/landing/ExamplePlanCard";
import { buttonStyles } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="grid gap-12 pb-14 pt-12 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-center lg:gap-16 lg:pb-20">
      <div className="max-w-2xl">
        <p className="text-xs font-medium text-accent">
          Weddings, birthdays, and community events
        </p>
        <h1 className="mt-4 font-serif text-[2.65rem] leading-[1.06] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]">
          A clear plan for a day that matters.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-ink-muted sm:text-lg sm:leading-8">
          Tell us the occasion, budget, and guest count. Gatherly turns them into
          a plan you can work from: how to split the budget, what to do next, and
          what to ask every vendor.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="#planner"
            className={buttonStyles({ variant: "primary", size: "md" })}
          >
            Start planning
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href="#how-it-works"
            className={buttonStyles({ variant: "quiet", size: "md" })}
          >
            See how it works
          </a>
        </div>

        <p className="mt-4 text-xs leading-5 text-ink-faint">
          No account needed. Your plan stays in this browser unless you choose to
          share it.
        </p>
      </div>

      <ExamplePlanCard />
    </section>
  );
}
