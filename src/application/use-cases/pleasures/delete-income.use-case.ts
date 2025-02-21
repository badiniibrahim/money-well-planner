import { injectable, inject } from "inversify";
import { DI_SYMBOLS } from "@/di/types";
import { auth } from "@clerk/nextjs/server";
import { UnauthenticatedError } from "@/src/entities/auth";
import type { IPleasureRepository } from "../../repositories/pleasures.repository.interface";

@injectable()
export class DeletePleasureUseCase {
  constructor(
    @inject(DI_SYMBOLS.IPleasureRepository)
    private pleasureRepository: IPleasureRepository
  ) {}

  async execute(pleasureId: number) {
    const { userId } = await auth();
    if (!userId) {
      throw new UnauthenticatedError("User not authenticated");
    }
    await this.pleasureRepository.deletePleasure(pleasureId, userId);
  }
}
