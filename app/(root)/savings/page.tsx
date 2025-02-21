"use client";

import AlertComponent from "@/components/shared/AlertComponent";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAllSavings } from "./_actions/actions";
import CreateSavingsDialog from "./_components/createSavingsDialog";
import { Button } from "@/components/ui/button";
import UserSavings from "./_components/UserSavings";
import { Loader2, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaMoneyBillWave, FaChartLine, FaListAlt } from "react-icons/fa";

function page() {
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
    return <AlertComponent message={error.message} />;
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
    <div className="flex h-full flex-col p-6 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent flex items-center">
          Savings and Investments
        </h1>
        <div className="flex justify-end gap-4">
          <CreateSavingsDialog
            trigger={
              <Button
                variant="secondary"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full py-2 px-4 transition duration-300 ease-in-out"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add new savings
              </Button>
            }
            type="saving"
          />
          <CreateSavingsDialog
            trigger={
              <Button
                variant="secondary"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full py-2 px-4 transition duration-300 ease-in-out"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add new Investments
              </Button>
            }
            type="invest"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Total Savings
            </CardTitle>
            <FaMoneyBillWave className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {savingsData?.currency} {totalSavings.toFixed(2)}
            </div>
            <p className="text-xs text-slate-400">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Average Savings
            </CardTitle>
            <FaChartLine className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {savingsData?.currency} {averageSavings.toFixed(2)}
            </div>
            <p className="text-xs text-slate-400">Per saving source</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Savings Sources
            </CardTitle>
            <FaListAlt className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {savingsSources}
            </div>
            <p className="text-xs text-slate-400">Active saving streams</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-slate-800/50 border-slate-700/50 backdrop-blur-xl rounded-lg">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
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

export default page;
