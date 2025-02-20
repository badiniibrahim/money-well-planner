import { ContainerModule, interfaces } from "inversify";
import { DI_SYMBOLS } from "../types";
import { IIncomeRepository } from "@/src/application/repositories/income.repository.interface";
import { CreateIncomeRepository } from "@/src/infrastructure/repositories/createIncome.repository";
import { CreateIncomeUseCase } from "@/src/application/use-cases/income/create-income.use-case";
import { DeleteIncomeUseCase } from "@/src/application/use-cases/income/delete-income.use-case";
import { GetAllIncomeUseCase } from "@/src/application/use-cases/income/get-all-income.use-case";

export const IncomeModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<IIncomeRepository>(DI_SYMBOLS.IIncomeRepository).to(
    CreateIncomeRepository
  );
  bind(CreateIncomeUseCase).toSelf();
  bind(DeleteIncomeUseCase).toSelf();
  bind(GetAllIncomeUseCase).toSelf();
});
