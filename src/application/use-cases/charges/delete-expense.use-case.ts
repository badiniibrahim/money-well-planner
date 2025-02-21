import { injectable, inject } from "inversify";
import { DI_SYMBOLS } from "@/di/types";
import { auth } from "@clerk/nextjs/server";
import { UnauthenticatedError } from "@/src/entities/auth";
import type { IChargeRepository } from "../../repositories/charge.repository.interface";

@injectable()
export class DeleteExpenseUseCase {
  constructor(
    @inject(DI_SYMBOLS.IChargeRepository)
    private incomeRepository: IChargeRepository
  ) {}

  async execute(chargeId: number) {
    const { userId } = await auth();
    if (!userId) {
      throw new UnauthenticatedError("User not authenticated");
    }
    await this.incomeRepository.deleteCharge(chargeId, userId);
  }
}
