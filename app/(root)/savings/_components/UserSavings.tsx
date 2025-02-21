"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, InboxIcon } from "lucide-react";
import React from "react";
import { Savings } from "@prisma/client";
import { SavingsTable } from "./SavingsTable";
import AlertComponent from "@/components/shared/AlertComponent";

type Props = {
  savings: Savings[];
  currency: string;
};

function UserSavings({ savings, currency }: Props) {
  if (!savings) {
    return (
      <AlertComponent message="Something went wrong. Please try again later." />
    );
  }

  if (savings.length === 0) {
    return (
      <>
        <div className="flex flex-col gap-4 h-full items-center justify-center">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">No savings or investments created yet</p>
            <p className="text-sm text-muted-foreground">
              Click the button below to add your first savings or investments
              created
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 mt-5">
        <SavingsTable savings={savings} currency={currency} />
      </div>
    </>
  );
}

export default UserSavings;
