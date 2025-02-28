import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const [
      budget,
      budgetRules,
      totalFixedExpenses,
      totalVariableExpenses,
      totalSavings,
      totalDebts,
      totalPleasures,
    ] = await Promise.all([
      prisma.budget.aggregate({
        where: { clerkId: userId },
        _sum: { amount: true },
      }),
      prisma.budgetRule.findFirst({ where: { clerkId: userId } }),
      prisma.expense.aggregate({
        where: { clerkId: userId, type: "fixed" },
        _sum: { budgetAmount: true },
      }),
      prisma.expense.aggregate({
        where: { clerkId: userId, type: "variable" },
        _sum: { budgetAmount: true },
      }),
      prisma.savings.aggregate({
        where: { clerkId: userId },
        _sum: { budgetAmount: true },
      }),
      prisma.debts.aggregate({
        where: { clerkId: userId },
        _sum: { budgetAmount: true },
      }),
      prisma.pleasure.aggregate({
        where: { clerkId: userId },
        _sum: { budgetAmount: true },
      }),
    ]);

    if (!budgetRules) {
      // Créer des règles budgétaires par défaut si elles n'existent pas
      await prisma.budgetRule.create({
        data: {
          needsPercentage: 50,
          savingsPercentage: 30,
          wantsPercentage: 20,
          actualNeedsPercentage: 0,
          actualSavingsPercentage: 0,
          actualWantsPercentage: 0,
          clerkId: userId,
        },
      });
      return NextResponse.json({
        success: true,
        message: "Règles budgétaires créées",
      });
    }

    const totalBudget = budget._sum.amount ?? 0;
    if (totalBudget === 0) {
      return NextResponse.json({
        success: false,
        message: "Budget total est zéro",
      });
    }

    const totalFixed = totalFixedExpenses._sum.budgetAmount ?? 0;
    const totalVariable = totalVariableExpenses._sum.budgetAmount ?? 0;
    const totalSaving = totalSavings._sum.budgetAmount ?? 0;
    const totalDebt = totalDebts._sum.budgetAmount ?? 0;
    const totalPleasure = totalPleasures._sum.budgetAmount ?? 0;

    // Calcul des pourcentages réels
    const totalNeeds = totalFixed + totalVariable;
    const needsPercentage = (totalNeeds / totalBudget) * 100;
    const savingsPercentage = ((totalSaving + totalDebt) / totalBudget) * 100;
    const wantsPercentage = (totalPleasure / totalBudget) * 100;

    // Mise à jour des règles budgétaires
    await prisma.budgetRule.update({
      where: { id: budgetRules.id },
      data: {
        actualNeedsPercentage: needsPercentage,
        actualSavingsPercentage: savingsPercentage,
        actualWantsPercentage: wantsPercentage,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Règles budgétaires mises à jour",
      data: {
        needsPercentage,
        savingsPercentage,
        wantsPercentage,
      },
    });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour des règles budgétaires:",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
