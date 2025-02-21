import { DebtsType } from "@/src/entities/models/debts/debts";
import { Debts } from "@prisma/client";

export interface IDebtsRepository {
  createDebts(form: DebtsType, userId: string): Promise<Debts>;
  getAllDebts(userId: string): Promise<{ currency: string; debts: Debts[] }>;
  deleteDebts(debtsId: number, userId: string): Promise<void>;
}
