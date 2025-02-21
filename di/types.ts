import { IDashboardRepository } from "@/src/application/repositories/dashboard.repository.interface";
import { IDebtsRepository } from "@/src/application/repositories/debts.repository.interface";
import type { IIncomeRepository } from "@/src/application/repositories/income.repository.interface";
import { CreateExpenseUseCase } from "@/src/application/use-cases/charges/create-expense.use-case";
import { DeleteExpenseUseCase } from "@/src/application/use-cases/charges/delete-expense.use-case";
import { GetAllChargeUseCase } from "@/src/application/use-cases/charges/get-all-charge.use-case";
import { GetStateUseCase } from "@/src/application/use-cases/dashboard/get-state.use-case";
import { CreateDebtsCase } from "@/src/application/use-cases/debts/create-debts.use-case";
import { DeleteDebtsUseCase } from "@/src/application/use-cases/debts/delete-debts.use-case";
import { GetAllIDebtsUseCase } from "@/src/application/use-cases/debts/get-all-debts.use-case";
import { CreateIncomeUseCase } from "@/src/application/use-cases/income/create-income.use-case";
import { DeleteIncomeUseCase } from "@/src/application/use-cases/income/delete-income.use-case";
import { GetAllIncomeUseCase } from "@/src/application/use-cases/income/get-all-income.use-case";

export const DI_SYMBOLS = {
  // Repositories
  IIncomeRepository: Symbol.for("IIncomeRepository"),
  IDashboardRepository: Symbol.for("IDashboardRepository"),
  IChargeRepository: Symbol.for("IChargeRepository"),
  IDebtsRepository: Symbol.for("IDebtsRepository"),

  // Use Cases
  CreateIncomeUseCase: Symbol.for("CreateIncomeUseCase"),
  DeleteIncomeUseCase: Symbol.for("DeleteIncomeUseCase"),
  GetAllIncomeUseCase: Symbol.for("GetAllIncomeUseCase"),

  GetStateUseCase: Symbol.for("GetStateUseCase"),

  CreateExpenseUseCase: Symbol.for("CreateExpenseUseCase"),
  DeleteExpenseUseCase: Symbol.for("DeleteExpenseUseCase"),
  GetAllChargeUseCase: Symbol.for("GetAllChargeUseCase"),

  GetAllIDebtsUseCase: Symbol.for("GetAllIDebtsUseCase"),
  CreateDebtsCase: Symbol.for("CreateDebtsCase"),
  DeleteDebtsUseCase: Symbol.for("DeleteDebtsUseCase"),
};

export interface DI_RETURN_TYPES {
  IIncomeRepository: IIncomeRepository;
  IDashboardRepository: IDashboardRepository;
  IDebtsRepository: IDebtsRepository;

  CreateIncomeUseCase: CreateIncomeUseCase;
  DeleteIncomeUseCase: DeleteIncomeUseCase;
  GetAllIncomeUseCase: GetAllIncomeUseCase;

  GetStateUseCase: GetStateUseCase;

  CreateExpenseUseCase: CreateExpenseUseCase;
  GetAllChargeUseCase: GetAllChargeUseCase;
  DeleteExpenseUseCase: DeleteExpenseUseCase;

  GetAllIDebtsUseCase: GetAllIDebtsUseCase;
  CreateDebtsCase: CreateDebtsCase;
  DeleteDebtsUseCase: DeleteDebtsUseCase;
}
