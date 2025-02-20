import { IncomeSchemaType } from "@/src/entities/models/income/income";
import { Budget } from "@prisma/client";

export interface IIncomeRepository {
  createIncome(form: IncomeSchemaType, userId: string): Promise<Budget>;
  getAllIncome(
    userId: string
  ): Promise<{ currency: string; incomes: Budget[] }>;
  deleteIncome(incomeId: number, userId: string): Promise<void>;
}
