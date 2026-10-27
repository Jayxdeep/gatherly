import React from "react";

export function SiteFooter() {
  return (
    <footer className="no-print mt-16 border-t border-line">
      <div className="mx-auto flex w-full max-w-content flex-col gap-3 px-4 py-8 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-base text-ink">Gatherly</span>
          <span aria-hidden="true">·</span>
          <span>A calmer way to plan the day.</span>
        </div>
        <p>
          Plans are stored in this browser. Nothing is shared unless you send a
          link.
        </p>
      </div>
    </footer>
  );
}
