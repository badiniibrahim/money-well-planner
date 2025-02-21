"use server";

import { ApplicationContainer } from "@/di/container";
import { CreatePleasureCase } from "@/src/application/use-cases/pleasures/create-income.use-case";
import { DeletePleasureUseCase } from "@/src/application/use-cases/pleasures/delete-income.use-case";
import { GetAllPleasureUseCase } from "@/src/application/use-cases/pleasures/get-all-income.use-case";
import { PleasuresType } from "@/src/entities/models/pleasures/pleasures";
import { Pleasure } from "@prisma/client";

export async function createPleasure(form: PleasuresType) {
  try {
    const createPleasureCase = ApplicationContainer.get(CreatePleasureCase);
    await createPleasureCase.execute(form);
  } catch (error) {
    console.error("CreatePleasure Error:", error);
    throw new Error("Failed to create expense");
  }
}

export async function deletePleasure(debtsId: number) {
  try {
    const createPleasureCase = ApplicationContainer.get(DeletePleasureUseCase);
    await createPleasureCase.execute(debtsId);
  } catch (error) {
    console.error("DeletePleasure Error:", error);
    throw new Error("Failed to delete expense");
  }
}

export async function getAllPleasure(): Promise<{
  currency: string;
  pleasure: Pleasure[];
}> {
  try {
    const createPleasureCase = ApplicationContainer.get(GetAllPleasureUseCase);
    return await createPleasureCase.execute();
  } catch (error) {
    console.error("Get all charge Error:", error);
    throw new Error("Failed to get all expense");
  }
}
