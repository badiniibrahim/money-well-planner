import { injectable, inject } from "inversify";
import { DI_SYMBOLS } from "@/di/types";
import type { IIncomeRepository } from "../../repositories/income.repository.interface";
import { auth } from "@clerk/nextjs/server";
import { UnauthenticatedError } from "@/src/entities/auth";

@injectable()
export class DeleteIncomeUseCase {
  constructor(
    @inject(DI_SYMBOLS.IIncomeRepository)
    private incomeRepository: IIncomeRepository
  ) {}

  async execute(incomeId: number) {
    const { userId } = await auth();
    if (!userId) {
      throw new UnauthenticatedError("User not authenticated");
    }
    await this.incomeRepository.deleteIncome(incomeId, userId);
  }
}
