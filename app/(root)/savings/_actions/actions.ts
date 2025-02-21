"use server";

import { ApplicationContainer } from "@/di/container";
import { CreateSavingsCase } from "@/src/application/use-cases/savings/create-savings.use-case";
import { DeleteSavingsUseCase } from "@/src/application/use-cases/savings/delete-savings.use-case";
import { GetAllSavingsUseCase } from "@/src/application/use-cases/savings/get-all-savings.use-case";
import { SavingsType } from "@/src/entities/models/savings/savings";
import { Savings } from "@prisma/client";

export async function createSavings(form: SavingsType) {
  try {
    const createSavingsCase = ApplicationContainer.get(CreateSavingsCase);
    await createSavingsCase.execute(form);
  } catch (error) {
    console.error("CreateSavings Error:", error);
    throw new Error("Failed to create expense");
  }
}

export async function deleteSavings(savingsId: number) {
  try {
    const deleteSavingsUseCase = ApplicationContainer.get(DeleteSavingsUseCase);
    await deleteSavingsUseCase.execute(savingsId);
  } catch (error) {
    console.error("DeleteSavings Error:", error);
    throw new Error("Failed to delete expense");
  }
}

export async function getAllSavings(): Promise<{
  currency: string;
  savings: Savings[];
}> {
  try {
    const getAllSavingsUseCase = ApplicationContainer.get(GetAllSavingsUseCase);
    return await getAllSavingsUseCase.execute();
  } catch (error) {
    console.error("Get all charge Error:", error);
    throw new Error("Failed to get all expense");
  }
}
