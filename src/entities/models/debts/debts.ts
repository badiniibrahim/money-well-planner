import { z } from "zod";

export const DebtsSchema = z.object({
  budgetAmount: z.coerce.number().positive().multipleOf(0.01),
  duAmount: z.coerce.number().positive().multipleOf(0.01),
  name: z.string().min(3),
});

export type DebtsType = z.infer<typeof DebtsSchema>;
