import prisma from "@/prisma/prisma";
import { IDebtsRepository } from "@/src/application/repositories/debts.repository.interface";
import { UnauthenticatedError } from "@/src/entities/auth";
import {
  DatabaseOperationError,
  InputParseError,
  NotFoundError,
} from "@/src/entities/errors/common";
import { DebtsSchema, DebtsType } from "@/src/entities/models/debts/debts";
import { Debts } from "@prisma/client";
import { injectable } from "inversify";

@injectable()
export class CreateDebtsRepository implements IDebtsRepository {
  async createDebts(form: DebtsType, userId: string): Promise<Debts> {
    if (!userId) {
      throw new UnauthenticatedError("Not authenticated");
    }

    const {
      success,
      data,
      error: inputParseError,
    } = DebtsSchema.safeParse(form);

    if (!success) {
      throw new InputParseError("Invalid data", { cause: inputParseError });
    }

    try {
      return await prisma.$transaction(async (tx) => {
        const userExists = await this.checkUserExists(tx, userId);
        if (!userExists) {
          throw new NotFoundError("User not found.");
        }

        const newDebt = await prisma.debts.create({
          data: {
            clerkId: userId,
            ...data,
            remainsToBePaid: data.duAmount,
          },
        });

        await this.updateBudgetRules(tx, userId);

        return newDebt;
      });
    } catch (error) {
      console.error(
        `❌ Database Error in createDebts (userId: ${userId}):`,
        error
      );
      throw new DatabaseOperationError(
        `Failed to create debts: ${(error as Error).message}`
      );
    }
  }

  async getAllDebts(
    userId: string
  ): Promise<{ currency: string; debts: Debts[] }> {
    if (!userId) {
      throw new UnauthenticatedError("Not authenticated");
    }

    try {
      const [userSettings, debts] = await Promise.all([
        this.getUserSettings(userId),
        prisma.debts.findMany({
          where: { clerkId: userId },
          orderBy: { createdAt: "asc" },
        }),
      ]);

      return {
        currency: userSettings?.currency || "USD",
        debts,
      };
    } catch (error) {
      console.error(
        `❌ Database Error in getAllDebts (userId: ${userId}):`,
        error
      );
      throw new DatabaseOperationError(
        `Failed to fetch debts: ${(error as Error).message}`
      );
    }
  }

  async deleteDebts(debtsId: number, userId: string): Promise<void> {
    if (!userId) {
      throw new UnauthenticatedError("Not authenticated");
    }

    try {
      await prisma.$transaction(async (tx) => {
        const debtExists = await tx.debts.findFirst({
          where: { id: debtsId, clerkId: userId },
        });

        if (!debtExists) {
          throw new NotFoundError("Debt not found or already deleted.");
        }

        await tx.debts.delete({ where: { id: debtsId } });

        await this.updateBudgetRules(tx, userId);
      });
    } catch (error) {
      console.error(
        `❌ Database Error in deleteDebts (userId: ${userId}, debtsId: ${debtsId}):`,
        error
      );
      throw new DatabaseOperationError(
        `Failed to delete debt: ${(error as Error).message}`
      );
    }
  }

  private async getUserSettings(userId: string) {
    return prisma.userSettings.findUnique({ where: { clerkId: userId } });
  }

  private async checkUserExists(tx: any, userId: string): Promise<boolean> {
    const user = await tx.user.findUnique({ where: { clerkId: userId } });
    return !!user;
  }

  private async updateBudgetRules(tx: any, userId: string): Promise<void> {
    const [budget, budgetRules, totalDebts, totalSavings] = await Promise.all([
      tx.budget.aggregate({
        where: { clerkId: userId },
        _sum: { amount: true },
      }),
      tx.budgetRule.findFirst({ where: { clerkId: userId } }),
      tx.debts.aggregate({
        where: { clerkId: userId },
        _sum: { budgetAmount: true },
      }),
      tx.savings.groupBy({
        by: ["type"],
        where: { clerkId: userId },
        _sum: { budgetAmount: true },
      }),
    ]);

    if (!budget || !budgetRules) {
      throw new NotFoundError("Budget or budget rules not found.");
    }

    let totalSaving = 0;
    let totalInvest = 0;

    totalSavings.forEach(
      (t: { type: string; _sum: { budgetAmount: number } }) => {
        if (t.type === "saving") {
          totalSaving = t._sum.budgetAmount ?? 0;
        }
        if (t.type === "invest") {
          totalInvest = t._sum.budgetAmount ?? 0;
        }
      }
    );

    const totalBudget = budget._sum.amount ?? 0;
    const totalDebt = totalDebts._sum.budgetAmount ?? 0;
    const totalSavingAndInvest = totalSaving + totalInvest;

    // Ne pas mettre à zéro si le budget est vide
    const savingsPercentage =
      totalBudget > 0
        ? ((totalDebt + totalSavingAndInvest) / totalBudget) * 100
        : budgetRules.actualSavingsPercentage;

    await tx.budgetRule.upsert({
      where: { id: budgetRules.id },
      update: { actualSavingsPercentage: savingsPercentage },
      create: {
        needsPercentage: 50,
        savingsPercentage: 30,
        wantsPercentage: 20,
        actualNeedsPercentage: 0,
        actualSavingsPercentage: 0,
        actualWantsPercentage: 0,
        clerkId: userId,
      },
    });
  }
}
