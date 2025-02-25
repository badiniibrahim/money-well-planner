"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import CreateIncomeDialog from "./_components/CreateIncomeDialog";
import { useQuery } from "@tanstack/react-query";
import { getAllIncome } from "./_actions/actions";
import AlertComponent from "@/components/shared/AlertComponent";
import UserIncome from "./_components/UserIncome";
import { PlusCircle, Loader2, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaMoneyBillWave, FaChartLine, FaListAlt } from "react-icons/fa";

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
    return <AlertComponent message={error.message} />;
  }

  const totalIncome =
    incomeData?.incomes.reduce((sum, income) => sum + income.amount, 0) || 0;
  const averageIncome = incomeData?.incomes.length
    ? totalIncome / incomeData.incomes.length
    : 0;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent flex items-center">
          Income Management
        </h1>
        <CreateIncomeDialog
          trigger={
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out flex items-center"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Income
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Total Income
            </CardTitle>
            <FaMoneyBillWave className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {incomeData?.currency} {totalIncome.toFixed(2)}
            </div>
            <p className="text-xs text-slate-400">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Average Income
            </CardTitle>
            <FaChartLine className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {incomeData?.currency} {averageIncome.toFixed(2)}
            </div>
            <p className="text-xs text-slate-400">Per income source</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Income Sources
            </CardTitle>
            <FaListAlt className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {incomeData?.incomes.length || 0}
            </div>
            <p className="text-xs text-slate-400">Active income streams</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-xl">
       
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : incomeData ? (
            <UserIncome
              incomes={incomeData.incomes}
              currency={incomeData.currency}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
