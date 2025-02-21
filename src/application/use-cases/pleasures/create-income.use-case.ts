import { injectable, inject } from "inversify";
import { DI_SYMBOLS } from "@/di/types";
import { auth } from "@clerk/nextjs/server";
import { Pleasure } from "@prisma/client";
import { UnauthenticatedError } from "@/src/entities/auth";
import type { IPleasureRepository } from "../../repositories/pleasures.repository.interface";
import { PleasuresType } from "@/src/entities/models/pleasures/pleasures";

@injectable()
export class CreatePleasureCase {
  constructor(
    @inject(DI_SYMBOLS.IPleasureRepository)
    private pleasureRepository: IPleasureRepository
  ) {}

  async execute(input: PleasuresType): Promise<Pleasure> {
    const { userId } = await auth();
    if (!userId) {
      throw new UnauthenticatedError("User not authenticated");
    }

    return await this.pleasureRepository.createPleasure(input, userId);
  }
}
