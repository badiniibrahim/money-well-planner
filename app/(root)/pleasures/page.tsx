"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAllPleasure } from "./_actions/actions";
import AlertComponent from "@/components/shared/AlertComponent";
import CreatePleasuresDialog from "./_components/CreatPleasuresDialog";
import { Button } from "@/components/ui/button";
import UserPleasures from "./_components/UserPleasures";
import { Loader2, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaMoneyBillWave, FaChartLine, FaListAlt } from "react-icons/fa";

function page() {
  const {
    data: pleasureData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getAllPleasure"],
    queryFn: () => getAllPleasure(),
  });

  if (isError && error instanceof Error) {
    return <AlertComponent message={error.message} />;
  }

  const totalPleasures =
    pleasureData?.pleasure.reduce(
      (sum, pleasure) => sum + pleasure.budgetAmount,
      0
    ) || 0;
  const averagePleasures = pleasureData?.pleasure.length
    ? totalPleasures / pleasureData.pleasure.length
    : 0;
  const pleasuresSources = pleasureData?.pleasure.length || 0;

  return (
    <div className="flex h-full flex-col p-6 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent flex items-center">
          Pleasures and Reserve Funds
        </h1>
        <div className="flex space-x-2">
          <CreatePleasuresDialog
            trigger={
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out flex items-center"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Add new pleasures
              </Button>
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Total Pleasures
            </CardTitle>
            <FaMoneyBillWave className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {pleasureData?.currency} {totalPleasures.toFixed(2)}
            </div>
            <p className="text-xs text-slate-400">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Average Pleasures
            </CardTitle>
            <FaChartLine className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {pleasureData?.currency} {averagePleasures.toFixed(2)}
            </div>
            <p className="text-xs text-slate-400">Per pleasure source</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Pleasures Sources
            </CardTitle>
            <FaListAlt className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {pleasuresSources}
            </div>
            <p className="text-xs text-slate-400">Active pleasure streams</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-xl rounded-lg">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : pleasureData ? (
          <UserPleasures
            pleasure={pleasureData.pleasure}
            currency={pleasureData.currency}
          />
        ) : null}
      </Card>
    </div>
  );
}

export default page;
