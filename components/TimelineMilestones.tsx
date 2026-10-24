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
      <div className="p-6 rounded-3xl glass-panel border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5 text-white">
        <div>
          <span className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Execution Roadmap Progress
          </span>
          <h3 className="font-display text-xl sm:text-2xl font-black text-white mt-1">
            {completedTasks} of {totalTasks} Tasks Completed
            <span className="text-rose-400 ml-2 font-mono">({progressPercent}%)</span>
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {onExportCalendar && (
            <button
              type="button"
              onClick={onExportCalendar}
              className="inline-flex items-center gap-2 text-xs font-bold bg-gradient-to-r from-rose-500/20 to-pink-500/20 text-rose-300 hover:text-white hover:from-rose-500/30 hover:to-pink-500/30 px-4 py-2.5 rounded-xl border border-rose-500/40 shadow-glow-brand transition-all backdrop-blur-md active:scale-95 shrink-0"
              title="Download RFC 5545 calendar file (.ics)"
            >
              <CalendarDays className="w-4 h-4 text-rose-400" />
              <span>Sync to Calendar (.ics)</span>
            </button>
          )}

          <div className="w-full sm:w-56 space-y-1.5">
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="bg-gradient-to-r from-rose-500 via-pink-500 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-glow-brand"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-right text-slate-400 font-mono font-bold">
              {progressPercent === 100 ? "Ready to launch! 🎉" : `${progressPercent}% completed`}
            </p>
          </div>
        </div>
      </div>

      {/* Milestone Phases Accordion/Cards */}
      <div className="space-y-4">
        {milestones.map((phase, phaseIndex) => {
          const phaseTotal = phase.tasks.length;
          const phaseCompleted = phase.tasks.filter((t) => t.isCompleted).length;
          const isAllDone = phaseTotal > 0 && phaseCompleted === phaseTotal;

          return (
            <div
              key={phase.phase}
              className="glass-card rounded-2xl border border-white/10 shadow-lg overflow-hidden transition-all"
            >
              <div className="p-5 bg-slate-900/80 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 text-white font-black text-xs flex items-center justify-center shadow-md">
                    {phaseIndex + 1}
                  </span>
                  <h4 className="font-display font-bold text-white text-base sm:text-lg">
                    {phase.phase}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      isAllDone
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-slate-800 text-slate-300 border-white/10"
                    }`}
                  >
                    {phaseCompleted}/{phaseTotal} Done
                  </span>
                </div>
              </div>

              {/* Task Checklist */}
              <div className="p-5 space-y-2.5">
                {phase.tasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => toggleTask(phaseIndex, task.id)}
                    className={`w-full text-left p-3.5 rounded-xl border flex items-center gap-3.5 transition-all active:scale-[0.99] ${
                      task.isCompleted
                        ? "bg-emerald-950/30 border-emerald-500/30 text-slate-400"
                        : "bg-slate-900/60 border-white/10 hover:border-rose-500/40 hover:bg-slate-850 text-slate-200"
                    }`}
                  >
                    {task.isCompleted ? (
                      <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-500 shrink-0 hover:text-rose-400" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        task.isCompleted ? "line-through text-slate-500 font-normal" : "text-slate-100"
                      }`}
                    >
                      {task.taskName}
                    </span>
                  </button>
                ))}

                {/* Inline Add Task */}
                {activePhaseIndex === phaseIndex ? (
                  <div className="pt-2 flex gap-2.5">
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
                      className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTask(phaseIndex)}
                      className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-xl shadow-glow-brand hover:from-rose-600 hover:to-pink-600 active:scale-95 transition-all"
                    >
                      Save Task
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActivePhaseIndex(null);
                        setNewTaskName("");
                      }}
                      className="px-3 py-2.5 text-xs font-bold text-slate-400 hover:text-white"
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
                    className="mt-2 text-xs font-bold text-rose-300 hover:text-white flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
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
