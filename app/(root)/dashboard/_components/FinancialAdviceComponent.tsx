"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  PiggyBank,
  Target,
  AlertCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  DollarSign,
} from "lucide-react";

function FinancialAdviceComponent() {
  const financialSummary = {
    strengths: [
      {
        title: "Existing Savings",
        amount: "150€",
        description: "Shows good financial discipline",
        icon: PiggyBank,
      },
      {
        title: "Investment Activity",
        amount: "90€",
        description: "Demonstrates long-term vision",
        icon: TrendingUp,
      },
    ],
    improvements: [
      {
        title: "Monthly Expenses",
        amount: "640€",
        description: "High relative to income",
        icon: DollarSign,
      },
      {
        title: "Current Debt",
        amount: "200€",
        description: "Manageable but needs attention",
        icon: AlertCircle,
      },
    ],
  };

  const actionSteps = [
    {
      title: "Track Monthly Income",
      description: "Document all income sources for accurate budgeting",
      priority: "Immediate",
    },
    {
      title: "Create Detailed Budget",
      description: "Categorize expenses and identify areas for reduction",
      priority: "High",
    },
    {
      title: "Accelerate Debt Repayment",
      description: "Aim to clear €200 debt as quickly as possible",
      priority: "High",
    },
    {
      title: "Optimize Expenses",
      description: "Review and reduce unnecessary spending",
      priority: "Medium",
    },
    {
      title: "Increase Savings",
      description: "Set aside a fixed percentage of monthly income",
      priority: "Medium",
    },
    {
      title: "Continue Investing",
      description: "Maintain investment strategy after debt clearance",
      priority: "Low",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Financial Health Overview */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <div className="p-6">
          <h2 className="text-lg font-bold text-white mb-4">
            Financial Health Analysis
          </h2>

          {/* Strengths */}
          <div className="space-y-4 mb-6">
            <h3 className="flex items-center gap-2 text-sm font-medium text-emerald-400">
              <ArrowUpCircle className="h-4 w-4" />
              Positive Indicators
            </h3>
            <div className="grid gap-3">
              {financialSummary.strengths.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg bg-emerald-500/10 p-3"
                >
                  <div className="rounded-full bg-emerald-500/20 p-2">
                    <item.icon className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-emerald-400">
                        {item.title}
                      </h4>
                      <span className="text-sm text-emerald-400/80">
                        {item.amount}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Areas for Improvement */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-medium text-rose-400">
              <ArrowDownCircle className="h-4 w-4" />
              Areas for Improvement
            </h3>
            <div className="grid gap-3">
              {financialSummary.improvements.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg bg-rose-500/10 p-3"
                >
                  <div className="rounded-full bg-rose-500/20 p-2">
                    <item.icon className="h-4 w-4 text-rose-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-rose-400">
                        {item.title}
                      </h4>
                      <span className="text-sm text-rose-400/80">
                        {item.amount}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Action Plan */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Action Plan</h2>
          </div>

          <div className="space-y-4">
            {actionSteps.map((step, index) => (
              <div
                key={index}
                className={cn(
                  "rounded-lg border p-4 transition-colors",
                  "bg-slate-900/50 border-slate-700/50",
                  "hover:bg-slate-700/50"
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-white mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-400">{step.description}</p>
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium px-2.5 py-0.5 rounded-full",
                      step.priority === "Immediate" &&
                        "bg-rose-500/20 text-rose-400",
                      step.priority === "High" &&
                        "bg-amber-500/20 text-amber-400",
                      step.priority === "Medium" &&
                        "bg-blue-500/20 text-blue-400",
                      step.priority === "Low" &&
                        "bg-emerald-500/20 text-emerald-400"
                    )}
                  >
                    {step.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default FinancialAdviceComponent;
