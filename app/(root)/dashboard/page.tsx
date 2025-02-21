"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getState } from "./_actions/actions";
import { GetFormatterForCurrency } from "@/lib/helpers";
import TotalIncome from "./_components/TotalIncome";
import AlertComponent from "@/components/shared/AlertComponent";
import { CreditCard, BarChart, Loader2 } from "lucide-react";
import ExpenseCard from "./_components/ExpenseCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaRegCreditCard } from "react-icons/fa";

function DashboardPage() {
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

  const cardsConfig = [
    {
      title: "Remains to Budget",
      value: state?.remainsBudget,
      color: "bg-[#1a202c]",
      icon: BarChart,
    },
    {
      title: "Fixed Charges",
      value: state?.totalFixed,
      color: "bg-blue-500",
      icon: CreditCard,
    },
    {
      title: "Variable Charges",
      value: state?.totalVariable,
      color: "bg-purple-500",
      icon: BarChart,
    },
    {
      title: "Debts",
      value: state?.totalDebt,
      color: "bg-[hsl(var(--chart-5))]",
      icon: FaRegCreditCard,
    },
  ];

  return (
    <Card className="bg-slate-900 border-slate-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">
          Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="space-y-6">
            <TotalIncome
              currency={state?.currency ?? "USD"}
              totalBudget={state?.totalBudget ?? 0}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cardsConfig.map((card, index) => (
                <ExpenseCard
                  key={index}
                  title={card.title}
                  value={card.value ?? 0}
                  color={card.color}
                  icon={card.icon}
                  currencyFormatter={formatter.format}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DashboardPage;
