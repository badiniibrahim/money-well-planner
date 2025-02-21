import { injectable, inject } from "inversify";
import { DI_SYMBOLS } from "@/di/types";
import { auth } from "@clerk/nextjs/server";
import { Budget, Expense } from "@prisma/client";
import { UnauthenticatedError } from "@/src/entities/auth";
import type { IChargeRepository } from "../../repositories/charge.repository.interface";

@injectable()
export class GetAllChargeUseCase {
  constructor(
    @inject(DI_SYMBOLS.IChargeRepository)
    private incomeRepository: IChargeRepository
  ) {}

  async execute(): Promise<{ currency: string; expense: Expense[] }> {
    const { userId } = await auth();
    if (!userId) {
      throw new UnauthenticatedError("User not authenticated");
    }
    return await this.incomeRepository.getAllExpense(userId);
  }
}
