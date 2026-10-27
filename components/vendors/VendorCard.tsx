"use client";

import React from "react";
import { Check } from "lucide-react";
import type { VendorItem } from "@/lib/schemas/event";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export type VendorStatus = "To Contact" | "In Discussions" | "Booked";

const statusTone: Record<VendorStatus, string> = {
  "To Contact": "bg-surface-muted text-ink-muted",
  "In Discussions": "bg-warning-soft text-warning",
  Booked: "bg-positive-soft text-positive",
};

interface VendorCardProps {
  vendor: VendorItem;
  status: VendorStatus;
  askedQuestions: Record<number, boolean>;
  onStatusChange: (status: VendorStatus) => void;
  onToggleQuestion: (index: number) => void;
}

export function VendorCard({
  vendor,
  status,
  askedQuestions,
  onStatusChange,
  onToggleQuestion,
}: VendorCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-5 text-ink">
            {vendor.vendorType}
          </h3>
          <p className="mt-1 text-xs leading-5 text-ink-muted">
            Typical range: {vendor.estimatedBudgetRange}
          </p>
        </div>
        <select
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as VendorStatus)
          }
          aria-label={`Status for ${vendor.vendorType}`}
          className={cn(
            "shrink-0 cursor-pointer rounded-full border-0 py-1 pl-2.5 pr-6 text-[11px] font-medium focus:outline-none focus:ring-2 focus:ring-[#c98d97]",
            statusTone[status]
          )}
        >
          <option value="To Contact">To contact</option>
          <option value="In Discussions">In discussions</option>
          <option value="Booked">Booked</option>
        </select>
      </div>

      <p className="mt-4 text-xs font-medium text-ink-muted">
        Questions to ask
      </p>
      <ul className="mt-1.5 space-y-0.5">
        {vendor.keyQuestions.map((question, index) => {
          const asked = Boolean(askedQuestions[index]);
          return (
            <li key={`${vendor.vendorType}-${index}`}>
              <button
                type="button"
                role="checkbox"
                aria-checked={asked}
                onClick={() => onToggleQuestion(index)}
                className="flex w-full items-start gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-surface-muted"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                    asked
                      ? "border-positive bg-positive text-white"
                      : "border-line-strong bg-surface text-transparent"
                  )}
                >
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
                <span
                  className={cn(
                    "text-[13px] leading-5",
                    asked ? "text-ink-faint line-through" : "text-ink"
                  )}
                >
                  {question}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
