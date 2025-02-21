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
        const result = await tx.expense.create({
          data: {
            ...data,
            dueDate: data.dueDate ? new Date(data.dueDate) : new Date(),
            user: { connect: { clerkId: userId } },
          },
        });

        if (!result) {
          throw new NotFoundError("Failed to create expense.");
        }

        await this.updateBudgetRules(tx, userId);
        return result;
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
        prisma.userSettings.findUnique({ where: { clerkId: userId } }),
        prisma.expense.findMany({
          where: { clerkId: userId },
          orderBy: { createdAt: "asc" },
        }),
      ]);

      return { currency: userSettings?.currency || "USD", expense: expenses };
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
        const deletedExpense = await tx.expense.deleteMany({
          where: { id: chargeId, clerkId: userId },
        });

        if (deletedExpense.count === 0) {
          throw new NotFoundError("Expense not found or already deleted.");
        }

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

  private async updateBudgetRules(tx: any, userId: string): Promise<void> {
    const [budget, budgetRules, totalExpenses] = await Promise.all([
      tx.budget.aggregate({
        where: { clerkId: userId },
        _sum: { amount: true },
      }),
      tx.budgetRule.findFirst({ where: { clerkId: userId } }),
      tx.expense.groupBy({
        by: ["type"],
        where: { clerkId: userId },
        _sum: { budgetAmount: true },
        orderBy: { type: "asc" },
      }),
    ]);

    if (!budget || !budgetRules) {
      throw new NotFoundError("Budget or budget rules not found.");
    }

    const totalBudget = budget._sum.amount ?? 0;
    const totalFixed =
      totalExpenses.find((t: { type: string }) => t.type === "fixed")?._sum
        ?.budgetAmount ?? 0;
    const totalVariable =
      totalExpenses.find((t: { type: string }) => t.type === "variable")?._sum
        ?.budgetAmount ?? 0;
    const totalExpense = totalFixed + totalVariable;
    const needsPercentage =
      totalBudget > 0 ? (totalExpense / totalBudget) * 100 : 0;

    await tx.budgetRule.upsert({
      where: { id: budgetRules.id },
      update: { actualNeedsPercentage: needsPercentage },
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
