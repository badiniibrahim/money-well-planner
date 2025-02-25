"use client";

import React from "react";
import { ArrowUpCircle, ArrowDownCircle, Minus } from "lucide-react";
import { BudgetRule } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function BudgetRuleTable({ budgetRules }: { budgetRules: BudgetRule }) {
  const categories = [
    {
      name: "Fixed & Variable Expenses",
      rule: budgetRules.needsPercentage,
      actual: budgetRules?.actualNeedsPercentage ?? 0,
      color: "bg-blue-500",
      description: "Essential monthly expenses and variable costs",
    },
    {
      name: "Savings, Investments & Debts",
      rule: budgetRules.savingsPercentage,
      actual: budgetRules?.actualSavingsPercentage ?? 0,
      color: "bg-emerald-500",
      description: "Long-term savings and debt management",
    },
    {
      name: "Discretionary & Emergency Fund",
      rule: budgetRules.wantsPercentage,
      actual: budgetRules?.actualWantsPercentage ?? 0,
      color: "bg-purple-500",
      description: "Personal enjoyment and emergency reserves",
    },
  ];

  const getStatusIcon = (rule: number, actual: number) => {
    if (actual > rule) {
      return {
        icon: <ArrowUpCircle className="h-4 w-4 text-rose-400" />,
        text: "Over budget",
        color: "text-rose-400",
      };
    }
    if (actual < rule) {
      return {
        icon: <ArrowDownCircle className="h-4 w-4 text-emerald-400" />,
        text: "Under budget",
        color: "text-emerald-400",
      };
    }
    return {
      icon: <Minus className="h-4 w-4 text-slate-400" />,
      text: "On target",
      color: "text-slate-400",
    };
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700/50">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">
            Budget Allocation
          </h2>
          <p className="text-sm text-slate-400">
            Track your spending distribution across different categories
          </p>
        </div>

        <div className="space-y-4">
          {categories.map((category, index) => {
            const status = getStatusIcon(category.rule, category.actual);

            return (
              <div
                key={index}
                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-all duration-200"
              >
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-white mb-1">
                        {category.name}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {category.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-white">
                            {category.actual.toFixed(1)}%
                          </span>
                          <span className="text-xs text-slate-400">/</span>
                          <span className="text-xs text-slate-400">
                            {category.rule.toFixed(1)}%
                          </span>
                        </div>
                        <span className={cn("text-xs mt-0.5", status.color)}>
                          {status.text}
                        </span>
                      </div>
                      {status.icon}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${category.color} rounded-full transition-all duration-300 ease-in-out`}
                        style={{
                          width: `${Math.min(
                            (category.actual / category.rule) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <div
                      className="absolute top-0 h-2 border-l-2 border-white/20"
                      style={{ left: `${category.rule}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export default BudgetRuleTable;
