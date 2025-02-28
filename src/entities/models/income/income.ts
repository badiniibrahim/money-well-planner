import { z } from "zod";

export const IncomeSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  amount: z.coerce.number().min(0.01, "Le montant doit être supérieur à 0"),
  date: z.date().default(() => new Date()),
  categoryId: z.number().optional(),
  type: z.string().default("budget"),
});

export type IncomeSchemaType = z.infer<typeof IncomeSchema>;
