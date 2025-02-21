import { injectable, inject } from "inversify";
import { DI_SYMBOLS } from "@/di/types";
import { auth } from "@clerk/nextjs/server";
import { Budget, Debts } from "@prisma/client";
import { UnauthenticatedError } from "@/src/entities/auth";
import type { IDebtsRepository } from "../../repositories/debts.repository.interface";
import { DebtsType } from "@/src/entities/models/debts/debts";

@injectable()
export class CreateDebtsCase {
  constructor(
    @inject(DI_SYMBOLS.IDebtsRepository)
    private debtsRepository: IDebtsRepository
  ) {}

  async execute(input: DebtsType): Promise<Debts> {
    const { userId } = await auth();
    if (!userId) {
      throw new UnauthenticatedError("User not authenticated");
    }

    return await this.debtsRepository.createDebts(input, userId);
  }
}
