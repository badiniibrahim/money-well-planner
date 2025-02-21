"use client";

import { InboxIcon } from "lucide-react";
import React from "react";
import { Expense } from "@prisma/client";
import { ExpensesTable } from "./ExpensesTable";
import AlertComponent from "@/components/shared/AlertComponent";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  expenses: Expense[];
  currency: string;
};

function UserFixedExpenses({ expenses, currency }: Props) {
  if (!expenses) {
    return (
      <AlertComponent message="Something went wrong. Please try again later." />
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-slate-900  shadow-lg">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="rounded-full bg-blue-500/20 w-20 h-20 flex items-center justify-center mb-4">
            <InboxIcon size={40} className="text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            No Expenses Created Yet
          </h3>
          <p className="text-sm text-slate-400 max-w-sm">
            Start managing your finances by adding your first expense. Use the
            buttons above to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <ExpensesTable expenses={expenses} currency={currency} />
    </div>
  );
}

export default UserFixedExpenses;
