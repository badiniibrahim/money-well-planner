import { z } from "zod";

export const IncomeSchema = z.object({
  amount: z.coerce.number().positive().multipleOf(0.01),
  name: z.string(),
});

export type IncomeSchemaType = z.infer<typeof IncomeSchema>;
