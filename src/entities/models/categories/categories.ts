import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["income", "expense", "savings", "investment", "debt"]),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export type CategoryType = z.infer<typeof CategorySchema>;
