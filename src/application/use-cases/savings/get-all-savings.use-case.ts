import { injectable, inject } from "inversify";
import { DI_SYMBOLS } from "@/di/types";
import { auth } from "@clerk/nextjs/server";
import { Savings } from "@prisma/client";
import { UnauthenticatedError } from "@/src/entities/auth";
import type { ISavingsRepository } from "../../repositories/savings.repository.interface";

@injectable()
export class GetAllSavingsUseCase {
  constructor(
    @inject(DI_SYMBOLS.ISavingsRepository)
    private savingsRepository: ISavingsRepository
  ) {}

  async execute(): Promise<{ currency: string; savings: Savings[] }> {
    const { userId } = await auth();
    if (!userId) {
      throw new UnauthenticatedError("User not authenticated");
    }
    return await this.savingsRepository.getAllSavings(userId);
  }
}
