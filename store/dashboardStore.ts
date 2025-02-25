import { State } from "@/src/entities/models/dashboard/state";
import { create } from "zustand";

const defaultState: State = {
  totalBudget: 0,
  currency: "USD",
  totalFixed: 0,
  totalVariable: 0,
  budgetRules: {
    id: 0,
    needsPercentage: 0,
    savingsPercentage: 0,
    wantsPercentage: 0,
    actualNeedsPercentage: 0,
    actualSavingsPercentage: 0,
    actualWantsPercentage: 0,
    clerkId: "",
  },
  remainsBudget: 0,
  totalDebt: 0,
  savings: 0,
  totalPleasure: 0,
};

interface DashboardStore {
  state: State;
  setState: (newState: any) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  state: defaultState,
  setState: (newState) => set({ state: newState }),
}));
