import prisma from "@/prisma/prisma";
import { injectable } from "inversify";
import { IIncomeRepository } from "@/src/application/repositories/income.repository.interface";
import {
  IncomeSchema,
  IncomeSchemaType,
} from "@/src/entities/models/income/income";
import { Budget } from "@prisma/client";
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

  async getAllIncome(
    userId: string
  ): Promise<{ currency: string; incomes: Budget[] }> {
    if (!userId) {
      throw new UnauthenticatedError("Not authenticated");
    }

    try {
      const [userSettings, incomes] = await Promise.all([
        prisma.userSettings.findUnique({ where: { clerkId: userId } }),
        prisma.budget.findMany({
          where: { clerkId: userId },
          orderBy: { createdAt: "asc" },
        }),
      ]);

      return {
        currency: userSettings?.currency || "USD",
        incomes,
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

  private async checkUserExists(tx: any, userId: string): Promise<boolean> {
    const user = await tx.user.findUnique({ where: { clerkId: userId } });
    return !!user;
  }
}
