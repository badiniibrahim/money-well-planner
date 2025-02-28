"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

type BudgetRuleProps = {
  budgetRules: {
    needsPercentage: number;
    savingsPercentage: number;
    wantsPercentage: number;
    actualNeedsPercentage: number;
    actualSavingsPercentage: number;
    actualWantsPercentage: number;
  };
  totalIncome: number;
  currency: string;
};

const BudgetRuleChart = ({
  budgetRules,
  totalIncome,
  currency,
}: BudgetRuleProps) => {
  const targetData = [
    { name: "Needs", value: budgetRules.needsPercentage, color: "#3b82f6" },
    { name: "Savings", value: budgetRules.savingsPercentage, color: "#10b981" },
    { name: "Wants", value: budgetRules.wantsPercentage, color: "#f59e0b" },
  ];

  const actualData = [
    {
      name: "Needs",
      value: budgetRules.actualNeedsPercentage,
      color: "#3b82f6",
      amount: (totalIncome * budgetRules.actualNeedsPercentage) / 100,
    },
    {
      name: "Savings",
      value: budgetRules.actualSavingsPercentage,
      color: "#10b981",
      amount: (totalIncome * budgetRules.actualSavingsPercentage) / 100,
    },
    {
      name: "Wants",
      value: budgetRules.actualWantsPercentage,
      color: "#f59e0b",
      amount: (totalIncome * budgetRules.actualWantsPercentage) / 100,
    },
  ];

  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="bg-slate-800 border-slate-700 p-2 shadow-lg">
          <CardContent className="p-2">
            <p className="text-sm font-medium text-white">{`${
              payload[0].name
            }: ${payload[0].value.toFixed(1)}%`}</p>
            {payload[0].payload.amount !== undefined && (
              <p className="text-xs text-slate-300">
                {formatter.format(payload[0].payload.amount)}
              </p>
            )}
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-slate-300">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={targetData}
            cx="50%"
            cy="50%"
            outerRadius={60}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {targetData.map((entry, index) => (
              <Cell
                key={`cell-target-${index}`}
                fill={entry.color}
                opacity={0.3}
              />
            ))}
          </Pie>
          <Pie
            data={actualData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {actualData.map((entry, index) => (
              <Cell key={`cell-actual-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetRuleChart;
