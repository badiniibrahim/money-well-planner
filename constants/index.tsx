export const Currencies = [
  { value: "USD", label: "$ Dollar", locale: "en-US" },
  { value: "EUR", label: "€ Euro", locale: "de-DE" },
];

export type Currency = (typeof Currencies)[0];

export const DEFAULT_BUDGET_RULES = {
  needsPercentage: 50,
  savingsPercentage: 30,
  wantsPercentage: 20,
  actualNeedsPercentage: 0,
  actualSavingsPercentage: 0,
  actualWantsPercentage: 0,
};
