import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupération des données en parallèle pour optimiser les performances
    const [
      budgets,
      expenses,
      debts,
      savings,
      pleasures,
      budgetRules,
      financialGoals,
      userSettings,
    ] = await Promise.all([
      prisma.budget.findMany({ where: { clerkId: userId } }),
      prisma.expense.findMany({ where: { clerkId: userId } }),
      prisma.debts.findMany({ where: { clerkId: userId } }),
      prisma.savings.findMany({ where: { clerkId: userId } }),
      prisma.pleasure.findMany({ where: { clerkId: userId } }),
      prisma.budgetRule.findFirst({ where: { clerkId: userId } }),
      prisma.financialGoal.findMany({ where: { clerkId: userId } }),
      prisma.userSettings.findUnique({ where: { clerkId: userId } }),
    ]);

    // Calcul des totaux
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalFixed = expenses
      .filter((expense) => expense.type === "fixed")
      .reduce((sum, expense) => sum + expense.budgetAmount, 0);
    const totalVariable = expenses
      .filter((expense) => expense.type === "variable")
      .reduce((sum, expense) => sum + expense.budgetAmount, 0);
    const totalDebt = debts.reduce((sum, debt) => sum + debt.budgetAmount, 0);
    const totalSavings = savings.reduce(
      (sum, saving) => sum + saving.budgetAmount,
      0
    );
    const totalPleasure = pleasures.reduce(
      (sum, pleasure) => sum + pleasure.budgetAmount,
      0
    );

    // Calcul du budget restant
    const totalAllocated =
      totalFixed + totalVariable + totalDebt + totalSavings + totalPleasure;
    const remainsBudget = totalBudget - totalAllocated;

    // Construction de l'objet State
    const state = {
      totalBudget,
      currency: userSettings?.currency || "EUR",
      totalFixed,
      totalVariable,
      budgetRules: budgetRules || undefined,
      remainsBudget,
      totalDebt,
      totalSavings,
      totalPleasure,
      budgets,
      expenses,
      debts,
      savings,
      pleasures,
      financialGoals: financialGoals || undefined,
    };

    return NextResponse.json(state);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données pour les notifications:",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
