import prisma from "@/prisma/prisma";
import { ISavingsRepository } from "@/src/application/repositories/savings.repository.interface";
import { UnauthenticatedError } from "@/src/entities/auth";
import {
  DatabaseOperationError,
  InputParseError,
  NotFoundError,
} from "@/src/entities/errors/common";
import {
  SavingsSchema,
  SavingsType,
} from "@/src/entities/models/savings/savings";
import { Savings } from "@prisma/client";
import { injectable } from "inversify";

@injectable()
export class CreateSavingsRepository implements ISavingsRepository {
  async createSavings(form: SavingsType, userId: string): Promise<Savings> {
    if (!userId) {
      throw new UnauthenticatedError("Not authenticated");
    }

    const {
      success,
      data,
      error: inputParseError,
    } = SavingsSchema.safeParse(form);
    if (!success) {
      throw new InputParseError("Invalid data", { cause: inputParseError });
    }

    try {
      return await prisma.$transaction(async (tx) => {
        const userExists = await this.checkUserExists(tx, userId);
        if (!userExists) {
          throw new NotFoundError("User not found.");
        }

        const newSaving = await tx.savings.create({
          data: { clerkId: userId, ...data },
        });

        await this.updateBudgetRules(tx, userId);

        return newSaving;
      });
    } catch (error) {
      console.error(
        `❌ Database Error in createSavings (userId: ${userId}):`,
        error
      );
      throw new DatabaseOperationError(
        `Failed to create savings: ${(error as Error).message}`
      );
    }
  }

  async getAllSavings(
    userId: string
  ): Promise<{ currency: string; savings: Savings[] }> {
    if (!userId) {
      throw new UnauthenticatedError("Not authenticated");
    }

    try {
      const [userSettings, savings] = await Promise.all([
        this.getUserSettings(userId),
        prisma.savings.findMany({
          where: { clerkId: userId },
          orderBy: { createdAt: "asc" },
        }),
      ]);

      return {
        currency: userSettings?.currency || "USD",
        savings,
      };
    } catch (error) {
      console.error(
        `❌ Database Error in getAllSavings (userId: ${userId}):`,
        error
      );
      throw new DatabaseOperationError(
        `Failed to fetch savings: ${(error as Error).message}`
      );
    }
  }

  async deleteSavings(savingsId: number, userId: string): Promise<void> {
    if (!userId) {
      throw new UnauthenticatedError("Not authenticated");
    }

    try {
      await prisma.$transaction(async (tx) => {
        const savingExists = await tx.savings.findFirst({
          where: { id: savingsId, clerkId: userId },
        });

        if (!savingExists) {
          throw new NotFoundError("Saving not found or already deleted.");
        }

        await tx.savings.delete({ where: { id: savingsId } });

        await this.updateBudgetRules(tx, userId);
      });
    } catch (error) {
      console.error(
        `❌ Database Error in deleteSavings (userId: ${userId}, savingsId: ${savingsId}):`,
        error
      );
      throw new DatabaseOperationError(
        `Failed to delete savings: ${(error as Error).message}`
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
    const [budget, budgetRules, totalSavings] = await Promise.all([
      tx.budget.aggregate({
        where: { clerkId: userId },
        _sum: { amount: true },
      }),
      tx.budgetRule.findFirst({ where: { clerkId: userId } }),
      tx.savings.groupBy({
        by: ["type"],
        where: { clerkId: userId },
        _sum: { budgetAmount: true },
      }),
    ]);

    if (!budget || !budgetRules) {
      throw new NotFoundError("Budget or budget rules not found.");
    }

    const totalBudget = budget._sum.amount ?? 0;
    const totalSaving =
      totalSavings.find((t: { type: string }) => t.type === "saving")?._sum
        ?.budgetAmount ?? 0;
    const totalInvest =
      totalSavings.find((t: { type: string }) => t.type === "invest")?._sum
        ?.budgetAmount ?? 0;
    const total = totalSaving + totalInvest;
    const savingsPercentage = totalBudget > 0 ? (total / totalBudget) * 100 : 0;

    await tx.budgetRule.upsert({
      where: { id: budgetRules.id },
      update: { actualSavingsPercentage: savingsPercentage },
      create: {
        needsPercentage: 50,
        savingsPercentage: 30,
        wantsPercentage: 20,
        actualNeedsPercentage: 0,
        actualSavingsPercentage: savingsPercentage,
        actualWantsPercentage: 0,
        clerkId: userId,
      },
    });
  }
}
