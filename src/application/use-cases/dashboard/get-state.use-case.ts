import { injectable, inject } from "inversify";
import { DI_SYMBOLS } from "@/di/types";
import { auth } from "@clerk/nextjs/server";
import { Budget } from "@prisma/client";
import { UnauthenticatedError } from "@/src/entities/auth";
import type { IDashboardRepository } from "../../repositories/dashboard.repository.interface";
import { State } from "@/src/entities/models/dashboard/state";

@injectable()
export class GetStateUseCase {
  constructor(
    @inject(DI_SYMBOLS.IDashboardRepository)
    private dashboardRepository: IDashboardRepository
  ) {}

  async execute(): Promise<State> {
    const { userId } = await auth();
    if (!userId) {
      throw new UnauthenticatedError("User not authenticated");
    }

    return await this.dashboardRepository.getState(userId);
  }
}
