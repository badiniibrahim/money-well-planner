"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAllSavings } from "./_actions/actions";
import AlertComponent from "@/components/shared/AlertComponent";
import { Button } from "@/components/ui/button";
import UserSavings from "./_components/UserSavings";
import {
  PlusCircle,
  Loader2,
  PiggyBank,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateSavingsDialog from "./_components/createSavingsDialog";

function SavingsPage() {
  const {
    data: savingsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getAllSavings"],
    queryFn: () => getAllSavings(),
  });

  if (isError && error instanceof Error) {
    return (
      <div className="p-6">
        <AlertComponent message={error.message} />
      </div>
    );
  }

  const totalSavings =
    savingsData?.savings.reduce(
      (sum, saving) => sum + saving.budgetAmount,
      0
    ) || 0;
  const averageSavings = savingsData?.savings.length
    ? totalSavings / savingsData.savings.length
    : 0;
  const savingsSources = savingsData?.savings.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Savings & Investments
            </h1>
            <p className="text-slate-400">
              Track your savings goals and investment progress
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <CreateSavingsDialog
              trigger={
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-blue-500/20 transform hover:scale-105 transition-all duration-300">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  New Savings Goal
                </Button>
              }
              type="saving"
            />
            <CreateSavingsDialog
              trigger={
                <Button className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-amber-500/20 transform hover:scale-105 transition-all duration-300">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  New Investment
                </Button>
              }
              type="invest"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Total Portfolio
              </CardTitle>
              <PiggyBank className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {savingsData?.currency}{" "}
                {totalSavings.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-blue-400 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +20.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Average Goal
              </CardTitle>
              <BarChart3 className="h-5 w-5 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {savingsData?.currency}{" "}
                {averageSavings.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Per savings/investment goal
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Active Goals
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-purple-400/10 flex items-center justify-center">
                <span className="text-lg font-bold text-purple-400">
                  {savingsSources}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Total Goals</div>
              <p className="text-xs text-slate-400 mt-1">Currently tracking</p>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <p className="text-slate-400">Loading savings data...</p>
            </div>
          </div>
        ) : savingsData ? (
          <UserSavings
            savings={savingsData.savings}
            currency={savingsData.currency}
          />
        ) : null}
      </div>
    </div>
  );
}

export default SavingsPage;
