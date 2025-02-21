import { z } from "zod";

export const SavingsSchema = z.object({
  budgetAmount: z.coerce.number().positive().multipleOf(0.01),
  name: z.string(),
  type: z.union([z.literal("invest"), z.literal("saving")]),
});

export type SavingsType = z.infer<typeof SavingsSchema>;
