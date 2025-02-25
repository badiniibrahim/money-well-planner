"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAllCharge } from "./_actions/actions";
import AlertComponent from "@/components/shared/AlertComponent";
import { Button } from "@/components/ui/button";
import UserExpenses from "./_components/UserExpenses";
import { Loader2, PlusCircle } from "lucide-react";
import CreateExpensesDialog from "./_components/CreateExpensesDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaMoneyBillWave, FaChartLine, FaListAlt } from "react-icons/fa";

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
    return <AlertComponent message={error.message} />;
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
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent flex items-center">
          Expenses
        </h1>
        <div className="flex space-x-2">
          <CreateExpensesDialog
            trigger={
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out flex items-center"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Variable Expense
              </Button>
            }
            type="variable"
          />
          <CreateExpensesDialog
            trigger={
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out flex items-center"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Fixed Expense
              </Button>
            }
            type="fixed"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Total Expenses
            </CardTitle>
            <FaMoneyBillWave className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {expenseData?.currency} {totalExpenses.toFixed(2)}
            </div>
            <p className="text-xs text-slate-400">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Average Expenses
            </CardTitle>
            <FaChartLine className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {expenseData?.currency} {averageExpenses.toFixed(2)}
            </div>
            <p className="text-xs text-slate-400">Per expense source</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Expenses Sources
            </CardTitle>
            <FaListAlt className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {expensesSources}
            </div>
            <p className="text-xs text-slate-400">Active expense streams</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-xl">
        
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : expenseData ? (
            <UserExpenses
              expenses={expenseData.expense}
              currency={expenseData.currency}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

export default ExpensesPage;
