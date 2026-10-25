import React from "react";

const steps = [
  {
    number: "01",
    title: "Share the basics",
    description:
      "Occasion, date, budget, guest count, and anything that would make the day easier.",
  },
  {
    number: "02",
    title: "Get a working plan",
    description:
      "A budget split, a phase-by-phase timeline, vendor questions, and a few ideas for the setting.",
  },
  {
    number: "03",
    title: "Make it yours",
    description:
      "Move money between categories, tick off tasks, save the plan, or share a link with someone helping.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-y border-line py-10 sm:py-12"
    >
      <h2 className="font-serif text-2xl text-ink">How it works</h2>
      <div className="mt-7 grid gap-7 sm:grid-cols-3 sm:gap-8">
        {steps.map((step) => (
          <div key={step.number} className="border-l border-line pl-5">
            <p className="text-xs font-medium tabular-nums text-accent">
              {step.number}
            </p>
            <h3 className="mt-2 text-sm font-semibold text-ink">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-6 text-ink-muted">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
