import { IDashboardRepository } from "@/src/application/repositories/dashboard.repository.interface";
import type { IIncomeRepository } from "@/src/application/repositories/income.repository.interface";
import { CreateExpenseUseCase } from "@/src/application/use-cases/charges/create-expense.use-case";
import { DeleteExpenseUseCase } from "@/src/application/use-cases/charges/delete-expense.use-case";
import { GetAllChargeUseCase } from "@/src/application/use-cases/charges/get-all-charge.use-case";
import { GetStateUseCase } from "@/src/application/use-cases/dashboard/get-state.use-case";
import { CreateIncomeUseCase } from "@/src/application/use-cases/income/create-income.use-case";
import { DeleteIncomeUseCase } from "@/src/application/use-cases/income/delete-income.use-case";
import { GetAllIncomeUseCase } from "@/src/application/use-cases/income/get-all-income.use-case";

export const DI_SYMBOLS = {
  // Repositories
  IIncomeRepository: Symbol.for("IIncomeRepository"),
  IDashboardRepository: Symbol.for("IDashboardRepository"),
  IChargeRepository: Symbol.for("IChargeRepository"),

  // Use Cases
  CreateIncomeUseCase: Symbol.for("CreateIncomeUseCase"),
  DeleteIncomeUseCase: Symbol.for("DeleteIncomeUseCase"),
  GetAllIncomeUseCase: Symbol.for("GetAllIncomeUseCase"),

  GetStateUseCase: Symbol.for("GetStateUseCase"),

  CreateExpenseUseCase: Symbol.for("CreateExpenseUseCase"),
  DeleteExpenseUseCase: Symbol.for("DeleteExpenseUseCase"),
  GetAllChargeUseCase: Symbol.for("GetAllChargeUseCase"),
};

export interface DI_RETURN_TYPES {
  IIncomeRepository: IIncomeRepository;
  IDashboardRepository: IDashboardRepository;

  CreateIncomeUseCase: CreateIncomeUseCase;
  DeleteIncomeUseCase: DeleteIncomeUseCase;
  GetAllIncomeUseCase: GetAllIncomeUseCase;

  GetStateUseCase: GetStateUseCase;

  CreateExpenseUseCase: CreateExpenseUseCase;
  GetAllChargeUseCase: GetAllChargeUseCase;
  DeleteExpenseUseCase: DeleteExpenseUseCase;
}
