import prisma from "@/prisma/prisma";
import { IDashboardRepository } from "@/src/application/repositories/dashboard.repository.interface";
import { UnauthenticatedError } from "@/src/entities/auth";
import { DatabaseOperationError } from "@/src/entities/errors/common";
import { State } from "@/src/entities/models/dashboard/state";
import { injectable } from "inversify";

@injectable()
export class DashboardRepository implements IDashboardRepository {
  async getState(userId: string): Promise<State> {
    if (!userId) {
      throw new UnauthenticatedError("Not authenticated");
    }

    try {
      const [userSettings, budgetAggregate, expenseData, budgetRules] =
        await Promise.all([
          this.getUserSettings(userId),
          this.getTotalBudget(userId),
          this.getExpenseData(userId),
          this.getBudgetRules(userId),
        ]);

      const currency = userSettings?.currency || "USD";
      const totalBudget = budgetAggregate._sum.amount ?? 0;
      const totalFixed = this.getSumByType(expenseData, "fixed");
      const totalVariable = this.getSumByType(expenseData, "variable");
      const remainsBudget = totalBudget - totalFixed - totalVariable;

      if (!budgetRules) {
        throw new DatabaseOperationError("Budget rules not found");
      }
      return {
        totalBudget,
        currency,
        totalFixed,
        totalVariable,
        budgetRules,
        remainsBudget,
      };
    } catch (error) {
      console.error(`❌ Error in getState (userId: ${userId}):`, error);
      throw new DatabaseOperationError(
        `Failed to fetch dashboard state: ${(error as Error).message}`
      );
    }
  }

  private async getUserSettings(userId: string) {
    return prisma.userSettings.findUnique({ where: { clerkId: userId } });
  }

  private async getTotalBudget(userId: string) {
    return prisma.budget.aggregate({
      where: { clerkId: userId },
      _sum: { amount: true },
    });
  }

  private async getExpenseData(userId: string) {
    return prisma.expense.groupBy({
      by: ["type"],
      where: { clerkId: userId },
      _sum: { budgetAmount: true },
      orderBy: { type: "asc" },
    });
  }

  private async getBudgetRules(userId: string) {
    return prisma.budgetRule.findFirst({ where: { clerkId: userId } });
  }

  private getSumByType(data: any[], type: string): number {
    return data.find((item) => item.type === type)?._sum?.budgetAmount ?? 0;
  }
}
