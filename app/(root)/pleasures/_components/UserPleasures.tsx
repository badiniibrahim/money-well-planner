"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, InboxIcon } from "lucide-react";
import React from "react";
import { Pleasure } from "@prisma/client";
import { PleasuresTable } from "./PleasuresTable";

type Props = {
  pleasure: Pleasure[];
  currency: string;
};

function UserPleasures({ pleasure, currency }: Props) {
  if (!pleasure) {
    return (
      <>
        <Alert variant={"destructive"}>
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Something went wrong. Please try again later.
          </AlertDescription>
        </Alert>
      </>
    );
  }

  if (pleasure.length === 0) {
    return (
      <>
        <div className="flex flex-col gap-4 h-full items-center justify-center">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">
              No pleasures and reserve funds created yet
            </p>
            <p className="text-sm text-muted-foreground">
              Click the button below to add your first pleasures and reserve
              funds
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 mt-5">
        <PleasuresTable pleasure={pleasure} currency={currency} />
      </div>
    </>
  );
}

export default UserPleasures;
