import { injectable, inject } from "inversify";
import { DI_SYMBOLS } from "@/di/types";
import type { IIncomeRepository } from "../../repositories/income.repository.interface";
import { auth } from "@clerk/nextjs/server";
import { Budget } from "@prisma/client";
import { UnauthenticatedError } from "@/src/entities/auth";

@injectable()
export class CreateIncomeUseCase {
  constructor(
    @inject(DI_SYMBOLS.IIncomeRepository)
    private incomeRepository: IIncomeRepository
  ) {}

  async execute(input: { name: string; amount: number }): Promise<Budget> {
    const { userId } = await auth();
    if (!userId) {
      throw new UnauthenticatedError("User not authenticated");
    }

    return await this.incomeRepository.createIncome(input, userId);
  }
}
