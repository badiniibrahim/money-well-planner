"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import CreateIncomeDialog from "./_components/CreateIncomeDialog";
import { useQuery } from "@tanstack/react-query";
import { getAllIncome } from "./_actions/actions";
import AlertComponent from "@/components/shared/AlertComponent";
import UserIncome from "./_components/UserIncome";
import {
  PlusCircle,
  Loader2,
  Wallet,
  TrendingUp,
  BarChart3,
  PieChart,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BudgetRuleChart from "./_components/BudgetRuleChart";

interface IncomeData {
  currency: string;
  incomes: {
    id: number;
    name: string;
    date: Date;
    amount: number;
    updatedAt: Date;
    createdAt: Date;
    clerkId: string;
    type: string;
    categoryId: number | null;
    isRecurring: boolean;
    frequency: string | null;
  }[];
  budgetRules?: {
    id: number;
    needsPercentage: number;
    savingsPercentage: number;
    wantsPercentage: number;
    actualNeedsPercentage: number;
    actualSavingsPercentage: number;
    actualWantsPercentage: number;
    clerkId: string;
  };
}

function Page() {
  const {
    data: incomeData,
    isLoading,
    isError,
    error,
  } = useQuery<IncomeData, Error>({
    queryKey: ["getAllIncome"],
    queryFn: () => getAllIncome(),
  });

  if (isError && error instanceof Error) {
    return (
      <div className="p-6">
        <AlertComponent message={error.message} />
      </div>
    );
  }

  const totalIncome =
    incomeData?.incomes.reduce((sum, income) => sum + income.amount, 0) || 0;
  const averageIncome = incomeData?.incomes.length
    ? totalIncome / incomeData.incomes.length
    : 0;

  const recurringIncome =
    incomeData?.incomes
      .filter((income) => income.isRecurring)
      .reduce((sum, income) => sum + income.amount, 0) || 0;

  const recurringPercentage =
    totalIncome > 0 ? (recurringIncome / totalIncome) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Income Management
            </h1>
            <p className="text-slate-400">
              Track and manage your income sources efficiently
            </p>
          </div>
          <CreateIncomeDialog
            trigger={
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-emerald-500/20 transform hover:scale-105 transition-all duration-300">
                <PlusCircle className="mr-2 h-5 w-5" />
                Add New Income
              </Button>
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Total Income
              </CardTitle>
              <Wallet className="h-5 w-5 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {incomeData?.currency}{" "}
                {totalIncome.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +20.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Average Income
              </CardTitle>
              <BarChart3 className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {incomeData?.currency}{" "}
                {averageIncome.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-slate-400 mt-1">Per income source</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Recurring Income
              </CardTitle>
              <RefreshCw className="h-5 w-5 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {incomeData?.currency}{" "}
                {recurringIncome.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {recurringPercentage.toFixed(1)}% of total income
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Active Sources
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-purple-400/10 flex items-center justify-center">
                <span className="text-lg font-bold text-purple-400">
                  {incomeData?.incomes.length || 0}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                Income Streams
              </div>
              <p className="text-xs text-slate-400 mt-1">Currently tracking</p>
            </CardContent>
          </Card>
        </div>

        {incomeData?.budgetRules && totalIncome > 0 && (
          <div className="mb-8">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl font-bold text-white">
                    Budget Rule Analysis
                  </CardTitle>
                  <p className="text-sm text-slate-400 mt-1">
                    Your 50-30-20 budget rule breakdown based on current income
                  </p>
                </div>
                <PieChart className="h-6 w-6 text-indigo-400" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <BudgetRuleChart
                    budgetRules={incomeData.budgetRules}
                    totalIncome={totalIncome}
                    currency={incomeData.currency}
                  />
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Recommended Allocation
                      </h3>
                      <p className="text-sm text-slate-400 mb-4">
                        Based on the 50-30-20 rule, here's how you should
                        allocate your income:
                      </p>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-slate-300">Needs (50%)</span>
                          </div>
                          <span className="text-white font-medium">
                            {incomeData.currency}{" "}
                            {(totalIncome * 0.5).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            <span className="text-slate-300">
                              Savings (30%)
                            </span>
                          </div>
                          <span className="text-white font-medium">
                            {incomeData.currency}{" "}
                            {(totalIncome * 0.3).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            <span className="text-slate-300">Wants (20%)</span>
                          </div>
                          <span className="text-white font-medium">
                            {incomeData.currency}{" "}
                            {(totalIncome * 0.2).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Budget Rule Tips
                      </h3>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-start gap-2">
                          <div className="min-w-4 mt-1">•</div>
                          <p>
                            <span className="text-blue-400 font-medium">
                              Needs (50%):
                            </span>{" "}
                            Essential expenses like rent, utilities, groceries,
                            and transportation
                          </p>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="min-w-4 mt-1">•</div>
                          <p>
                            <span className="text-emerald-400 font-medium">
                              Savings (30%):
                            </span>{" "}
                            Debt repayment, emergency fund, retirement, and
                            investments
                          </p>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="min-w-4 mt-1">•</div>
                          <p>
                            <span className="text-amber-400 font-medium">
                              Wants (20%):
                            </span>{" "}
                            Non-essential purchases like dining out,
                            entertainment, and hobbies
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
              <p className="text-slate-400">Loading income data...</p>
            </div>
          </div>
        ) : incomeData ? (
          <UserIncome
            incomes={incomeData.incomes}
            currency={incomeData.currency}
          />
        ) : null}
      </div>
    </div>
  );
}

export default Page;
