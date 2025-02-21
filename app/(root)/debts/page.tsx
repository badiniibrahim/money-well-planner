"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAllDebts } from "./_actions/actions";
import AlertComponent from "@/components/shared/AlertComponent";
import CreateDebtsDialog from "./_components/CreateDebtsDialog";
import { Button } from "@/components/ui/button";
import UserDebts from "./_components/UserDebts";
import { Loader2, PlusCircle } from "lucide-react";

function page() {
  const {
    data: debtsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getAllDebts"],
    queryFn: () => getAllDebts(),
  });

  if (isError && error instanceof Error) {
    return <AlertComponent message={error.message} />;
  }

  return (
    <div className="flex h-full flex-col bg-slate-900 border-slate-800 shadow-lg">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="text-2xl font-bold text-white">Expenses</div>
        <div className="flex space-x-2">
          <CreateDebtsDialog
            trigger={
              <Button
                variant={"outline"}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg flex items-center"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add new debt
              </Button>
            }
          />
        </div>
      </div>
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : debtsData ? (
          <UserDebts debts={debtsData.debts} currency={debtsData.currency} />
        ) : null}
      </div>
    </div>
  );
}

export default page;
