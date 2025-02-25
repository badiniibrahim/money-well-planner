"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getState } from "./_actions/actions";
import { GetFormatterForCurrency } from "@/lib/helpers";
import AlertComponent from "@/components/shared/AlertComponent";
import { CreditCard, BarChart, Loader2, DollarSign } from "lucide-react";
import ExpenseCard from "./_components/ExpenseCard";
import { FaGlassCheers, FaPiggyBank, FaRegCreditCard } from "react-icons/fa";
import StateChart from "./_components/StateChart";
import BudgetRuleTable from "./_components/BudgetRuleTable";
import { PieBalanceChart } from "./_components/PieStateChart";

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
      title: "Total Budget",
      value: state?.totalBudget,
      color: "bg-indigo-600",
      icon: DollarSign,
    },
    {
      title: "Remains to Budget",
      value: state?.remainsBudget,
      color: "bg-green-600",
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
      color: "bg-red-500",
      icon: FaRegCreditCard,
    },
    {
      title: "Savings and Investments",
      value: state?.savings,
      color: "bg-yellow-500",
      icon: FaPiggyBank,
    },
    {
      title: "Pleasure",
      value: state?.totalPleasure,
      color: "bg-pink-500",
      icon: FaGlassCheers,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-white mb-6">
          Financial Dashboard
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

        {state && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <StateChart state={state} />
            </div>
            <div className="space-y-6">
              <BudgetRuleTable budgetRules={state.budgetRules} />
              <PieBalanceChart state={state} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
