"use client";

import React, { useState } from "react";
import type { MilestonePhase } from "@/lib/schemas/event";
import { TimelineProgress } from "@/components/timeline/TimelineProgress";
import { MilestoneCard } from "@/components/timeline/MilestoneCard";

interface TimelineMilestonesProps {
  initialMilestones: MilestonePhase[];
}

export function TimelineMilestones({
  initialMilestones,
}: TimelineMilestonesProps) {
  const [milestones, setMilestones] =
    useState<MilestonePhase[]>(initialMilestones);

  const toggleTask = (phaseIndex: number, taskId: string) => {
    setMilestones((current) =>
      current.map((phase, index) => {
        if (index !== phaseIndex) return phase;
        return {
          ...phase,
          tasks: phase.tasks.map((task) =>
            task.id === taskId
              ? { ...task, isCompleted: !task.isCompleted }
              : task
          ),
        };
      })
    );
  };

  const addTask = (phaseIndex: number, taskName: string) => {
    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      taskName,
      isCompleted: false,
    };
    setMilestones((current) =>
      current.map((phase, index) =>
        index === phaseIndex
          ? { ...phase, tasks: [...phase.tasks, newTask] }
          : phase
      )
    );
  };

  const total = milestones.reduce(
    (sum, phase) => sum + phase.tasks.length,
    0
  );
  const completed = milestones.reduce(
    (sum, phase) =>
      sum + phase.tasks.filter((task) => task.isCompleted).length,
    0
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-2xl leading-tight text-ink">Timeline</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-muted">
          Work through each phase in order. Tick a task when it is done, or add
          anything the plan missed.
        </p>
      </div>

      <TimelineProgress completed={completed} total={total} />

      <div className="space-y-4">
        {milestones.map((phase, index) => (
          <MilestoneCard
            key={`${phase.phase}-${index}`}
            phase={phase}
            index={index}
            onToggleTask={(taskId) => toggleTask(index, taskId)}
            onAddTask={(taskName) => addTask(index, taskName)}
          />
        ))}
      </div>
    </div>
  );
}
