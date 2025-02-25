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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Page() {
  const {
    data: incomeData,
    isLoading,
    isError,
    error,
  } = useQuery({
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
