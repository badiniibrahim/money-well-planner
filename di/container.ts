import { Container } from "inversify";
import { DI_SYMBOLS } from "./types";
import { IncomeModule } from "./modules/income.module";
import { DashboardModule } from "./modules/dashboard.module";
import { ChargeModule } from "./modules/charge.module";
import { DebtsModule } from "./modules/debts.module";
import { SavingsModule } from "./modules/savings.module";
import { PleasureModule } from "./modules/pleasure.module";

const ApplicationContainer = new Container({
  defaultScope: "Singleton",
});

export const initializeContainer = () => {
  try {
    if (!ApplicationContainer.isBound(DI_SYMBOLS.IIncomeRepository)) {
      ApplicationContainer.load(IncomeModule);
    }
    if (!ApplicationContainer.isBound(DI_SYMBOLS.IDashboardRepository)) {
      ApplicationContainer.load(DashboardModule);
    }

    if (!ApplicationContainer.isBound(DI_SYMBOLS.IChargeRepository)) {
      ApplicationContainer.load(ChargeModule);
    }

    if (!ApplicationContainer.isBound(DI_SYMBOLS.IDebtsRepository)) {
      ApplicationContainer.load(DebtsModule);
    }

    if (!ApplicationContainer.isBound(DI_SYMBOLS.ISavingsRepository)) {
      ApplicationContainer.load(SavingsModule);
    }

    if (!ApplicationContainer.isBound(DI_SYMBOLS.IPleasureRepository)) {
      ApplicationContainer.load(PleasureModule);
    }
  } catch (error) {
    console.error("InversifyJS Container Error:", error);
  }
};

initializeContainer();

export function getInjection<K extends keyof typeof DI_SYMBOLS>(symbol: K) {
  return ApplicationContainer.get(DI_SYMBOLS[symbol]);
}

export { ApplicationContainer };
