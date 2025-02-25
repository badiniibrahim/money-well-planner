"use client";

import { Receipt } from "lucide-react";
import React from "react";
import { Expense } from "@prisma/client";
import { ExpensesTable } from "./ExpensesTable";
import AlertComponent from "@/components/shared/AlertComponent";
import { Card } from "@/components/ui/card";

type Props = {
  expenses: Expense[];
  currency: string;
};

function UserFixedExpenses({ expenses, currency }: Props) {
  if (!expenses) {
    return (
      <Card className="bg-slate-900/50 border-slate-700/50">
        <div className="p-6">
          <AlertComponent message="Something went wrong. Please try again later." />
        </div>
      </Card>
    );
  }

  if (expenses.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-slate-700/50">
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="rounded-full bg-slate-800/50 w-24 h-24 flex items-center justify-center mb-6 border border-slate-700/50">
            <Receipt className="h-12 w-12 text-rose-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            No Expenses Created Yet
          </h3>
          <p className="text-slate-400 max-w-sm">
            Start managing your expenses by adding your first entry. Click the
            "Add New Expense" button above to begin tracking your spending.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ExpensesTable expenses={expenses} currency={currency} />
    </div>
  );
}

export default UserFixedExpenses;
