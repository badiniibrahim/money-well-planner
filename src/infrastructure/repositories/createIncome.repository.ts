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
    const {
      success,
      data,
      error: inputParseError,
    } = IncomeSchema.safeParse(form);

    if (!success) {
      throw new InputParseError("Invalid data", { cause: inputParseError });
    }

    if (!userId) {
      throw new UnauthenticatedError("Not authenticated");
    }

    try {
      return await prisma.$transaction(async (tx) => {
        const result = await tx.budget.create({
          data: {
            ...data,
            user: {
              connect: {
                clerkId: userId,
              },
            },
          },
        });

        if (!result) {
          throw new NotFoundError("Failed to create income.");
        }

        return result;
      });
    } catch (error) {
      console.error("Database Error:", error);
      throw new DatabaseOperationError(
        `Failed to create income: ${(error as Error).message}`
      );
    }
  }

  async getAllIncome(
    userId: string
  ): Promise<{ currency: string; incomes: Budget[] }> {
    const userSettings = await prisma.userSettings.findUnique({
      where: {
        clerkId: userId,
      },
    });

    const currency = userSettings?.currency || "USD";

    const incomes = await prisma.budget.findMany({
      where: { clerkId: userId },
      orderBy: { createdAt: "asc" },
    });

    return { currency, incomes };
  }

  async deleteIncome(incomeId: number, userId: string): Promise<void> {
    if (!userId) {
      throw new UnauthenticatedError("Not authenticated");
    }

    try {
      const deletedBudget = await prisma.budget.delete({
        where: {
          id: incomeId,
          clerkId: userId,
        },
      });
    } catch (error) {
      console.error("Database Error:", error);
      throw new DatabaseOperationError(
        `Failed to create income: ${(error as Error).message}`
      );
    }
  }
}
