import { IDashboardRepository } from "@/src/application/repositories/dashboard.repository.interface";
import type { IIncomeRepository } from "@/src/application/repositories/income.repository.interface";
import { GetStateUseCase } from "@/src/application/use-cases/dashboard/get-state.use-case";
import { CreateIncomeUseCase } from "@/src/application/use-cases/income/create-income.use-case";
import { DeleteIncomeUseCase } from "@/src/application/use-cases/income/delete-income.use-case";
import { GetAllIncomeUseCase } from "@/src/application/use-cases/income/get-all-income.use-case";

export const DI_SYMBOLS = {
  // Repositories
  IIncomeRepository: Symbol.for("IIncomeRepository"),
  IDashboardRepository: Symbol.for("IDashboardRepository"),

  // Use Cases
  CreateIncomeUseCase: Symbol.for("CreateIncomeUseCase"),
  DeleteIncomeUseCase: Symbol.for("DeleteIncomeUseCase"),
  GetAllIncomeUseCase: Symbol.for("GetAllIncomeUseCase"),
  GetStateUseCase: Symbol.for("GetStateUseCase"),
};

export interface DI_RETURN_TYPES {
  IIncomeRepository: IIncomeRepository;
  IDashboardRepository: IDashboardRepository;

  CreateIncomeUseCase: CreateIncomeUseCase;
  DeleteIncomeUseCase: DeleteIncomeUseCase;
  GetAllIncomeUseCase: GetAllIncomeUseCase;
  GetStateUseCase: GetStateUseCase;
}
