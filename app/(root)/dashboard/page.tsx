"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getState } from "./_actions/actions";
import { GetFormatterForCurrency } from "@/lib/helpers";
import AlertComponent from "@/components/shared/AlertComponent";
import {
  CreditCard,
  BarChart,
  Loader2,
  DollarSign,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import ExpenseCard from "./_components/ExpenseCard";
import { FaGlassCheers, FaPiggyBank, FaRegCreditCard } from "react-icons/fa";
import StateChart from "./_components/StateChart";
import BudgetRuleTable from "./_components/BudgetRuleTable";
import { PieBalanceChart } from "./_components/PieStateChart";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import FinancialAdviceComponent from "./_components/FinancialAdviceComponent";
import { ScrollArea } from "@/components/ui/scroll-area";

function DashboardPage() {
  const {
    data: state,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["state"],
    queryFn: () => getState(),
  });

  const formatter = GetFormatterForCurrency(state?.currency ?? "USD");

  if (isError && error instanceof Error) {
    return (
      <div className="p-6">
        <AlertComponent message={error.message} />
      </div>
    );
  }

  const cardsConfig = [
    {
      title: "Total Budget",
      value: state?.totalBudget,
      color: "bg-indigo-600",
      icon: DollarSign,
      trend: {
        percentage: 12.5,
        isPositive: true,
      },
    },
    {
      title: "Remaining Budget",
      value: state?.remainsBudget,
      color: "bg-emerald-600",
      icon: BarChart,
      trend: {
        percentage: 8.2,
        isPositive: true,
      },
    },
    {
      title: "Fixed Expenses",
      value: state?.totalFixed,
      color: "bg-blue-600",
      icon: CreditCard,
      trend: {
        percentage: 3.1,
        isPositive: false,
      },
    },
    {
      title: "Variable Expenses",
      value: state?.totalVariable,
      color: "bg-purple-600",
      icon: BarChart,
      trend: {
        percentage: 5.4,
        isPositive: false,
      },
    },
    {
      title: "Total Debt",
      value: state?.totalDebt,
      color: "bg-rose-600",
      icon: FaRegCreditCard,
      trend: {
        percentage: 2.8,
        isPositive: false,
      },
    },
    {
      title: "Savings & Investments",
      value: state?.savings,
      color: "bg-amber-600",
      icon: FaPiggyBank,
      trend: {
        percentage: 15.3,
        isPositive: true,
      },
    },
    {
      title: "Discretionary",
      value: state?.totalPleasure,
      color: "bg-pink-600",
      icon: FaGlassCheers,
      trend: {
        percentage: 1.2,
        isPositive: true,
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className="text-slate-400 animate-pulse">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Financial Dashboard
            </h1>
            <p className="text-slate-400 mt-1">
              Track and manage your financial health
            </p>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg bg-blue-500/20 px-4 py-2.5 backdrop-blur-xl transition-all hover:bg-blue-500/30 shadow-lg group">
                <Lightbulb className="h-5 w-5 text-blue-400 transition-transform group-hover:scale-110" />
                <span className="font-medium text-sm text-white">
                  Financial Tips
                </span>
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:w-[600px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 border-slate-700/50 p-0"
            >
              <div className="flex flex-col h-full">
                <SheetHeader className="p-6 border-b border-slate-700/50">
                  <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-blue-400" />
                    Financial Insights
                  </SheetTitle>
                  <SheetDescription className="text-slate-400">
                    Personalized advice to improve your financial health
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="flex-1 p-6">
                  <FinancialAdviceComponent />
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cardsConfig.map((card, index) => (
            <ExpenseCard
              key={index}
              title={card.title}
              value={card.value ?? 0}
              color={card.color}
              icon={card.icon}
              currencyFormatter={formatter.format}
              trend={card.trend}
            />
          ))}
        </div>

        {/* Charts and Analysis */}
        {state && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <StateChart state={state} />

              {/* Quick Stats */}
              {/*<div className="p-6 bg-slate-900/50 border-slate-700/50 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-4">
                  Quick Insights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">
                        Savings Rate
                      </span>
                      <div className="flex items-center gap-1 text-emerald-400">
                        <ArrowUpRight className="h-4 w-4" />
                        <span className="text-sm font-medium">24.5%</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Above recommended 20%
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">
                        Debt-to-Income
                      </span>
                      <div className="flex items-center gap-1 text-rose-400">
                        <ArrowDownRight className="h-4 w-4" />
                        <span className="text-sm font-medium">32.8%</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Below 43% threshold
                    </p>
                  </div>
                </div>
              </div>*/}
            </div>

            <div className="space-y-6">
              <BudgetRuleTable budgetRules={state.budgetRules} />
              {/*<PieBalanceChart state={state} />*/}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
