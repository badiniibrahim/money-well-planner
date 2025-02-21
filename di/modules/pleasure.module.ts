import { ContainerModule, interfaces } from "inversify";
import { DI_SYMBOLS } from "../types";
import { GetAllPleasureUseCase } from "@/src/application/use-cases/pleasures/get-all-income.use-case";
import { DeletePleasureUseCase } from "@/src/application/use-cases/pleasures/delete-income.use-case";
import { CreatePleasureCase } from "@/src/application/use-cases/pleasures/create-income.use-case";
import { IPleasureRepository } from "@/src/application/repositories/pleasures.repository.interface";
import { CreatePleasureRepository } from "@/src/infrastructure/repositories/pleasures.repository";

export const PleasureModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<IPleasureRepository>(DI_SYMBOLS.IPleasureRepository).to(
    CreatePleasureRepository
  );
  bind(CreatePleasureCase).toSelf();
  bind(DeletePleasureUseCase).toSelf();
  bind(GetAllPleasureUseCase).toSelf();
});
