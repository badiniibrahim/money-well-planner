"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import CreateIncomeDialog from "./_components/CreateIncomeDialog";
import { useQuery } from "@tanstack/react-query";
import { getAllIncome } from "./_actions/actions";
import AlertComponent from "@/components/shared/AlertComponent";
import UserIncome from "./_components/UserIncome";
import { PlusCircle, Loader2 } from "lucide-react";

function Page() {
  const {
    data: incomeData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getAllIncome"],
    queryFn: () => getAllIncome(),
  });

  if (isError && error instanceof Error) {
    return <AlertComponent message={error.message} />;
  }

  return (
    <div className="flex h-full flex-col bg-slate-900 ">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CreateIncomeDialog
          trigger={
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg flex items-center"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Income
            </Button>
          }
        />
      </div>
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : incomeData ? (
          <UserIncome
            incomes={incomeData.incomes}
            currency={incomeData.currency}
          />
        ) : null}
      </div>
    </div>
  );
}

export default Page;
