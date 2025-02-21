"use client";

import AlertComponent from "@/components/shared/AlertComponent";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAllPleasure } from "./_actions/actions";
import CreatePleasuresDialog from "./_components/CreatPleasuresDialog";
import { Button } from "@/components/ui/button";
import UserPleasures from "./_components/UserPleasures";
import { Loader2, PlusCircle } from "lucide-react";

function page() {
  const {
    data: pleasureData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getAllPleasure"],
    queryFn: () => getAllPleasure(),
  });

  if (isError && error instanceof Error) {
    return <AlertComponent message={error.message} />;
  }

  return (
    <div className="flex h-full flex-col bg-slate-900 border-slate-800 shadow-lg">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="text-2xl font-bold text-white">Expenses</div>
        <div className="flex space-x-2">
          <CreatePleasuresDialog
            trigger={
              <Button
                variant="secondary"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add new pleasures and reserve funds
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
        ) : pleasureData ? (
          <UserPleasures
            pleasure={pleasureData.pleasure}
            currency={pleasureData.currency}
          />
        ) : null}
      </div>
    </div>
  );
}

export default page;
