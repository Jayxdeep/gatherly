"use client";

import React, { useState } from "react";
import { Check, Plus } from "lucide-react";
import type { MilestonePhase, MilestoneTask } from "@/lib/schemas/event";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Controls";
import { cn } from "@/lib/utils";

interface MilestoneCardProps {
  phase: MilestonePhase;
  index: number;
  onToggleTask: (taskId: string) => void;
  onAddTask: (taskName: string) => void;
}

export function MilestoneCard({
  phase,
  index,
  onToggleTask,
  onAddTask,
}: MilestoneCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [taskName, setTaskName] = useState("");

  const completed = phase.tasks.filter((task) => task.isCompleted).length;
  const total = phase.tasks.length;
  const allDone = total > 0 && completed === total;

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = taskName.trim();
    if (!trimmed) return;
    onAddTask(trimmed);
    setTaskName("");
    setIsAdding(false);
  };

  return (
    <Card>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="text-xs font-medium tabular-nums text-ink-faint">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="truncate text-sm font-semibold text-ink">
            {phase.phase}
          </h3>
        </div>
        <Badge tone={allDone ? "positive" : "neutral"}>
          {allDone ? "Complete" : `${completed} of ${total}`}
        </Badge>
      </div>

      {phase.tasks.length > 0 ? (
        <ul className="divide-y divide-line">
          {phase.tasks.map((task: MilestoneTask) => (
            <li key={task.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={task.isCompleted}
                onClick={() => onToggleTask(task.id)}
                className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-muted sm:px-5"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border",
                    task.isCompleted
                      ? "border-positive bg-positive text-white"
                      : "border-line-strong bg-surface text-transparent"
                  )}
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span
                  className={cn(
                    "text-sm leading-6",
                    task.isCompleted
                      ? "text-ink-faint line-through"
                      : "text-ink"
                  )}
                >
                  {task.taskName}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-4 py-4 text-sm text-ink-muted sm:px-5">
          No tasks in this phase yet.
        </p>
      )}

      <div className="border-t border-line px-4 py-2.5 sm:px-5">
        {isAdding ? (
          <form onSubmit={handleAdd} className="flex flex-col gap-2 py-1 sm:flex-row">
            <label htmlFor={`new-task-${index}`} className="sr-only">
              New task for {phase.phase}
            </label>
            <Input
              id={`new-task-${index}`}
              value={taskName}
              onChange={(event) => setTaskName(event.target.value)}
              placeholder="What needs to happen?"
              maxLength={140}
              autoFocus
              className="min-h-9 py-1.5"
            />
            <div className="flex gap-2">
              <Button type="submit" variant="primary" size="sm">
                Add
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setTaskName("");
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button
            variant="quiet"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="-ml-2"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Add task
          </Button>
        )}
      </div>
    </Card>
  );
}
