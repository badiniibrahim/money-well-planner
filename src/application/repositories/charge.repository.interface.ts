import { ExpensesType } from "@/src/entities/models/charges/expense";
import { Expense } from "@prisma/client";

export interface IChargeRepository {
  createExpense(form: ExpensesType, userId: string): Promise<Expense>;
  getAllExpense(
    userId: string
  ): Promise<{ currency: string; expense: Expense[] }>;
  deleteCharge(chargeId: number, userId: string): Promise<void>;
}
