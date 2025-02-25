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
import { cn } from "@/lib/utils";

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any[];
}) {
  if (active && payload && payload.length > 0) {
    const data = payload[0];
    return (
      <div className="bg-card border shadow-lg rounded-lg p-3 animate-in fade-in-0 zoom-in-95">
        <p className="font-semibold text-sm text-card-foreground mb-1">
          {data.name}
        </p>
        <p className="text-sm text-muted-foreground">
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
          }).format(data.value)}
        </p>
      </div>
    );
  }
  return null;
}

function CustomLegend({ payload }: { payload?: any[] }) {
  if (!payload) return null;

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4 text-xs">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center space-x-1.5">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.value}</span>
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
    { name: "Budget", value: state.totalBudget, color: "hsl(var(--chart-1))" },
    {
      name: "Charges Fixes",
      value: state.totalFixed,
      color: "hsl(var(--chart-2))",
    },
    {
      name: "Charges Variables",
      value: state.totalVariable,
      color: "hsl(var(--chart-3))",
    },
    {
      name: "Épargne & Invest",
      value: state.savings,
      color: "hsl(var(--chart-4))",
    },
    { name: "Dettes", value: state.totalDebt, color: "hsl(var(--chart-5))" },
    {
      name: "Loisirs",
      value: state.totalPleasure,
      color: "hsl(var(--primary))",
    },
  ].filter((item) => item.value > 0);

  const totalAmount = chartData.reduce((sum, item) => sum + item.value, 0);
  const formattedTotal = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(totalAmount);

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="text-center space-y-1">
        <h2 className="text-sm font-semibold text-primary">
          Répartition du Budget
        </h2>
        <p className="text-xs text-muted-foreground">
          Vue d'ensemble de vos finances
        </p>
      </div>

      <div className="relative aspect-square max-w-[280px] mx-auto">
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
              strokeWidth={1}
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
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Legend content={<CustomLegend />} verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center space-y-0.5">
            <p className="text-xs text-muted-foreground">Budget Total</p>
            <p className="text-base font-semibold text-primary">
              {formattedTotal}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
