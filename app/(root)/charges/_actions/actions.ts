"use server";

import { ApplicationContainer } from "@/di/container";
import { CreateExpenseUseCase } from "@/src/application/use-cases/charges/create-expense.use-case";
import { DeleteExpenseUseCase } from "@/src/application/use-cases/charges/delete-expense.use-case";
import { GetAllChargeUseCase } from "@/src/application/use-cases/charges/get-all-charge.use-case";
import { ExpensesType } from "@/src/entities/models/charges/expense";
import { Expense } from "@prisma/client";

export async function createCharge(form: ExpensesType) {
  try {
    const createExpenseUseCase = ApplicationContainer.get(CreateExpenseUseCase);
    await createExpenseUseCase.execute(form);
  } catch (error) {
    console.error("CreateCharge Error:", error);
    throw new Error("Failed to create expense");
  }
}

export async function deleteCharge(chargeId: number) {
  try {
    const deleteExpenseUseCase = ApplicationContainer.get(DeleteExpenseUseCase);
    await deleteExpenseUseCase.execute(chargeId);
  } catch (error) {
    console.error("DeleteCharge Error:", error);
    throw new Error("Failed to delete expense");
  }
}

export async function getAllCharge(): Promise<{
  currency: string;
  expense: Expense[];
}> {
  try {
    const getAllChargeUseCase = ApplicationContainer.get(GetAllChargeUseCase);
    return await getAllChargeUseCase.execute();
  } catch (error) {
    console.error("Get all charge Error:", error);
    throw new Error("Failed to get all expense");
  }
}
