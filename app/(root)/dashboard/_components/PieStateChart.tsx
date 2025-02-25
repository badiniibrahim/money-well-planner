"use client";

import React from "react";
import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { State } from "@/src/entities/models/dashboard/state";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function CustomTooltip({
  active,
  payload,
  currency = "USD",
}: {
  active?: boolean;
  payload?: any[];
  currency?: string;
}) {
  if (active && payload && payload.length > 0) {
    const data = payload[0];
    const percentage = ((data.value / data.payload.total) * 100).toFixed(1);

    return (
      <Card
        className={cn(
          "bg-slate-800/90 border-slate-700/50 shadow-xl backdrop-blur-sm",
          "p-3 animate-in fade-in-0 zoom-in-95"
        )}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: data.payload.color }}
          />
          <p className="font-medium text-sm text-white">{data.name}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-slate-200">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: currency,
              maximumFractionDigits: 0,
            }).format(data.value)}
          </p>
          <p className="text-xs text-slate-400">{percentage}% of total</p>
        </div>
      </Card>
    );
  }
  return null;
}

function CustomLegend({ payload }: { payload?: any[] }) {
  if (!payload) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-6">
      {payload.map((entry, index) => (
        <div
          key={`legend-${index}`}
          className={cn(
            "flex items-center gap-2 p-2 rounded-lg transition-colors",
            "hover:bg-slate-800/50 cursor-pointer group"
          )}
        >
          <div
            className={cn(
              "w-3 h-3 rounded-full transition-transform",
              "group-hover:scale-110"
            )}
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-slate-300 group-hover:text-white">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function PieBalanceChart({
  state,
  className,
}: {
  state: State;
  className?: string;
}) {
  const chartData = [
    {
      name: "Total Budget",
      value: state.totalBudget,
      color: "hsl(var(--chart-1))",
      total: state.totalBudget,
    },
    {
      name: "Fixed Expenses",
      value: state.totalFixed,
      color: "hsl(var(--chart-2))",
      total: state.totalBudget,
    },
    {
      name: "Variable Expenses",
      value: state.totalVariable,
      color: "hsl(var(--chart-3))",
      total: state.totalBudget,
    },
    {
      name: "Savings & Investments",
      value: state.savings,
      color: "hsl(var(--chart-4))",
      total: state.totalBudget,
    },
    {
      name: "Debts",
      value: state.totalDebt,
      color: "hsl(var(--chart-5))",
      total: state.totalBudget,
    },
    {
      name: "Discretionary",
      value: state.totalPleasure,
      color: "hsl(var(--primary))",
      total: state.totalBudget,
    },
  ].filter((item) => item.value > 0);

  const totalAmount = chartData.reduce((sum, item) => sum + item.value, 0);
  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: state.currency || "USD",
    maximumFractionDigits: 0,
  }).format(totalAmount);

  return (
    <Card
      className={cn(
        "bg-slate-900/50 border-slate-700/50",
        "backdrop-blur-sm",
        className
      )}
    >
      <div className="p-6 space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-lg font-bold text-white">Budget Distribution</h2>
          <p className="text-sm text-slate-400">
            Overview of your financial allocation
          </p>
          <div className="pt-2">
            <span className="text-2xl font-bold text-white">
              {formattedTotal}
            </span>
            <p className="text-xs text-slate-400 mt-1">Total managed amount</p>
          </div>
        </div>

        <div className="relative aspect-square max-w-[300px] mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="85%"
                paddingAngle={2}
                strokeWidth={2}
                stroke="hsl(var(--background))"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="transition-all duration-200 hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip
                content={<CustomTooltip currency={state.currency} />}
                cursor={false}
              />
              <Legend
                content={<CustomLegend />}
                verticalAlign="bottom"
                height={80}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
