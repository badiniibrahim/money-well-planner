import prisma from "@/prisma/prisma";
import { IPleasureRepository } from "@/src/application/repositories/pleasures.repository.interface";
import { UnauthenticatedError } from "@/src/entities/auth";
import {
  DatabaseOperationError,
  InputParseError,
  NotFoundError,
} from "@/src/entities/errors/common";
import {
  PleasuresSchema,
  PleasuresType,
} from "@/src/entities/models/pleasures/pleasures";
import { Pleasure } from "@prisma/client";
import { injectable } from "inversify";

@injectable()
export class CreatePleasureRepository implements IPleasureRepository {
  async createPleasure(form: PleasuresType, userId: string): Promise<Pleasure> {
    if (!userId) {
      throw new UnauthenticatedError("Not authenticated");
    }

    const {
      success,
      data,
      error: inputParseError,
    } = PleasuresSchema.safeParse(form);
    if (!success) {
      throw new InputParseError("Invalid data", { cause: inputParseError });
    }

    try {
      return await prisma.$transaction(async (tx) => {
        const userExists = await this.checkUserExists(tx, userId);
        if (!userExists) {
          throw new NotFoundError("User not found.");
        }

        const pleasure = await tx.pleasure.create({
          data: {
            clerkId: userId,
            ...data,
          },
        });

        await this.updateBudgetRules(tx, userId);

        return pleasure;
      });
    } catch (error) {
      console.error(
        `❌ Database Error in createPleasure (userId: ${userId}):`,
        error
      );
      throw new DatabaseOperationError(
        `Failed to create pleasure: ${(error as Error).message}`
      );
    }
  }

  async getAllPleasure(
    userId: string
  ): Promise<{ currency: string; pleasure: Pleasure[] }> {
    if (!userId) {
      throw new UnauthenticatedError("Not authenticated");
    }

    try {
      const [userSettings, pleasure] = await Promise.all([
        this.getUserSettings(userId),
        prisma.pleasure.findMany({
          where: { clerkId: userId },
          orderBy: { createdAt: "asc" },
        }),
      ]);

      return {
        currency: userSettings?.currency || "USD",
        pleasure,
      };
    } catch (error) {
      console.error(
        `❌ Database Error in getAllPleasure (userId: ${userId}):`,
        error
      );
      throw new DatabaseOperationError(
        `Failed to fetch pleasures: ${(error as Error).message}`
      );
    }
  }

  async deletePleasure(pleasureId: number, userId: string): Promise<void> {
    if (!userId) {
      throw new UnauthenticatedError("Not authenticated");
    }

    try {
      await prisma.$transaction(async (tx) => {
        const pleasureExists = await tx.pleasure.findFirst({
          where: { id: pleasureId, clerkId: userId },
        });

        if (!pleasureExists) {
          throw new NotFoundError("Pleasure not found or already deleted.");
        }

        await tx.pleasure.delete({ where: { id: pleasureId } });

        await this.updateBudgetRules(tx, userId);
      });
    } catch (error) {
      console.error(
        `❌ Database Error in deletePleasure (userId: ${userId}, pleasureId: ${pleasureId}):`,
        error
      );
      throw new DatabaseOperationError(
        `Failed to delete pleasure: ${(error as Error).message}`
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
    try {
      const [budget, budgetRules, totalPleasure] = await Promise.all([
        tx.budget.aggregate({
          where: { clerkId: userId },
          _sum: { amount: true },
        }),
        tx.budgetRule.findFirst({ where: { clerkId: userId } }),
        tx.pleasure.aggregate({
          where: { clerkId: userId },
          _sum: { budgetAmount: true },
        }),
      ]);

      if (!budget || !budgetRules) {
        throw new NotFoundError("Budget or budget rules not found.");
      }

      const totalBudget = budget._sum.amount ?? 0;
      const totalPleasureAmount = totalPleasure?._sum?.budgetAmount ?? 0;

      const pleasurePercentage =
        totalBudget > 0 ? (totalPleasureAmount / totalBudget) * 100 : 0;

      await tx.budgetRule.upsert({
        where: { id: budgetRules.id },
        update: {
          actualWantsPercentage: pleasurePercentage,
        },
        create: {
          needsPercentage: 50,
          savingsPercentage: 30,
          wantsPercentage: 20,
          actualNeedsPercentage: 0,
          actualSavingsPercentage: 0,
          actualWantsPercentage: pleasurePercentage,
          clerkId: userId,
        },
      });
    } catch (error) {
      console.error(
        `❌ Database Error in updateBudgetRules (userId: ${userId}):`,
        error
      );
      throw new DatabaseOperationError(
        `Failed to update budget rules: ${(error as Error).message}`
      );
    }
  }
}
