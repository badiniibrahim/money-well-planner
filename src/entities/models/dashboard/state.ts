import { BudgetRule } from "@prisma/client";

export interface State {
  totalBudget: number;
  currency: string;
  totalFixed: number;
  totalVariable: number;
  budgetRules: BudgetRule;
  remainsBudget: number;
}
