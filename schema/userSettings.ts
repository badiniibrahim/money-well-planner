import { z } from "zod";
import { Currencies } from "@/constants";

export const UpdateUserCurrencySchema = z.object({
  currency: z.custom((value) => {
    const found = Currencies.some((c) => c.value === value);
    if (!found) {
      throw new Error(`invalid currency: ${value}`);
    }
    return value;
  }),
});
