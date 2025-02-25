"use client";

import React from "react";
import CountUp from "react-countup";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ExpenseCardProps = {
  title: string;
  value: number;
  color: string;
  icon: React.ElementType;
  currencyFormatter: (value: number) => string;
  trend?: {
    percentage: number;
    isPositive: boolean;
  };
};

function ExpenseCard({
  title,
  value,
  color,
  icon: Icon,
  currencyFormatter,
  trend,
}: ExpenseCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-slate-700/50",
        "bg-gradient-to-b from-slate-900/50 via-slate-900/50 to-slate-800/50",
        "hover:bg-slate-800/50 transition-all duration-300"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-900/10" />
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl transform group-hover:scale-110 transition-transform duration-500" />

      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg",
              "bg-gradient-to-br shadow-lg backdrop-blur-xl transition-transform group-hover:scale-110",
              color
            )}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-300 mb-1">{title}</p>
            <div className="flex flex-col items-end gap-1">
              <CountUp
                preserveValue
                redraw={false}
                end={value || 0}
                decimals={2}
                formattingFn={currencyFormatter}
                className="text-2xl font-bold text-white"
              />
              {trend && (
                <div
                  className={cn(
                    "flex items-center text-xs font-medium",
                    trend.isPositive ? "text-emerald-400" : "text-rose-400"
                  )}
                >
                  <span>
                    {trend.isPositive ? "+" : "-"}
                    {Math.abs(trend.percentage).toFixed(1)}%
                  </span>
                  <span className="text-slate-400 ml-1">vs last month</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ExpenseCard;
