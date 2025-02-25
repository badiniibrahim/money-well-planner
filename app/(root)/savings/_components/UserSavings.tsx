"use client";

import { PiggyBank } from "lucide-react";
import React from "react";
import { Savings } from "@prisma/client";
import { SavingsTable } from "./SavingsTable";
import AlertComponent from "@/components/shared/AlertComponent";
import { Card } from "@/components/ui/card";

type Props = {
  savings: Savings[];
  currency: string;
};

function UserSavings({ savings, currency }: Props) {
  if (!savings) {
    return (
      <Card className="bg-slate-900/50 border-slate-700/50">
        <div className="p-6">
          <AlertComponent message="Something went wrong. Please try again later." />
        </div>
      </Card>
    );
  }

  if (savings.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-slate-700/50">
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="rounded-full bg-slate-800/50 w-24 h-24 flex items-center justify-center mb-6 border border-slate-700/50">
            <PiggyBank className="h-12 w-12 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            No Savings or Investments Yet
          </h3>
          <p className="text-slate-400 max-w-sm">
            Start building your financial future by adding your first savings
            goal or investment. Click the "Add New" button above to begin
            growing your wealth.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <SavingsTable savings={savings} currency={currency} />
    </div>
  );
}

export default UserSavings;
