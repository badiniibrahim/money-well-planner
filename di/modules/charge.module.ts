import { ContainerModule, interfaces } from "inversify";
import { DI_SYMBOLS } from "../types";
import { CreateExpenseUseCase } from "@/src/application/use-cases/charges/create-expense.use-case";
import { IChargeRepository } from "@/src/application/repositories/charge.repository.interface";
import { CreateChargeRepository } from "@/src/infrastructure/repositories/charge.repository";
import { DeleteExpenseUseCase } from "@/src/application/use-cases/charges/delete-expense.use-case";
import { GetAllChargeUseCase } from "@/src/application/use-cases/charges/get-all-charge.use-case";

export const ChargeModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<IChargeRepository>(DI_SYMBOLS.IChargeRepository).to(
    CreateChargeRepository
  );

  bind(CreateExpenseUseCase).toSelf();
  bind(DeleteExpenseUseCase).toSelf();
  bind(GetAllChargeUseCase).toSelf();
});
