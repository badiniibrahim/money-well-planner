"use client";

import { Inbox, Wallet2 } from "lucide-react";
import React from "react";
import { Budget } from "@prisma/client";
import { IncomeTable } from "./IncomeTable";
import AlertComponent from "@/components/shared/AlertComponent";
import { Card } from "@/components/ui/card";

type Props = {
  incomes: Budget[];
  currency: string;
};

function UserIncome({ incomes, currency }: Props) {
  if (!incomes) {
    return (
      <Card className="bg-slate-900/50 border-slate-700/50">
        <div className="p-6">
          <AlertComponent message="Something went wrong. Please try again later." />
        </div>
      </Card>
    );
  }

  if (incomes.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-slate-700/50">
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="rounded-full bg-slate-800/50 w-24 h-24 flex items-center justify-center mb-6 border border-slate-700/50">
            <Wallet2 className="h-12 w-12 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            No Income Sources Yet
          </h3>
          <p className="text-slate-400 max-w-sm">
            Start tracking your finances by adding your first income source.
            Click the "Add New Income" button above to get started.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <IncomeTable budgets={incomes} currency={currency} />
    </div>
  );
}

export default UserIncome;
