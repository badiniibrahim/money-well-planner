import { ContainerModule, interfaces } from "inversify";
import { DI_SYMBOLS } from "../types";
import { GetAllSavingsUseCase } from "@/src/application/use-cases/savings/get-all-savings.use-case";
import { DeleteSavingsUseCase } from "@/src/application/use-cases/savings/delete-savings.use-case";
import { CreateSavingsCase } from "@/src/application/use-cases/savings/create-savings.use-case";
import { ISavingsRepository } from "@/src/application/repositories/savings.repository.interface";
import { CreateSavingsRepository } from "@/src/infrastructure/repositories/savings.repository";

export const SavingsModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<ISavingsRepository>(DI_SYMBOLS.ISavingsRepository).to(
    CreateSavingsRepository
  );
  bind(CreateSavingsCase).toSelf();
  bind(DeleteSavingsUseCase).toSelf();
  bind(GetAllSavingsUseCase).toSelf();
});
