"use client";

import AlertComponent from "@/components/shared/AlertComponent";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAllSavings } from "./_actions/actions";
import CreateSavingsDialog from "./_components/createSavingsDialog";
import { Button } from "@/components/ui/button";
import UserSavings from "./_components/UserSavings";
import { Loader2, PlusCircle } from "lucide-react";

function page() {
  const {
    data: savingsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getAllSavings"],
    queryFn: () => getAllSavings(),
  });

  if (isError && error instanceof Error) {
    return <AlertComponent message={error.message} />;
  }
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex justify-end gap-4">
        <CreateSavingsDialog
          trigger={
            <Button
              variant="secondary"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add new savings
            </Button>
          }
          type="saving"
        />
        <CreateSavingsDialog
          trigger={
            <Button
              variant="secondary"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add new Investments
            </Button>
          }
          type="invest"
        />
      </div>
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : savingsData ? (
          <UserSavings
            savings={savingsData.savings}
            currency={savingsData.currency}
          />
        ) : null}
      </div>
    </div>
  );
}

export default page;
