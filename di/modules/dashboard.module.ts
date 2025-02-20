import { ContainerModule, interfaces } from "inversify";
import { DI_SYMBOLS } from "../types";
import { IDashboardRepository } from "@/src/application/repositories/dashboard.repository.interface";
import { DashboardRepository } from "@/src/infrastructure/repositories/dashboard.repository";
import { GetStateUseCase } from "@/src/application/use-cases/dashboard/get-state.use-case";

export const DashboardModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<IDashboardRepository>(DI_SYMBOLS.IDashboardRepository).to(
    DashboardRepository
  );
  bind(GetStateUseCase).toSelf();
});
