import { z } from "zod";

export const ExpensesSchema = z.object({
  budgetAmount: z.coerce.number().positive().multipleOf(0.01),
  name: z.string(),
  dueDate: z.coerce.date().optional(),
  type: z.union([z.literal("variable"), z.literal("fixed")]),
});

export type ExpensesType = z.infer<typeof ExpensesSchema>;
