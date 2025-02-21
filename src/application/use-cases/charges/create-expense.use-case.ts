import { injectable, inject } from "inversify";
import { DI_SYMBOLS } from "@/di/types";
import { auth } from "@clerk/nextjs/server";
import { Expense } from "@prisma/client";
import { UnauthenticatedError } from "@/src/entities/auth";
import type { IChargeRepository } from "../../repositories/charge.repository.interface";
import { ExpensesType } from "@/src/entities/models/charges/expense";

@injectable()
export class CreateExpenseUseCase {
  constructor(
    @inject(DI_SYMBOLS.IChargeRepository)
    private chargeRepository: IChargeRepository
  ) {}

  async execute(form: ExpensesType): Promise<Expense> {
    const { userId } = await auth();
    if (!userId) {
      throw new UnauthenticatedError("User not authenticated");
    }

    return await this.chargeRepository.createExpense(form, userId);
  }
}
