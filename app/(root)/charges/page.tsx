"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAllCharge } from "./_actions/actions";
import AlertComponent from "@/components/shared/AlertComponent";
import { Button } from "@/components/ui/button";
import UserExpenses from "./_components/UserExpenses";
import { Loader2, PlusCircle } from "lucide-react";
import CreateExpensesDialog from "./_components/CreateExpensesDialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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

  return (
    <div className="flex h-full flex-col bg-slate-900 border-slate-800 shadow-lg">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="text-2xl font-bold text-white">Expenses</div>
        <div className="flex space-x-2">
          <CreateExpensesDialog
            trigger={
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Variable Expense
              </Button>
            }
            type="variable"
          />
          <CreateExpensesDialog
            trigger={
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Fixed Expense
              </Button>
            }
            type="fixed"
          />
        </div>
      </div>
      <div>
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
      </div>
    </div>
  );
}

export default ExpensesPage;
