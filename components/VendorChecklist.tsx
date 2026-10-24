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
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glow-emerald";
      case "In Discussions":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-glow-amber";
      default:
        return "bg-slate-800 text-slate-300 border-white/10";
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl glass-panel border border-white/10 shadow-xl flex items-center justify-between text-white">
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Briefcase className="w-5 h-5 text-rose-400" />
            Vendor Playbook & Vetting Matrix
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Key negotiation questions and estimated price tiers tailored to your event scope.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {vendors.map((vendor, index) => {
          const currentStatus = vendorStatuses[vendor.vendorType] || "To Contact";

          return (
            <div
              key={index}
              className="p-6 rounded-2xl glass-card glass-card-hover border border-white/10 shadow-lg flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h4 className="font-display font-black text-white text-lg">
                      {vendor.vendorType}
                    </h4>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg mt-1.5">
                      <DollarSign className="w-3.5 h-3.5" />
                      Estimated: {vendor.estimatedBudgetRange}
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
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border cursor-pointer bg-slate-900 transition-all ${getStatusBadge(
                      currentStatus
                    )}`}
                  >
                    <option value="To Contact">To Contact</option>
                    <option value="In Discussions">In Discussions</option>
                    <option value="Booked">Booked</option>
                  </select>
                </div>

                {/* Key Questions Checklist */}
                <div className="space-y-2.5 mt-4">
                  <p className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
                    <FileQuestion className="w-4 h-4 text-rose-400" />
                    Essential Vetting Inquiries
                  </p>
                  <ul className="space-y-2">
                    {vendor.keyQuestions.map((q, qIdx) => (
                      <li
                        key={qIdx}
                        className="text-xs text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-white/5 flex items-start gap-2.5 leading-relaxed"
                      >
                        <span className="w-5 h-5 rounded-lg bg-rose-500/20 text-rose-300 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-rose-500/30">
                          {qIdx + 1}
                        </span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>Contract Due Diligence</span>
                <span className="font-mono text-rose-400 font-bold">Tier Verified</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
