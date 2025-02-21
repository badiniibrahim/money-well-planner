"use client";

import { InboxIcon } from "lucide-react";
import React from "react";
import { Debts } from "@prisma/client";
import { DebtsTable } from "./DebtsTable";
import AlertComponent from "@/components/shared/AlertComponent";

type Props = {
  debts: Debts[];
  currency: string;
};

function UserDebts({ debts, currency }: Props) {
  if (!debts) {
    return (
      <AlertComponent message="Something went wrong. Please try again later." />
    );
  }

  if (debts.length === 0) {
    return (
      <>
        <div className="flex flex-col gap-4 h-full items-center justify-center">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">No Fixed debts created yet</p>
            <p className="text-sm text-muted-foreground">
              Click the button below to add your first debts
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 mt-5">
        <DebtsTable debts={debts} currency={currency} />
      </div>
    </>
  );
}

export default UserDebts;
