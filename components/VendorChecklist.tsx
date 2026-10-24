"use client";

import React, { useState } from "react";
import type { VendorItem } from "@/lib/schemas/event";
import {
  VendorCard,
  type VendorStatus,
} from "@/components/vendors/VendorCard";

interface VendorChecklistProps {
  vendors: VendorItem[];
}

export function VendorChecklist({ vendors }: VendorChecklistProps) {
  const [statuses, setStatuses] = useState<Record<string, VendorStatus>>({});
  const [asked, setAsked] = useState<Record<string, boolean>>({});

  const booked = vendors.filter(
    (vendor) => statuses[vendor.vendorType] === "Booked"
  ).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl leading-tight text-ink">Vendors</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-muted">
            Questions worth asking before you commit, and a place to keep track
            of each conversation.
          </p>
        </div>
        {vendors.length > 0 ? (
          <p className="text-xs tabular-nums text-ink-muted">
            {booked} of {vendors.length} booked
          </p>
        ) : null}
      </div>

      {vendors.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {vendors.map((vendor) => {
            const key = vendor.vendorType;
            const questionState: Record<number, boolean> = {};
            vendor.keyQuestions.forEach((_, index) => {
              questionState[index] = Boolean(asked[`${key}-${index}`]);
            });

            return (
              <VendorCard
                key={key}
                vendor={vendor}
                status={statuses[key] || "To Contact"}
                askedQuestions={questionState}
                onStatusChange={(status) =>
                  setStatuses((current) => ({ ...current, [key]: status }))
                }
                onToggleQuestion={(index) =>
                  setAsked((current) => ({
                    ...current,
                    [`${key}-${index}`]: !current[`${key}-${index}`],
                  }))
                }
              />
            );
          })}
        </div>
      ) : (
        <p className="rounded-xl border border-line bg-surface p-6 text-sm text-ink-muted">
          No vendor suggestions were returned for this plan. You can still track
          your own conversations in notes.
        </p>
      )}
    </div>
  );
}
