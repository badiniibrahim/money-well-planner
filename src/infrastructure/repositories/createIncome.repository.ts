import prisma from "@/prisma/prisma";
import { injectable } from "inversify";
import { IIncomeRepository } from "@/src/application/repositories/income.repository.interface";
import {
  IncomeSchema,
  IncomeSchemaType,
} from "@/src/entities/models/income/income";
import { Budget, BudgetRule } from "@prisma/client";
import {
  DatabaseOperationError,
  InputParseError,
  NotFoundError,
} from "@/src/entities/errors/common";
import { UnauthenticatedError } from "@/src/entities/auth";

@injectable()
export class CreateIncomeRepository implements IIncomeRepository {
  async createIncome(form: IncomeSchemaType, userId: string): Promise<Budget> {
    if (!userId) {
      throw new UnauthenticatedError("Not authenticated");
    }

    const {
      success,
      data,
      error: inputParseError,
    } = IncomeSchema.safeParse(form);
    if (!success) {
      throw new InputParseError("Invalid data", { cause: inputParseError });
    }

    try {
      return await prisma.$transaction(async (tx) => {
        const userExists = await this.checkUserExists(tx, userId);
        if (!userExists) {
          throw new NotFoundError("User not found.");
        }

        const income = await tx.budget.create({
          data: {
            ...data,
            user: {
              connect: { clerkId: userId },
            },
          },
        });

        if (!income) {
          throw new NotFoundError("Failed to create income.");
        }

        await this.updateBudgetRules(userId);

        return income;
      });
    } catch (error) {
      console.error(
        `❌ Database Error in createIncome (userId: ${userId}):`,
        error
      );
      throw new DatabaseOperationError(
        `Failed to create income: ${(error as Error).message}`
      );
    }
  }

  async updateIncome(
    incomeId: number,
    form: IncomeSchemaType,
    userId: string
  ): Promise<Budget> {
    if (!userId) {
      throw new UnauthenticatedError("Not authenticated");
    }

    const {
      success,
      data,
      error: inputParseError,
    } = IncomeSchema.safeParse(form);
    if (!success) {
      throw new InputParseError("Invalid data", { cause: inputParseError });
    }

    try {
      return await prisma.$transaction(async (tx) => {
        const incomeExists = await tx.budget.findFirst({
          where: { id: incomeId, clerkId: userId },
        });

        if (!incomeExists) {
          throw new NotFoundError("Income not found.");
        }

        const updatedIncome = await tx.budget.update({
          where: { id: incomeId },
          data: {
            ...data,
          },
        });

        if (!updatedIncome) {
          throw new NotFoundError("Failed to update income.");
        }

        await this.updateBudgetRules(userId);

        return updatedIncome;
      });
    } catch (error) {
      console.error(
        `❌ Database Error in updateIncome (userId: ${userId}, incomeId: ${incomeId}):`,
        error
      );
      throw new DatabaseOperationError(
        `Failed to update income: ${(error as Error).message}`
      );
    }
  }

  async getIncomeById(
    incomeId: number,
    userId: string
  ): Promise<Budget | null> {
    if (!userId) {
      throw new UnauthenticatedError("Not authenticated");
    }

    try {
      const income = await prisma.budget.findFirst({
        where: { id: incomeId, clerkId: userId },
      });

      return income;
    } catch (error) {
      console.error(
        `❌ Database Error in getIncomeById (userId: ${userId}, incomeId: ${incomeId}):`,
        error
      );
      throw new DatabaseOperationError(
        `Failed to fetch income: ${(error as Error).message}`
      );
    }
  }

