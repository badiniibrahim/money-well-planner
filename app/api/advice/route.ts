import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/prisma/prisma";
import { chatSession } from "@/lib/gemini";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuth(req);
    const clerkId = auth.userId;

    if (!clerkId) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // ✅ Récupération des finances de l'utilisateur
    const [expenses, debts, savings, investments] = await Promise.all([
      prisma.expense.findMany({
        where: { clerkId },
        select: { budgetAmount: true, type: true },
      }),
      prisma.debts.findMany({
        where: { clerkId },
        select: { budgetAmount: true },
      }),
      prisma.savings.findMany({
        where: { clerkId, type: "saving" },
        select: { budgetAmount: true },
      }),
      prisma.savings.findMany({
        where: { clerkId, type: "invest" },
        select: { budgetAmount: true },
      }),
    ]);

    if (
      !expenses.length &&
      !debts.length &&
      !savings.length &&
      !investments.length
    ) {
      return NextResponse.json(
        { error: "Aucune donnée disponible pour générer un conseil" },
        { status: 404 }
      );
    }

    const totalExpenses = expenses.reduce(
      (sum, exp) => sum + exp.budgetAmount,
      0
    );
    const totalDebts = debts.reduce((sum, debt) => sum + debt.budgetAmount, 0);
    const totalSavings = savings.reduce(
      (sum, save) => sum + save.budgetAmount,
      0
    );
    const totalInvestments = investments.reduce(
      (sum, invest) => sum + invest.budgetAmount,
      0
    );

    const categorySummary = {
      Dépenses: totalExpenses,
      Dettes: totalDebts,
      Épargne: totalSavings,
      Investissements: totalInvestments,
    };

    const sortedCategories = Object.entries(categorySummary).sort(
      (a, b) => b[1] - a[1]
    );
    const topCategory = sortedCategories[0]?.[0] || "inconnue";
    const topCategoryAmount = sortedCategories[0]?.[1] || 0;

    const message = `
      🔍 Analyse financière de l'utilisateur :
      - 💸 Dépenses totales : ${totalExpenses.toFixed(2)}€
      - 🏦 Dettes : ${totalDebts.toFixed(2)}€
      - 💰 Épargne : ${totalSavings.toFixed(2)}€
      - 📈 Investissements : ${totalInvestments.toFixed(2)}€
      - ⭐ Catégorie la plus importante : ${topCategory} (${topCategoryAmount.toFixed(
      2
    )}€)

      🔥 OBJECTIF :
      Fournis un conseil financier personnalisé en tenant compte des dettes, des dépenses, de l'épargne et des investissements.
      Propose des **actions concrètes** à appliquer immédiatement.
      Utilise un ton amical, clair et pédagogique.
    `;

    const aiResponse = await chatSession.sendMessage(message);
    const advice = aiResponse.response.text();

    await prisma.dailyAdvice.upsert({
      where: { clerkId },
      update: { advice },
      create: { clerkId, advice },
    });

    return NextResponse.json({ advice, categorySummary });
  } catch (error) {
    console.error("Erreur AI :", error);
    return NextResponse.json(
      { error: "Impossible de générer un conseil." },
      { status: 500 }
    );
  }
}
