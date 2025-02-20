import prisma from "@/prisma/prisma";
import { IDashboardRepository } from "@/src/application/repositories/dashboard.repository.interface";
import { UnauthenticatedError } from "@/src/entities/auth";
import { DatabaseOperationError } from "@/src/entities/errors/common";
import { injectable } from "inversify";

@injectable()
export class DashboardRepository implements IDashboardRepository {
  async getState(userId: string): Promise<State> {
    if (!userId) {
      throw new UnauthenticatedError("Not authenticated");
    }

    try {
      const [userSettings, budgetAggregate] = await Promise.all([
        prisma.userSettings.findUnique({ where: { clerkId: userId } }),
        prisma.budget.aggregate({
          where: { clerkId: userId },
          _sum: { amount: true },
        }),
      ]);

      const currency = userSettings?.currency || "USD";
      const totalBudget = budgetAggregate._sum.amount ?? 0;

      return { totalBudget, currency };
    } catch (error) {
      console.error("Error fetching dashboard state:", error);
      throw new DatabaseOperationError(
        `Failed to fetch dashboard state: ${(error as Error).message}`
      );
    }
  }
}
