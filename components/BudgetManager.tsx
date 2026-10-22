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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-900 text-white gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-400/40 flex items-center justify-center text-brand-300">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2">
              Client-Side Recalculation Engine
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                Zero Token Leakage
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Tweak budget sliders or costs below. All calculations update instantly in local browser memory without re-calling the LLM.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={autoBalance}
          className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white transition-all shadow-sm"
          title="Scale all categories proportionally so they sum to exactly 100%"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          Auto-Balance to 100%
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Budget */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            Total Event Budget
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <input
              type="number"
              value={totalBudget}
              onChange={(e) => updateTotalBudget(Number(e.target.value))}
              className="text-xl sm:text-2xl font-black text-slate-900 w-full focus:outline-none focus:ring-1 focus:ring-brand-500 rounded bg-transparent"
              title="Click to edit total event budget"
            />
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Editable baseline</span>
        </div>

        {/* Total Allocated */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <PieChart className="w-3.5 h-3.5 text-slate-400" />
            Total Allocated
          </span>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {formatCurrency(metrics.totalAllocated)}
          </p>
          <span className="text-[10px] text-slate-400">Sum of all categories</span>
        </div>

        {/* Remaining / Over Budget */}
        <div
          className={`p-4 rounded-2xl border shadow-sm ${
            metrics.isOverBudget
              ? "bg-red-50/70 border-red-200 text-red-900"
              : "bg-emerald-50/70 border-emerald-200 text-emerald-900"
          }`}
        >
          <span className="text-xs font-semibold flex items-center gap-1">
            {metrics.isOverBudget ? (
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            )}
            {metrics.isOverBudget ? "Over Budget" : "Remaining Reserve"}
          </span>
          <p className="text-xl sm:text-2xl font-black mt-1">
            {formatCurrency(Math.abs(metrics.remainingBudget))}
          </p>
          <span className="text-[10px] opacity-80">
            {metrics.isOverBudget ? "Exceeds total target" : "Available cushion"}
          </span>
        </div>

        {/* Percentage Sum */}
        <div
          className={`p-4 rounded-2xl border shadow-sm ${
            metrics.isBalanced
              ? "bg-white border-slate-200"
              : "bg-amber-50/70 border-amber-200 text-amber-900"
          }`}
        >
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            Sum of Percentages
          </span>
          <p
            className={`text-xl sm:text-2xl font-black mt-1 ${
              metrics.isBalanced ? "text-slate-900" : "text-amber-700"
            }`}
          >
            {metrics.totalPercentage}%
          </p>
          <span className="text-[10px]">
            {metrics.isBalanced ? (
              <span className="text-emerald-600 font-semibold">100% Balanced</span>
            ) : (
              <span className="text-amber-700 font-semibold">
                {metrics.totalPercentage < 100
                  ? `${(100 - metrics.totalPercentage).toFixed(1)}% Unallocated`
                  : `${(metrics.totalPercentage - 100).toFixed(1)}% Over-allocated`}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Visual Proportional Breakdown Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
          <span>Allocation Spectrum</span>
          <span>{items.length} Categories</span>
        </div>
        <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-100">
          {items.map((item, idx) => {
            const widthPct = Math.max(0, item.percentage);
            const color = CATEGORY_PALETTE[idx % CATEGORY_PALETTE.length];
            return (
              <div
                key={item.id}
                style={{ width: `${widthPct}%`, backgroundColor: color }}
                className="h-full transition-all duration-200 first:rounded-l-full last:rounded-r-full group relative"
                title={`${item.category}: ${item.percentage}% (${formatCurrency(item.estimatedCost)})`}
              />
            );
          })}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600">
          {items.map((item, idx) => (
            <div key={item.id} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: CATEGORY_PALETTE[idx % CATEGORY_PALETTE.length] }}
              />
              <span className="font-medium text-slate-700">{item.category}</span>
              <span className="text-slate-400 font-mono text-[11px]">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Category Sliders List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">Itemized Category Budgets</h3>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1 bg-brand-50 px-3 py-1.5 rounded-xl border border-brand-200 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            {showAddForm ? "Cancel" : "Add Category"}
          </button>
        </div>

        {/* Add Category Drawer */}
        {showAddForm && (
          <form
            onSubmit={handleAddCategorySubmit}
            className="p-4 rounded-2xl bg-brand-50/50 border border-brand-200 flex flex-wrap gap-3 items-end"
          >
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Category Name
              </label>
              <input
                type="text"
                placeholder="e.g. Wedding Favors or Late Night Snacks"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="w-28">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Initial %
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={newCatPct}
                onChange={(e) => setNewCatPct(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="w-32">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Priority
              </label>
              <select
                value={newCatPriority}
                onChange={(e) => setNewCatPriority(e.target.value as "Critical" | "Flexible" | "Optional")}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
              >
                <option value="Critical">Critical</option>
                <option value="Flexible">Flexible</option>
                <option value="Optional">Optional</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
            >
              Add Item
            </button>
          </form>
        )}

        {/* Category Cards */}
        <div className="grid grid-cols-1 gap-3">
          {items.map((item, idx) => {
            const color = CATEGORY_PALETTE[idx % CATEGORY_PALETTE.length];
            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-bold text-slate-900 text-sm sm:text-base">
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
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        PRIORITY_COLORS[item.priority]
                      } bg-transparent cursor-pointer`}
                    >
                      <option value="Critical">Critical</option>
                      <option value="Flexible">Flexible</option>
                      <option value="Optional">Optional</option>
                    </select>
                  </div>

                  {/* Direct Cost Input */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400 text-xs font-bold">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={item.estimatedCost}
                        onChange={(e) => updateItemCost(item.id, Number(e.target.value))}
                        className="w-28 pl-6 pr-2 py-1.5 text-xs font-black text-right text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        title="Directly edit dollar amount"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCategory(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                      title="Remove Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Slider and Percentage */}
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.5"
                    value={item.percentage}
                    onChange={(e) => updateItemPercentage(item.id, Number(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                    aria-label={`${item.category} budget percentage`}
                  />
                  <div className="w-16 text-right">
                    <span className="text-xs font-mono font-bold text-slate-800">
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
