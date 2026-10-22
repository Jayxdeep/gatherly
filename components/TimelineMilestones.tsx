"use client";

import React, { useState } from "react";
import { MilestonePhase } from "@/lib/schemas/event";
import { CheckSquare, Square, Plus, CheckCircle2, CalendarDays } from "lucide-react";

interface TimelineMilestonesProps {
  initialMilestones: MilestonePhase[];
  onExportCalendar?: () => void;
}

export function TimelineMilestones({ initialMilestones, onExportCalendar }: TimelineMilestonesProps) {
  const [milestones, setMilestones] = useState<MilestonePhase[]>(initialMilestones);
  const [activePhaseIndex, setActivePhaseIndex] = useState<number | null>(null);
  const [newTaskName, setNewTaskName] = useState<string>("");

  // Toggle task completed
  const toggleTask = (phaseIndex: number, taskId: string) => {
    setMilestones((prev) =>
      prev.map((phase, pIdx) => {
        if (pIdx !== phaseIndex) return phase;
        return {
          ...phase,
          tasks: phase.tasks.map((task) =>
            task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
          ),
        };
      })
    );
  };

  // Add new task to phase
  const handleAddTask = (phaseIndex: number) => {
    if (!newTaskName.trim()) return;
    const newTask = {
      id: `task-${Date.now()}`,
      taskName: newTaskName.trim(),
      isCompleted: false,
    };
    setMilestones((prev) =>
      prev.map((phase, pIdx) =>
        pIdx === phaseIndex
          ? { ...phase, tasks: [...phase.tasks, newTask] }
          : phase
      )
    );
    setNewTaskName("");
    setActivePhaseIndex(null);
  };

  // Calculate overall progress
  const totalTasks = milestones.reduce((sum, p) => sum + p.tasks.length, 0);
  const completedTasks = milestones.reduce(
    (sum, p) => sum + p.tasks.filter((t) => t.isCompleted).length,
    0
  );
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Progress Metric Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-brand-600" />
            Execution Roadmap Progress
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-0.5">
            {completedTasks} of {totalTasks} Tasks Completed ({progressPercent}%)
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {onExportCalendar && (
            <button
              type="button"
              onClick={onExportCalendar}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl transition-colors shrink-0"
              title="Download RFC 5545 calendar file (.ics)"
            >
              <CalendarDays className="w-3.5 h-3.5 text-rose-500" />
              <span>Sync to Calendar</span>
            </button>
          )}

          <div className="w-full sm:w-48 space-y-1">
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-600 to-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-right text-slate-400 font-mono">
              {progressPercent === 100 ? "Ready to launch! 🎉" : `${progressPercent}% complete`}
            </p>
          </div>
        </div>
      </div>

      {/* Milestone Phases Accordion/Cards */}
      <div className="space-y-4">
        {milestones.map((phase, phaseIndex) => {
          const phaseTotal = phase.tasks.length;
          const phaseCompleted = phase.tasks.filter((t) => t.isCompleted).length;

          return (
            <div
              key={phase.phase}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center">
                    {phaseIndex + 1}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    {phase.phase}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600">
                    {phaseCompleted}/{phaseTotal} Done
                  </span>
                </div>
              </div>

              {/* Task Checklist */}
              <div className="p-4 sm:p-5 space-y-2.5">
                {phase.tasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => toggleTask(phaseIndex, task.id)}
                    className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                      task.isCompleted
                        ? "bg-emerald-50/40 border-emerald-200 text-slate-400"
                        : "bg-white border-slate-200 hover:border-brand-300 text-slate-800"
                    }`}
                  >
                    {task.isCompleted ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 shrink-0 hover:text-brand-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        task.isCompleted ? "line-through text-slate-400" : ""
                      }`}
                    >
                      {task.taskName}
                    </span>
                  </button>
                ))}

                {/* Inline Add Task */}
                {activePhaseIndex === phaseIndex ? (
                  <div className="pt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter new task name..."
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTask(phaseIndex);
                        }
                      }}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTask(phaseIndex)}
                      className="px-3 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl hover:bg-brand-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActivePhaseIndex(null);
                        setNewTaskName("");
                      }}
                      className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActivePhaseIndex(phaseIndex);
                      setNewTaskName("");
                    }}
                    className="mt-2 text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-brand-50 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add task to this phase
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
