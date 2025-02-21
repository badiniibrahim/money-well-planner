import { injectable, inject } from "inversify";
import { DI_SYMBOLS } from "@/di/types";
import { auth } from "@clerk/nextjs/server";
import { Debts } from "@prisma/client";
import { UnauthenticatedError } from "@/src/entities/auth";
import type { IDebtsRepository } from "../../repositories/debts.repository.interface";

@injectable()
export class GetAllIDebtsUseCase {
  constructor(
    @inject(DI_SYMBOLS.IDebtsRepository)
    private debtsRepository: IDebtsRepository
  ) {}

  async execute(): Promise<{ currency: string; debts: Debts[] }> {
    const { userId } = await auth();
    if (!userId) {
      throw new UnauthenticatedError("User not authenticated");
    }
    return await this.debtsRepository.getAllDebts(userId);
  }
}
