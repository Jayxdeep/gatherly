"use client";

import React, { useState } from "react";
import { VendorItem } from "@/lib/schemas/event";
import {
  HelpCircle,
  DollarSign,
  Briefcase,
  CheckCircle,
  FileQuestion,
  PhoneCall,
} from "lucide-react";

interface VendorChecklistProps {
  vendors: VendorItem[];
}

export function VendorChecklist({ vendors }: VendorChecklistProps) {
  const [vendorStatuses, setVendorStatuses] = useState<
    Record<string, "To Contact" | "In Discussions" | "Booked">
  >({});

  const handleStatusChange = (
    vendorType: string,
    status: "To Contact" | "In Discussions" | "Booked"
  ) => {
    setVendorStatuses((prev) => ({ ...prev, [vendorType]: status }));
  };

  const getStatusBadge = (status: "To Contact" | "In Discussions" | "Booked" = "To Contact") => {
    switch (status) {
      case "Booked":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "In Discussions":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-brand-600" />
            Vendor Playbook & Vetting Matrix
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Key negotiation questions and estimated price tiers tailored to your event scope.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vendors.map((vendor, index) => {
          const currentStatus = vendorStatuses[vendor.vendorType] || "To Contact";

          return (
            <div
              key={index}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">
                      {vendor.vendorType}
                    </h4>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-1">
                      <DollarSign className="w-3 h-3" />
                      Range: {vendor.estimatedBudgetRange}
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={currentStatus}
                    onChange={(e) =>
                      handleStatusChange(
                        vendor.vendorType,
                        e.target.value as "To Contact" | "In Discussions" | "Booked"
                      )
                    }
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer ${getStatusBadge(
                      currentStatus
                    )}`}
                  >
                    <option value="To Contact">To Contact</option>
                    <option value="In Discussions">In Discussions</option>
                    <option value="Booked">Booked</option>
                  </select>
                </div>

                {/* Key Questions Checklist */}
                <div className="space-y-2 mt-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <FileQuestion className="w-3.5 h-3.5 text-brand-600" />
                    Essential Vetting Questions
                  </p>
                  <ul className="space-y-2">
                    {vendor.keyQuestions.map((q, qIdx) => (
                      <li
                        key={qIdx}
                        className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-start gap-2 leading-relaxed"
                      >
                        <span className="w-4 h-4 rounded-full bg-brand-100 text-brand-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {qIdx + 1}
                        </span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Contract Due Diligence</span>
                <span className="font-mono text-brand-600 font-semibold">Tier Verified</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
