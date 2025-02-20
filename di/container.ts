import { Container } from "inversify";
import { DI_SYMBOLS } from "./types";
import { IncomeModule } from "./modules/income.module";

const ApplicationContainer = new Container({
  defaultScope: "Singleton",
});

export const initializeContainer = () => {
  try {
    if (!ApplicationContainer.isBound(DI_SYMBOLS.IIncomeRepository)) {
      ApplicationContainer.load(IncomeModule);
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
