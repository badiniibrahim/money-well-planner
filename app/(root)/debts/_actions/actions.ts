"use server";

import { ApplicationContainer } from "@/di/container";
import { CreateDebtsCase } from "@/src/application/use-cases/debts/create-debts.use-case";
import { DeleteDebtsUseCase } from "@/src/application/use-cases/debts/delete-debts.use-case";
import { GetAllIDebtsUseCase } from "@/src/application/use-cases/debts/get-all-debts.use-case";
import { DebtsType } from "@/src/entities/models/debts/debts";
import { Debts } from "@prisma/client";

export async function createDebts(form: DebtsType) {
  try {
    const createDebtsCase = ApplicationContainer.get(CreateDebtsCase);
    await createDebtsCase.execute(form);
  } catch (error) {
    console.error("CreateCharge Error:", error);
    throw new Error("Failed to create expense");
  }
}

export async function deleteDebts(debtsId: number) {
  try {
    const deleteDebtsUseCase = ApplicationContainer.get(DeleteDebtsUseCase);
    await deleteDebtsUseCase.execute(debtsId);
  } catch (error) {
    console.error("DeleteCharge Error:", error);
    throw new Error("Failed to delete expense");
  }
}

export async function getAllDebts(): Promise<{
  currency: string;
  debts: Debts[];
}> {
  try {
    const getAllIDebtsUseCase = ApplicationContainer.get(GetAllIDebtsUseCase);
    return await getAllIDebtsUseCase.execute();
  } catch (error) {
    console.error("Get all charge Error:", error);
    throw new Error("Failed to get all expense");
  }
}
