"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAllGoals } from "./_actions/actions";
import AlertComponent from "@/components/shared/AlertComponent";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import CreateGoalDialog from "./_componets/CreateGoalDialog";
import FinancialGoalsList from "./_componets/FinancialGoalsList";

function GoalsPage() {
  const {
    data: goals,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getAllGoals"],
    queryFn: () => getAllGoals(),
  });

  if (isError && error instanceof Error) {
    return (
      <div className="p-6">
        <AlertComponent message={error.message} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Financial Goals
            </h1>
            <p className="text-slate-400">
              Track and achieve your financial objectives
            </p>
          </div>
          <CreateGoalDialog
            trigger={
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-blue-500/20 transform hover:scale-105 transition-all duration-300">
                <PlusCircle className="mr-2 h-5 w-5" />
                New Goal
              </Button>
            }
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <p className="text-slate-400">Loading goals...</p>
            </div>
          </div>
        ) : !goals || goals.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-700/50">
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="rounded-full bg-slate-800/50 w-24 h-24 flex items-center justify-center mb-6 border border-slate-700/50">
                <Target className="h-12 w-12 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No Financial Goals Yet
              </h3>
              <p className="text-slate-400 max-w-sm">
                Start planning your financial future by setting your first goal.
                Click the "New Goal" button above to begin.
              </p>
            </div>
          </Card>
        ) : (
          <FinancialGoalsList goals={goals} />
        )}
      </div>
    </div>
  );
}

export default GoalsPage;
