"use server";

import { ApplicationContainer } from "@/di/container";
import { GetStateUseCase } from "@/src/application/use-cases/dashboard/get-state.use-case";
import { State } from "@/src/entities/models/dashboard/state";

export async function getState(): Promise<State> {
  try {
    const getStateUseCase = ApplicationContainer.get(GetStateUseCase);
    return await getStateUseCase.execute();
  } catch (error) {
    console.error("CreateIncome Error:", error);
    throw new Error("Failed to create income");
  }
}
