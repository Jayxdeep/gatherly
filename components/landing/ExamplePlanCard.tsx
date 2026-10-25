import React from "react";
import { Check, Circle, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

const previewCategories = [
  { label: "Venue", percent: 24, color: "#8c3f4c" },
  { label: "Catering", percent: 38, color: "#b06a74" },
  { label: "Photography", percent: 14, color: "#c98d97" },
  { label: "Flowers", percent: 10, color: "#ddb9bf" },
  { label: "Contingency", percent: 14, color: "#e3ded4" },
];

export function ExamplePlanCard() {
  return (
    <Card className="overflow-hidden" aria-label="Example event plan">
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-ink-faint">Example plan</p>
          <Badge tone="accent">Wedding</Badge>
        </div>
        <p className="mt-2 font-serif text-xl leading-snug text-ink">
          Garden ceremony and dinner
        </p>

        <div className="mt-5 grid grid-cols-3 divide-x divide-line rounded-lg border border-line">
          <div className="px-3 py-3">
            <p className="text-[11px] text-ink-muted">Budget</p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums text-ink">
              $28,000
            </p>
          </div>
          <div className="px-3 py-3">
            <p className="text-[11px] text-ink-muted">Guests</p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums text-ink">
              120
            </p>
          </div>
          <div className="px-3 py-3">
            <p className="text-[11px] text-ink-muted">Timeline</p>
            <p className="mt-0.5 text-sm font-semibold text-ink">5 phases</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <p className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted">
              <Wallet className="h-3.5 w-3.5" aria-hidden="true" />
              Budget split
            </p>
            <p className="text-xs tabular-nums text-ink-faint">100%</p>
          </div>
          <div
            className="mt-2 flex h-2.5 overflow-hidden rounded-full"
            aria-hidden="true"
          >
            {previewCategories.map((category) => (
              <span
                key={category.label}
                style={{
                  width: `${category.percent}%`,
                  backgroundColor: category.color,
                }}
              />
            ))}
          </div>
          <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
            {previewCategories.slice(0, 3).map((category) => (
              <span
                key={category.label}
                className="inline-flex items-center gap-1.5 text-[11px] text-ink-muted"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                  aria-hidden="true"
                />
                {category.label} {category.percent}%
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-line px-5 py-4">
        <p className="text-xs font-medium text-ink-muted">Next tasks</p>
        <ul className="mt-2.5 space-y-2">
          <li className="flex items-start gap-2.5 text-sm text-ink-faint">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-positive"
              aria-hidden="true"
            />
            <span className="line-through">Confirm the venue and date</span>
          </li>
          <li className="flex items-start gap-2.5 text-sm text-ink">
            <Circle
              className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint"
              aria-hidden="true"
            />
            Send save-the-dates
          </li>
          <li className="flex items-start gap-2.5 text-sm text-ink">
            <Circle
              className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint"
              aria-hidden="true"
            />
            Book the photographer
          </li>
        </ul>
      </div>

      <p className="border-t border-line bg-surface-muted px-5 py-3 text-xs text-ink-faint">
        Every part of a Gatherly plan is editable.
      </p>
    </Card>
  );
}
