"use client";

import React from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { Card } from "@/components/ui/card";
import { State } from "@/src/entities/models/dashboard/state";
import { cn } from "@/lib/utils";

const COLORS = {
  totalIncome: "hsl(var(--chart-1))",
  fixedCharges: "hsl(var(--chart-2))",
  variableCharges: "hsl(var(--chart-3))",
  savings: "hsl(var(--chart-4))",
  debts: "hsl(var(--chart-5))",
  pleasure: "hsl(var(--primary))",
};

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
            style={{ backgroundColor: data.payload.fill }}
          />
          <p className="font-medium text-sm text-white">{data.payload.name}</p>
        </div>
        <p className="text-sm font-semibold text-slate-200">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
            maximumFractionDigits: 0,
          }).format(data.value)}
        </p>
      </Card>
    );
  }
  return null;
}

function StateChart({ state }: { state: State }) {
  const chartData = [
    {
      name: "Total Income",
      value: state.totalBudget,
      fill: COLORS.totalIncome,
    },
    {
      name: "Fixed Expenses",
      value: state.totalFixed,
      fill: COLORS.fixedCharges,
    },
    {
      name: "Variable Expenses",
      value: state.totalVariable,
      fill: COLORS.variableCharges,
    },
    {
      name: "Savings & Investments",
      value: state.savings,
      fill: COLORS.savings,
    },
    {
      name: "Debts",
      value: state.totalDebt,
      fill: COLORS.debts,
    },
    {
      name: "Discretionary",
      value: state.totalPleasure,
      fill: COLORS.pleasure,
    },
  ].filter((item) => item.value > 0);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: state.currency || "USD",
    maximumFractionDigits: 0,
  });

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Budget Breakdown</h2>
          <p className="text-sm text-slate-400">
            Detailed view of your financial distribution
          </p>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              barSize={40}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#94A3B8",
                  fontSize: 12,
                }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#94A3B8",
                  fontSize: 12,
                }}
                tickFormatter={(value) => formatter.format(value).split(".")[0]}
              />
              <Tooltip
                cursor={{
                  fill: "rgba(255, 255, 255, 0.05)",
                  radius: 4,
                }}
                content={<CustomTooltip currency={state.currency} />}
              />
              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
                className="transition-all duration-200"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    className="hover:opacity-80"
                  />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(value: number) =>
                    formatter.format(value).split(".")[0]
                  }
                  className="fill-slate-400 text-[12px] font-medium"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}

export default StateChart;
