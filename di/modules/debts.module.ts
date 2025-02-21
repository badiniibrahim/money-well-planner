import { ContainerModule, interfaces } from "inversify";
import { DI_SYMBOLS } from "../types";
import { CreateDebtsCase } from "@/src/application/use-cases/debts/create-debts.use-case";
import { DeleteDebtsUseCase } from "@/src/application/use-cases/debts/delete-debts.use-case";
import { GetAllIDebtsUseCase } from "@/src/application/use-cases/debts/get-all-debts.use-case";
import { IDebtsRepository } from "@/src/application/repositories/debts.repository.interface";
import { CreateDebtsRepository } from "@/src/infrastructure/repositories/debts.repository";

export const DebtsModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<IDebtsRepository>(DI_SYMBOLS.IDebtsRepository).to(CreateDebtsRepository);
  bind(CreateDebtsCase).toSelf();
  bind(DeleteDebtsUseCase).toSelf();
  bind(GetAllIDebtsUseCase).toSelf();
});
