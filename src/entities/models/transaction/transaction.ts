import { z } from "zod";

export const TransactionSchema = z.object({
  amount: z.number().min(0, "Amount must be positive"),
  type: z.enum(["income", "expense", "transfer"]),
  description: z.string().optional(),
  date: z.date(),
  categoryId: z.number().optional(),
});

export type TransactionType = z.infer<typeof TransactionSchema>;
