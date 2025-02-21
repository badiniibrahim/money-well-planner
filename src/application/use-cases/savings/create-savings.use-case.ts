import { injectable, inject } from "inversify";
import { DI_SYMBOLS } from "@/di/types";
import { auth } from "@clerk/nextjs/server";
import { Savings } from "@prisma/client";
import { UnauthenticatedError } from "@/src/entities/auth";
import type { ISavingsRepository } from "../../repositories/savings.repository.interface";
import { SavingsType } from "@/src/entities/models/savings/savings";

@injectable()
export class CreateSavingsCase {
  constructor(
    @inject(DI_SYMBOLS.ISavingsRepository)
    private savingsRepository: ISavingsRepository
  ) {}

  async execute(input: SavingsType): Promise<Savings> {
    const { userId } = await auth();
    if (!userId) {
      throw new UnauthenticatedError("User not authenticated");
    }

    return await this.savingsRepository.createSavings(input, userId);
  }
}
