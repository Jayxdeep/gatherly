import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

interface PersonalizedIdeasProps {
  ideas: string[];
  vibe: string;
  isUrgentMode: boolean;
}

export function PersonalizedIdeas({
  ideas,
  vibe,
  isUrgentMode,
}: PersonalizedIdeasProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-2xl leading-tight text-ink">Ideas</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-muted">
          Small choices that suit {vibe ? `“${vibe}”` : "your setting"}
          {isUrgentMode ? ", with a shorter timeline in mind" : ""}.
        </p>
      </div>

      {ideas.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {ideas.map((idea, index) => (
            <Card key={`${index}-${idea.slice(0, 12)}`} className="p-5">
              <p className="text-xs font-medium tabular-nums text-accent">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-2 text-sm leading-6 text-ink">{idea}</p>
              {isUrgentMode && index === 0 ? (
                <Badge tone="warning" className="mt-3">
                  Realistic on a short timeline
                </Badge>
              ) : null}
            </Card>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-line bg-surface p-6 text-sm text-ink-muted">
          No extra ideas were returned for this plan.
        </p>
      )}
    </div>
  );
}
