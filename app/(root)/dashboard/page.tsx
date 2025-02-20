"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getState } from "./_actions/actions";
import { GetFormatterForCurrency } from "@/lib/helpers";
import TotalIncome from "./_components/TotalIncome";
import AlertComponent from "@/components/shared/AlertComponent";

function page() {
  const {
    data: state,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["state"],
    queryFn: () => getState(),
  });

  const formatter = GetFormatterForCurrency(state?.currency ?? "USD");

  if (isError && error instanceof Error) {
    return <AlertComponent message={error.message} />;
  }

  return (
    <div className="">
      <div className="flex flex-wrap lg:flex-nowrap  gap-6">
        <TotalIncome
          currency={state?.currency ?? "USD"}
          totalBudget={state?.totalBudget ?? 0}
        />
      </div>
    </div>
  );
}

export default page;
