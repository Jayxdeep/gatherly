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
      <div className="p-6 rounded-3xl glass-panel border border-white/10 shadow-xl flex items-center justify-between text-white">
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Curated Inspiration & Cost-Saving Hacks
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tailored specifically for &ldquo;{vibe}&rdquo; aesthetic and your budget constraints.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ideas.map((idea, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl glass-card glass-card-hover border border-white/10 shadow-lg flex items-start gap-4 transition-all"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-rose-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0 shadow-glow-amber">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300 bg-rose-500/20 border border-rose-500/30 px-2.5 py-0.5 rounded-full font-mono">
                  Insight #{index + 1}
                </span>
                {isUrgentMode && index === 0 && (
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                    ⚡ Fast Turnaround
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                {idea}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