  async getAllIncome(userId: string): Promise<{
    currency: string;
    incomes: Budget[];
    budgetRules?: BudgetRule;
  }> {
    if (!userId) {
      throw new UnauthenticatedError("Not authenticated");
    }

    try {
      const [userSettings, incomes, budgetRules] = await Promise.all([
        this.getUserSettings(userId),
        prisma.budget.findMany({
          where: { clerkId: userId },
          orderBy: { createdAt: "desc" },
        }),
        prisma.budgetRule.findFirst({
          where: { clerkId: userId },
        }),
      ]);

      await this.updateBudgetRules(userId);

      return {
        currency: userSettings?.currency || "USD",
        incomes,
        budgetRules: budgetRules || undefined,
      };
    } catch (error) {
      console.error(
        `❌ Database Error in getAllIncome (userId: ${userId}):`,
        error
      );
      throw new DatabaseOperationError(
        `Failed to fetch incomes: ${(error as Error).message}`
      );
    }
  }

  async deleteIncome(incomeId: number, userId: string): Promise<void> {
    if (!userId) {
      throw new UnauthenticatedError("Not authenticated");
    }

    try {
      await prisma.$transaction(async (tx) => {
        const incomeExists = await tx.budget.findFirst({
          where: { id: incomeId, clerkId: userId },
        });

        if (!incomeExists) {
          throw new NotFoundError("Income not found or already deleted.");
        }

        await tx.budget.delete({ where: { id: incomeId } });

        await this.updateBudgetRules(userId);
      });
    } catch (error) {
      console.error(
        `❌ Database Error in deleteIncome (userId: ${userId}, incomeId: ${incomeId}):`,
        error
      );
      throw new DatabaseOperationError(
        `Failed to delete income: ${(error as Error).message}`
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

  private async updateBudgetRules(userId: string): Promise<void> {
    try {
      const [
        budget,
        budgetRules,
        totalFixedExpenses,
        totalSavings,
        totalPleasures,
        totalDebts,
      ] = await prisma.$transaction([
        prisma.budget.aggregate({
          where: { clerkId: userId },
          _sum: { amount: true },
        }),
        prisma.budgetRule.findFirst({ where: { clerkId: userId } }),
        prisma.expense.groupBy({
          by: ["type"],
          where: { clerkId: userId },
          orderBy: { type: "asc" },
          _sum: { budgetAmount: true },
        }),
        prisma.savings.groupBy({
          by: ["type"],
          where: { clerkId: userId },
          orderBy: { type: "asc" },
          _sum: { budgetAmount: true },
        }),
        prisma.pleasure.aggregate({
          where: { clerkId: userId },
          _sum: { budgetAmount: true },
        }),
        prisma.debts.aggregate({
          where: { clerkId: userId },
          _sum: { budgetAmount: true },
        }),
      ]);

      if (!budgetRules) {
        // Create default budget rules if they don't exist
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
        return;
      }

      const totalBudget = budget._sum.amount ?? 0;
      const totalPleasure = totalPleasures?._sum?.budgetAmount ?? 0;
      const totalDebt = totalDebts?._sum?.budgetAmount ?? 0;

      const totalFixed = this.getSumByType(totalFixedExpenses, "fixed");
      const totalVariable = this.getSumByType(totalFixedExpenses, "variable");
      const totalSaving = this.getSumByType(totalSavings, "saving");
      const totalInvest = this.getSumByType(totalSavings, "invest");

      const totalExpenses =
        totalFixed + totalVariable + totalDebt + totalSaving + totalInvest;
      const needsPercentage = totalBudget
        ? (totalExpenses / totalBudget) * 100
        : 0;
      const savingsPercentage = totalBudget
        ? ((totalSaving + totalInvest + totalDebt) / totalBudget) * 100
        : 0;
      const wantsPercentage = totalBudget
        ? (totalPleasure / totalBudget) * 100
        : 0;

      await prisma.budgetRule.update({
        where: { id: budgetRules.id },
        data: {
          actualNeedsPercentage: needsPercentage,
          actualSavingsPercentage: savingsPercentage,
          actualWantsPercentage: wantsPercentage,
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

  private getSumByType(data: any[], type: string): number {
    return data?.find((item) => item.type === type)?._sum?.budgetAmount ?? 0;
  }
}
