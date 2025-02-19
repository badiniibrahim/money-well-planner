import { Currencies } from "@/constants";

export function GetFormatterForCurrency(currency: string) {
  const locale = Currencies.find((c) => c.value === currency)?.locale;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });
}
