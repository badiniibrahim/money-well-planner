import {
  BudgetRule,
  Budget,
  Expense,
  Debts,
  Savings,
  Pleasure,
  FinancialGoal,
} from "@prisma/client";

export interface State {
  totalBudget: number;
  currency: string;
  totalFixed: number;
  totalVariable: number;
  budgetRules?: BudgetRule;
  remainsBudget: number;
  totalDebt: number;
  totalSavings: number; // Renommé de "savings" à "totalSavings" pour éviter le conflit
  totalPleasure: number;

  // Données brutes de la base de données
  budgets: Budget[];
  expenses: Expense[];
  debts: Debts[];
  savings: Savings[]; // Conflit avec la propriété "savings" ci-dessus
  pleasures: Pleasure[];
  financialGoals?: FinancialGoal[];
}
