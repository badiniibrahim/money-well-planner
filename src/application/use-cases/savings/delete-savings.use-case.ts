import { injectable, inject } from "inversify";
import { DI_SYMBOLS } from "@/di/types";
import { auth } from "@clerk/nextjs/server";
import { UnauthenticatedError } from "@/src/entities/auth";
import type { ISavingsRepository } from "../../repositories/savings.repository.interface";

@injectable()
export class DeleteSavingsUseCase {
  constructor(
    @inject(DI_SYMBOLS.ISavingsRepository)
    private savingsRepository: ISavingsRepository
  ) {}

  async execute(savingsId: number) {
    const { userId } = await auth();
    if (!userId) {
      throw new UnauthenticatedError("User not authenticated");
    }
    await this.savingsRepository.deleteSavings(savingsId, userId);
  }
}
