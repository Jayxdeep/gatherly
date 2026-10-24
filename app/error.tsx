"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-content px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg rounded-xl border border-line bg-surface p-8 text-center shadow-card">
        <p className="text-xs font-medium text-accent">Something went wrong</p>
        <h1 className="mt-2 font-serif text-3xl text-ink">
          We could not load this page
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink-muted">
          Your saved plan is still in this browser. Try loading the page again.
          {error.digest ? (
            <span className="mt-2 block text-xs text-ink-faint">
              Reference: {error.digest}
            </span>
          ) : null}
        </p>
        <Button
          variant="primary"
          className="mt-6"
          onClick={() => reset()}
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
