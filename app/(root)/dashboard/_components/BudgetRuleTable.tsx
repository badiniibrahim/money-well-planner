import React from "react";
import { Progress } from "@/components/ui/progress";
import { ArrowUpCircle, ArrowDownCircle, Minus } from "lucide-react";
import { BudgetRule } from "@prisma/client";

function BudgetRuleTable({ budgetRules }: { budgetRules: BudgetRule }) {
  const categories = [
    {
      name: "Dépenses Fixes & Variables",
      rule: budgetRules.needsPercentage,
      actual: budgetRules?.actualNeedsPercentage ?? 0,
      color: "bg-blue-500",
    },
    {
      name: "Épargne, Invest & Dettes",
      rule: budgetRules.savingsPercentage,
      actual: budgetRules?.actualSavingsPercentage ?? 0,
      color: "bg-green-500",
    },
    {
      name: "Plaisirs & Fonds Réserve",
      rule: budgetRules.wantsPercentage,
      actual: budgetRules?.actualWantsPercentage ?? 0,
      color: "bg-purple-500",
    },
  ];

  const getStatusIcon = (rule: number, actual: number) => {
    if (actual > rule)
      return <ArrowUpCircle className="h-4 w-4 text-red-500" />;
    if (actual < rule)
      return <ArrowDownCircle className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Répartition Budgétaire
      </h2>
      {categories.map((category, index) => (
        <div
          key={index}
          className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {category.name}
            </p>
            <div className="flex items-center space-x-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {category.actual.toFixed(1)}% /{" "}
                <span className="text-gray-600 dark:text-gray-300">
                  {category.rule.toFixed(1)}%
                </span>
              </p>
              {getStatusIcon(category.rule, category.actual)}
            </div>
          </div>
          <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${category.color} rounded-full`}
              style={{
                width: `${Math.min(
                  (category.actual / category.rule) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default BudgetRuleTable;
