"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Expense } from "@prisma/client";
import { ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react";

type ExpenseTrackingCardProps = {
  expense: Expense;
  currency: string;
};

export default function ExpenseTrackingCard({
  expense,
  currency,
}: ExpenseTrackingCardProps) {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency || "USD",
  });

  // Calculer le pourcentage de la dépense réelle par rapport au budget
  const realAmount = expense.real || 0;
  const budgetAmount = expense.budgetAmount;
  const percentage = budgetAmount > 0 ? (realAmount / budgetAmount) * 100 : 0;

  // Déterminer si on est au-dessus ou en-dessous du budget
  const isOverBudget = realAmount > budgetAmount;
  const difference = Math.abs(realAmount - budgetAmount);
  const differencePercentage =
    budgetAmount > 0 ? Math.round((difference / budgetAmount) * 100) : 0;

  return (
    <Card
      className={`bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 transition-colors duration-300 ${
        isOverBudget
          ? "border-l-4 border-l-rose-500"
          : "border-l-4 border-l-green-500"
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium text-white">
            {expense.name}
          </CardTitle>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              expense.type === "fixed"
                ? "bg-blue-400/10 text-blue-400"
                : "bg-orange-400/10 text-orange-400"
            }`}
          >
            {expense.type === "fixed" ? "Fixe" : "Variable"}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-400">Budget</p>
              <p className="text-lg font-semibold text-white">
                {formatter.format(budgetAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Réel</p>
              <p
                className={`text-lg font-semibold ${
                  isOverBudget ? "text-rose-400" : "text-green-400"
                }`}
              >
                {formatter.format(realAmount)}
              </p>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs text-slate-400">Progression</p>
              <p className="text-xs font-medium text-slate-300">
                {Math.round(percentage)}%
              </p>
            </div>
            <Progress value={Math.min(percentage, 100)} className="h-2" />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div
              className={`flex items-center text-sm ${
                isOverBudget ? "text-rose-400" : "text-green-400"
              }`}
            >
              {isOverBudget ? (
                <>
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>Dépassement de {differencePercentage}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  <span>Économie de {differencePercentage}%</span>
                </>
              )}
            </div>
            <div className="text-sm text-slate-400">
              {formatter.format(difference)}
            </div>
          </div>

          {expense.dueDate && (
            <div className="pt-2 border-t border-slate-700/50">
              <p className="text-xs text-slate-400">Échéance</p>
              <p className="text-sm text-slate-300">
                {new Date(expense.dueDate).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
