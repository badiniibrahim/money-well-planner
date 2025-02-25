"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAllCharge } from "./_actions/actions";
import AlertComponent from "@/components/shared/AlertComponent";
import { Button } from "@/components/ui/button";
import UserExpenses from "./_components/UserExpenses";
import {
  PlusCircle,
  Loader2,
  Receipt,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import CreateExpensesDialog from "./_components/CreateExpensesDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function ExpensesPage() {
  const {
    data: expenseData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getAllCharge"],
    queryFn: () => getAllCharge(),
  });

  if (isError && error instanceof Error) {
    return (
      <div className="p-6">
        <AlertComponent message={error.message} />
      </div>
    );
  }

  const totalExpenses =
    expenseData?.expense.reduce(
      (sum, expense) => sum + expense.budgetAmount,
      0
    ) || 0;
  const averageExpenses = expenseData?.expense.length
    ? totalExpenses / expenseData.expense.length
    : 0;
  const expensesSources = expenseData?.expense.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Expense Management
            </h1>
            <p className="text-slate-400">
              Track and manage your fixed and variable expenses
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <CreateExpensesDialog
              trigger={
                <Button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-orange-500/20 transform hover:scale-105 transition-all duration-300">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Variable Expense
                </Button>
              }
              type="variable"
            />
            <CreateExpensesDialog
              trigger={
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-blue-500/20 transform hover:scale-105 transition-all duration-300">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Fixed Expense
                </Button>
              }
              type="fixed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Total Expenses
              </CardTitle>
              <Receipt className="h-5 w-5 text-rose-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {expenseData?.currency}{" "}
                {totalExpenses.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +20.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Average Expense
              </CardTitle>
              <BarChart3 className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {expenseData?.currency}{" "}
                {averageExpenses.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Per expense category
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Active Categories
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-purple-400/10 flex items-center justify-center">
                <span className="text-lg font-bold text-purple-400">
                  {expensesSources}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Expense Types</div>
              <p className="text-xs text-slate-400 mt-1">Currently tracking</p>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-rose-400" />
              <p className="text-slate-400">Loading expense data...</p>
            </div>
          </div>
        ) : expenseData ? (
          <UserExpenses
            expenses={expenseData.expense}
            currency={expenseData.currency}
          />
        ) : null}
      </div>
    </div>
  );
}

export default ExpensesPage;
