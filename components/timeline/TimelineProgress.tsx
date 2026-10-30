import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface TimelineProgressProps {
  completed: number;
  total: number;
}

export function TimelineProgress({ completed, total }: TimelineProgressProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div aria-live="polite">
          <p className="text-xs font-medium text-ink-muted">Overall progress</p>
          <p className="mt-1 font-serif text-2xl leading-tight text-ink">
            {completed} of {total} tasks done
          </p>
        </div>
        <div className="w-full sm:w-64">
          <ProgressBar
            value={percent}
            label="Timeline progress"
            tone={percent === 100 ? "positive" : "accent"}
          />
          <p className="mt-1.5 text-right text-xs tabular-nums text-ink-muted">
            {percent}% complete
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
