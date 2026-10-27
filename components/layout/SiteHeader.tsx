import React from "react";

export function SiteHeader() {
  return (
    <header className="no-print sticky top-0 z-30 border-b border-line bg-canvas">
      <div className="mx-auto flex h-16 w-full max-w-content items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline gap-3">
          <span className="font-serif text-[1.6rem] leading-none tracking-tight text-ink">
            Gatherly
          </span>
          <span className="hidden text-xs text-ink-faint sm:inline">
            Event planning
          </span>
        </div>
        <p className="hidden text-xs text-ink-faint sm:block">
          Plan the budget, timeline, and vendor conversations in one place.
        </p>
      </div>
    </header>
  );
}
