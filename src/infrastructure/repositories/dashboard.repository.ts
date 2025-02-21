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
      const [
        userSettings,
        budgetAggregate,
        expenseData,
        budgetRules,
        debtsAggregate,
        savingsData,
        pleasureData,
      ] = await prisma.$transaction(async (prisma) => {
        return Promise.all([
          this.getUserSettings(userId),
          this.getTotalBudget(userId),
          this.getExpenseData(userId),
          this.getBudgetRules(userId),
          this.getDebtsData(userId),
          this.getSavingsData(userId),
          this.getPleasureData(userId),
        ]);
      });

      const currency = userSettings?.currency || "USD";
      const totalBudget = budgetAggregate?._sum?.amount ?? 0;

      const totalFixed = this.getSumByType(expenseData, "fixed");
      const totalVariable = this.getSumByType(expenseData, "variable");

      const totalSaving = this.getSumByType(savingsData, "saving");
      const totalInvest = this.getSumByType(savingsData, "invest");

      const totalDebt = debtsAggregate?._sum?.budgetAmount ?? 0;

      const totalPleasure = pleasureData._sum.budgetAmount || 0;

      const totalExpenses =
        totalFixed +
        totalVariable +
        totalDebt +
        totalSaving +
        totalInvest +
        totalPleasure;
      const remainsBudget = Math.max(totalBudget - totalExpenses, 0); // Évite d'avoir un budget négatif

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
        totalDebt,
        savings: totalSaving + totalInvest,
        totalPleasure,
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
    });
  }

  private async getDebtsData(userId: string) {
    return prisma.debts.aggregate({
      where: { clerkId: userId },
      _sum: { budgetAmount: true },
    });
  }

  private async getSavingsData(userId: string) {
    return prisma.savings.groupBy({
      by: ["type"],
      where: { clerkId: userId },
      _sum: { budgetAmount: true },
    });
  }

  private async getPleasureData(userId: string) {
    return prisma.pleasure.aggregate({
      where: { clerkId: userId },
      _sum: { budgetAmount: true },
    });
  }

  private async getBudgetRules(userId: string) {
    return prisma.budgetRule.findFirst({ where: { clerkId: userId } });
  }

  private getSumByType(data: any[], type: string): number {
    return data?.find((item) => item.type === type)?._sum?.budgetAmount ?? 0;
  }
}
