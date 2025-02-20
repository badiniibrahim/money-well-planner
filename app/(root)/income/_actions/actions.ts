"use server";

import { ApplicationContainer } from "@/di/container";
import { CreateIncomeUseCase } from "@/src/application/use-cases/income/create-income.use-case";
import { DeleteIncomeUseCase } from "@/src/application/use-cases/income/delete-income.use-case";
import { GetAllIncomeUseCase } from "@/src/application/use-cases/income/get-all-income.use-case";
import { IncomeSchemaType } from "@/src/entities/models/income/income";
import { Budget } from "@prisma/client";

export async function createIncome(form: IncomeSchemaType) {
  try {
    const createIncomeUseCase = ApplicationContainer.get(CreateIncomeUseCase);
    await createIncomeUseCase.execute(form);
  } catch (error) {
    console.error("CreateIncome Error:", error);
    throw new Error("Failed to create income");
  }
}

export async function deleteIncome(incomeId: number) {
  try {
    const deleteIncomeUseCase = ApplicationContainer.get(DeleteIncomeUseCase);
    await deleteIncomeUseCase.execute(incomeId);
  } catch (error) {
    console.error("DeleteIncome Error:", error);
    throw new Error("Failed to delete income");
  }
}

export async function getAllIncome(): Promise<{
  currency: string;
  incomes: Budget[];
}> {
  try {
    const getAllIncomeUseCase = ApplicationContainer.get(GetAllIncomeUseCase);
    return await getAllIncomeUseCase.execute();
  } catch (error) {
    console.error("Get all Income Error:", error);
    throw new Error("Failed to get all income");
  }
}
