import prisma from "@/prisma/prisma";
import { IChargeRepository } from "@/src/application/repositories/charge.repository.interface";
import { UnauthenticatedError } from "@/src/entities/auth";
import {
  DatabaseOperationError,
  InputParseError,
  NotFoundError,
} from "@/src/entities/errors/common";
import {
  ExpensesSchema,
  ExpensesType,
} from "@/src/entities/models/charges/expense";
import { Expense } from "@prisma/client";
import { injectable } from "inversify";

@injectable()
export class CreateChargeRepository implements IChargeRepository {
  async createExpense(form: ExpensesType, userId: string): Promise<Expense> {
    if (!userId) {
      throw new UnauthenticatedError("Not authenticated");
    }

    const {
      success,
      data,
      error: inputParseError,
    } = ExpensesSchema.safeParse(form);
    if (!success) {
      throw new InputParseError("Invalid data", { cause: inputParseError });
    }

    try {
      return await prisma.$transaction(async (tx) => {
        const expense = await tx.expense.create({
          data: {
            ...data,
            dueDate: data.dueDate ? new Date(data.dueDate) : new Date(),
            user: { connect: { clerkId: userId } },
          },
        });

        if (!expense) {
          throw new NotFoundError("Failed to create expense.");
        }

        await this.updateBudgetRules(tx, userId);

        return expense;
      });
    } catch (error) {
      console.error(
        `❌ Database Error in createExpense (userId: ${userId}):`,
        error
      );
      throw new DatabaseOperationError(
        `Failed to create expense: ${(error as Error).message}`
      );
    }
  }

  async getAllExpense(
    userId: string
  ): Promise<{ currency: string; expense: Expense[] }> {
    if (!userId) {
      throw new UnauthenticatedError("Not authenticated");
    }

    try {
      const [userSettings, expenses] = await Promise.all([
        this.getUserSettings(userId),
        prisma.expense.findMany({
          where: { clerkId: userId },
          orderBy: { createdAt: "asc" },
        }),
      ]);

      const totalExpenses = expenses.reduce(
        (sum, exp) => sum + exp.budgetAmount,
        0
      );
      const categorySummary = expenses.reduce((acc, exp) => {
        acc[exp.type] = (acc[exp.type] || 0) + exp.budgetAmount;
        return acc;
      }, {} as Record<string, number>);

      // ✅ Identifier la catégorie dominante
      const sortedCategories = Object.entries(categorySummary).sort(
        (a, b) => b[1] - a[1]
      );
      const topCategory = sortedCategories[0]
        ? sortedCategories[0][0]
        : "inconnue";
      const topCategoryAmount = sortedCategories[0]
        ? sortedCategories[0][1]
        : 0;

      console.log({
        totalExpenses,
        categorySummary,
        sortedCategories,
        topCategory,
        topCategoryAmount,
      });
      return {
        currency: userSettings?.currency || "USD",
        expense: expenses,
      };
    } catch (error) {
      console.error(
        `❌ Database Error in getAllExpense (userId: ${userId}):`,
        error
      );
      throw new DatabaseOperationError(
        `Failed to fetch expenses: ${(error as Error).message}`
      );
    }
  }

  async deleteCharge(chargeId: number, userId: string): Promise<void> {
    if (!userId) {
      throw new UnauthenticatedError("Not authenticated");
    }

    try {
      await prisma.$transaction(async (tx) => {
        const chargeExists = await tx.expense.findFirst({
          where: { id: chargeId, clerkId: userId },
        });

        if (!chargeExists) {
          throw new NotFoundError("Expense not found or already deleted.");
        }

        await tx.expense.delete({ where: { id: chargeId } });

        await this.updateBudgetRules(tx, userId);
      });
    } catch (error) {
      console.error(
        `❌ Database Error in deleteCharge (userId: ${userId}, chargeId: ${chargeId}):`,
        error
      );
      throw new DatabaseOperationError(
        `Failed to delete charge: ${(error as Error).message}`
      );
    }
  }

  private async getUserSettings(userId: string) {
    return prisma.userSettings.findUnique({ where: { clerkId: userId } });
  }

  private async updateBudgetRules(tx: any, userId: string): Promise<void> {
    try {
      const [budget, budgetRules, totalExpenses, totalSavings] =
        await Promise.all([
          tx.budget.aggregate({
            where: { clerkId: userId },
            _sum: { amount: true },
          }),
          tx.budgetRule.findFirst({ where: { clerkId: userId } }),
          tx.expense.groupBy({
            by: ["type"],
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

      const totalBudget = budget._sum.amount ?? 0;
      const totalFixed = this.getSumByType(totalExpenses, "fixed");
      const totalVariable = this.getSumByType(totalExpenses, "variable");
      const totalSaving = this.getSumByType(totalSavings, "saving");
      const totalInvest = this.getSumByType(totalSavings, "invest");

      const totalExpensesAmount = totalFixed + totalVariable;
      const needsPercentage =
        totalBudget > 0 ? (totalExpensesAmount / totalBudget) * 100 : 0;
      const savingsPercentage =
        totalBudget > 0 ? ((totalSaving + totalInvest) / totalBudget) * 100 : 0;

      await tx.budgetRule.upsert({
        where: { id: budgetRules.id },
        update: {
          actualNeedsPercentage: needsPercentage,
          // actualSavingsPercentage: savingsPercentage,
        },
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
