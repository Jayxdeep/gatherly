"use client";

import React, { useState } from "react";
import { useBudgetCalculator } from "@/lib/engine/useBudgetCalculator";
import { BudgetItem } from "@/lib/schemas/event";
import { formatCurrency } from "@/lib/utils";
import {
  DollarSign,
  Sliders,
  Sparkles,
  PlusCircle,
  Trash2,
  AlertCircle,
  CheckCircle2,
  PieChart,
  ShieldAlert,
  ArrowRightLeft,
} from "lucide-react";

interface BudgetManagerProps {
  initialItems: BudgetItem[];
  initialBudget: number;
}

const PRIORITY_COLORS = {
  Critical: "bg-red-50 text-red-700 border-red-200",
  Flexible: "bg-amber-50 text-amber-700 border-amber-200",
  Optional: "bg-blue-50 text-blue-700 border-blue-200",
};

const CATEGORY_PALETTE = [
  "#d9597e",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#6366f1",
];

export function BudgetManager({ initialItems, initialBudget }: BudgetManagerProps) {
  const {
    items,
    totalBudget,
    metrics,
    updateTotalBudget,
    updateItemPercentage,
    updateItemCost,
    updateItemPriority,
    addCategory,
    removeCategory,
    autoBalance,
  } = useBudgetCalculator(initialItems, initialBudget);

  const [newCatName, setNewCatName] = useState("");
  const [newCatPct, setNewCatPct] = useState(5);
  const [newCatPriority, setNewCatPriority] = useState<"Critical" | "Flexible" | "Optional">("Flexible");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim(), Number(newCatPct), newCatPriority);
    setNewCatName("");
    setNewCatPct(5);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Engine Status Callout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-rose-950/40 border border-white/10 text-white gap-4 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300 shadow-glow-brand">
            <Sliders className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2">
              Client-Side Recalculation Engine
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                Zero Token Leakage
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tweak budget sliders or costs below. All calculations update instantly in local browser memory without re-calling the LLM.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={autoBalance}
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-xs font-bold text-white transition-all shadow-glow-brand active:scale-95"
          title="Scale all categories proportionally so they sum to exactly 100%"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          Auto-Balance to 100%
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Budget */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 shadow-lg text-white">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
            <DollarSign className="w-3.5 h-3.5 text-rose-400" />
            Total Budget
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <input
              type="number"
              value={totalBudget}
              onChange={(e) => updateTotalBudget(Number(e.target.value))}
              className="text-2xl sm:text-3xl font-black text-white w-full focus:outline-none focus:ring-2 focus:ring-rose-500 rounded-lg bg-transparent tracking-tight"
              title="Click to edit total event budget"
            />
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Editable baseline</span>
        </div>

        {/* Total Allocated */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 shadow-lg text-white">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
            <PieChart className="w-3.5 h-3.5 text-amber-400" />
            Allocated Sum
          </span>
          <p className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
            {formatCurrency(metrics.totalAllocated)}
          </p>
          <span className="text-[10px] text-slate-400 block mt-1">Sum of all categories</span>
        </div>

        {/* Remaining / Over Budget */}
        <div
          className={`p-5 rounded-2xl border shadow-lg ${
            metrics.isOverBudget
              ? "bg-red-950/60 border-red-500/40 text-red-200"
              : "bg-emerald-950/50 border-emerald-500/40 text-emerald-200"
          }`}
        >
          <span className="text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider">
            {metrics.isOverBudget ? (
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
            {metrics.isOverBudget ? "Over Budget" : "Reserve Cushion"}
          </span>
          <p className="text-2xl sm:text-3xl font-black mt-2 tracking-tight text-white">
            {formatCurrency(Math.abs(metrics.remainingBudget))}
          </p>
          <span className="text-[10px] opacity-80 block mt-1">
            {metrics.isOverBudget ? "Exceeds total target" : "Available cushion"}
          </span>
        </div>

        {/* Percentage Sum */}
        <div
          className={`p-5 rounded-2xl border shadow-lg ${
            metrics.isBalanced
              ? "glass-card text-white"
              : "bg-amber-950/50 border-amber-500/40 text-amber-200"
          }`}
        >
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            Percentage Sum
          </span>
          <p
            className={`text-2xl sm:text-3xl font-black mt-2 tracking-tight ${
              metrics.isBalanced ? "text-emerald-400" : "text-amber-400"
            }`}
          >
            {metrics.totalPercentage}%
          </p>
          <span className="text-[10px] block mt-1 font-semibold">
            {metrics.isBalanced ? (
              <span className="text-emerald-400">100% Balanced</span>
            ) : (
              <span className="text-amber-300">
                {metrics.totalPercentage < 100
                  ? `${(100 - metrics.totalPercentage).toFixed(1)}% Unallocated`
                  : `${(metrics.totalPercentage - 100).toFixed(1)}% Over-allocated`}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Visual Proportional Breakdown Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span className="uppercase tracking-wider">Proportional Allocation Spectrum</span>
          <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white font-mono">
            {items.length} Categories
          </span>
        </div>
        <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-950/80 p-0.5 border border-white/10">
          {items.map((item, idx) => {
            const widthPct = Math.max(0, item.percentage);
            const color = CATEGORY_PALETTE[idx % CATEGORY_PALETTE.length];
            return (
              <div
                key={item.id}
                style={{ width: `${widthPct}%`, backgroundColor: color }}
                className="h-full transition-all duration-300 first:rounded-l-full last:rounded-r-full group relative"
                title={`${item.category}: ${item.percentage}% (${formatCurrency(item.estimatedCost)})`}
              />
            );
          })}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-300">
          {items.map((item, idx) => (
            <div key={item.id} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                style={{ backgroundColor: CATEGORY_PALETTE[idx % CATEGORY_PALETTE.length] }}
              />
              <span className="font-semibold text-slate-200">{item.category}</span>
              <span className="text-slate-400 font-mono text-[11px]">
                {item.percentage}% • {formatCurrency(item.estimatedCost)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Category Sliders List */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-display font-black text-white">Itemized Category Budgets</h3>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-xs font-bold text-rose-300 hover:text-white flex items-center gap-1.5 bg-rose-500/20 hover:bg-rose-500/30 px-3.5 py-2 rounded-xl border border-rose-500/40 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            {showAddForm ? "Cancel" : "Add Custom Category"}
          </button>
        </div>

        {/* Add Category Drawer */}
        {showAddForm && (
          <form
            onSubmit={handleAddCategorySubmit}
            className="p-5 rounded-2xl bg-slate-900/90 border border-rose-500/40 flex flex-wrap gap-3.5 items-end shadow-glow-brand"
          >
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Category Name
              </label>
              <input
                type="text"
                placeholder="e.g. Late Night Tacos, Photobooth, Favors"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="w-28">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Initial %
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={newCatPct}
                onChange={(e) => setNewCatPct(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="w-32">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Priority
              </label>
              <select
                value={newCatPriority}
                onChange={(e) => setNewCatPriority(e.target.value as "Critical" | "Flexible" | "Optional")}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-950 text-white"
              >
                <option value="Critical">Critical</option>
                <option value="Flexible">Flexible</option>
                <option value="Optional">Optional</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold rounded-xl shadow-glow-brand transition-all active:scale-95"
            >
              Add Item
            </button>
          </form>
        )}

        {/* Category Cards */}
        <div className="grid grid-cols-1 gap-3.5">
          {items.map((item, idx) => {
            const color = CATEGORY_PALETTE[idx % CATEGORY_PALETTE.length];
            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl glass-card glass-card-hover border border-white/10 shadow-lg space-y-3.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-4 h-4 rounded-full shrink-0 shadow-md"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-bold text-white text-sm sm:text-base">
                      {item.category}
                    </span>
                    <select
                      value={item.priority}
                      onChange={(e) =>
                        updateItemPriority(
                          item.id,
                          e.target.value as "Critical" | "Flexible" | "Optional"
                        )
                      }
                      className="text-[11px] font-bold px-3 py-1 rounded-full border border-white/10 bg-slate-900 text-slate-200 cursor-pointer"
                    >
                      <option value="Critical">Critical</option>
                      <option value="Flexible">Flexible</option>
                      <option value="Optional">Optional</option>
                    </select>
                  </div>

                  {/* Direct Cost Input */}
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs font-bold">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={item.estimatedCost}
                        onChange={(e) => updateItemCost(item.id, Number(e.target.value))}
                        className="w-32 pl-7 pr-3 py-2 text-xs font-black text-right text-white rounded-xl border border-white/10 bg-slate-950/80 focus:outline-none focus:ring-2 focus:ring-rose-500"
                        title="Directly edit dollar amount"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCategory(item.id)}
                      className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-colors"
                      title="Remove Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Slider and Percentage */}
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.5"
                    value={item.percentage}
                    onChange={(e) => updateItemPercentage(item.id, Number(e.target.value))}
                    className="flex-1 cursor-pointer"
                    aria-label={`${item.category} budget percentage`}
                  />
                  <div className="w-20 text-right">
                    <span className="text-xs font-mono font-black text-rose-300 bg-rose-500/15 border border-rose-500/30 px-2.5 py-1 rounded-lg">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
