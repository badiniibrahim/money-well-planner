"use client";

import { InboxIcon } from "lucide-react";
import React from "react";
import { Budget } from "@prisma/client";
import { IncomeTable } from "./IncomeTable";
import AlertComponent from "@/components/shared/AlertComponent";

type Props = {
  incomes: Budget[];
  currency: string;
};

function UserIncome({ incomes, currency }: Props) {
  if (!incomes) {
    return (
      <AlertComponent message="Something went wrong. Please try again later." />
    );
  }

  if (incomes.length === 0) {
    return (
      <div className="flex flex-col gap-6 h-full items-center justify-center p-6  rounded-lg shadow-sm">
        <div className="rounded-full bg-accent/20 w-24 h-24 flex items-center justify-center">
          <InboxIcon
            size={48}
            className="stroke-primary-600 dark:stroke-primary-400"
          />
        </div>
        <div className="flex flex-col gap-2 text-center">
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            No income created yet
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Click the button below to add your first income
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 mt-6">
      <IncomeTable budgets={incomes} currency={currency} />
    </div>
  );
}

export default UserIncome;
