"use client";

import React from "react";
import { Sparkles, Lightbulb, BookmarkCheck, HeartHandshake } from "lucide-react";

interface PersonalizedIdeasProps {
  ideas: string[];
  vibe: string;
  isUrgentMode: boolean;
}

export function PersonalizedIdeas({ ideas, vibe, isUrgentMode }: PersonalizedIdeasProps) {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Curated Inspiration & Cost-Saving Hacks
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tailored specifically for &ldquo;{vibe}&rdquo; aesthetic and your budget constraints.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ideas.map((idea, index) => (
          <div
            key={index}
            className="p-5 rounded-2xl bg-gradient-to-br from-white to-rose-50/40 border border-rose-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow"
          >
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-200 flex items-center justify-center text-brand-600 shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                  Insight #{index + 1}
                </span>
                {isUrgentMode && index === 0 && (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    Fast Execution
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium pt-1">
                {idea}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
