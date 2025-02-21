import { z } from "zod";

export const PleasuresSchema = z.object({
  budgetAmount: z.coerce.number().positive().multipleOf(0.01),
  name: z.string(),
});

export type PleasuresType = z.infer<typeof PleasuresSchema>;
