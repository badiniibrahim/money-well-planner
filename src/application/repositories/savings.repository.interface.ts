import { SavingsType } from "@/src/entities/models/savings/savings";
import { Savings } from "@prisma/client";

export interface ISavingsRepository {
  createSavings(form: SavingsType, userId: string): Promise<Savings>;
  getAllSavings(
    userId: string
  ): Promise<{ currency: string; savings: Savings[] }>;
  deleteSavings(savingsId: number, userId: string): Promise<void>;
}
