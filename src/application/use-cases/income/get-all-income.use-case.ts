import { injectable, inject } from "inversify";
import { DI_SYMBOLS } from "@/di/types";
import type { IIncomeRepository } from "../../repositories/income.repository.interface";
import { auth } from "@clerk/nextjs/server";
import { Budget } from "@prisma/client";
import { UnauthenticatedError } from "@/src/entities/auth";

@injectable()
export class GetAllIncomeUseCase {
  constructor(
    @inject(DI_SYMBOLS.IIncomeRepository)
    private incomeRepository: IIncomeRepository
  ) {}

  async execute(): Promise<{ currency: string; incomes: Budget[] }> {
    const { userId } = await auth();
    if (!userId) {
      throw new UnauthenticatedError("User not authenticated");
    }

    return await this.incomeRepository.getAllIncome(userId);
  }
}
