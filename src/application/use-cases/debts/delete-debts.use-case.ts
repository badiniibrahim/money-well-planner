import { injectable, inject } from "inversify";
import { DI_SYMBOLS } from "@/di/types";
import { auth } from "@clerk/nextjs/server";
import { UnauthenticatedError } from "@/src/entities/auth";
import type { IDebtsRepository } from "../../repositories/debts.repository.interface";

@injectable()
export class DeleteDebtsUseCase {
  constructor(
    @inject(DI_SYMBOLS.IDebtsRepository)
    private debtsRepository: IDebtsRepository
  ) {}

  async execute(debtsId: number) {
    const { userId } = await auth();
    if (!userId) {
      throw new UnauthenticatedError("User not authenticated");
    }
    await this.debtsRepository.deleteDebts(debtsId, userId);
  }
}
