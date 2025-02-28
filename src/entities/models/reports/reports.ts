import { z } from "zod";

export const ReportSchema = z.object({
  type: z.enum(["income", "expense", "savings", "overview"]),
  startDate: z.date(),
  endDate: z.date(),
  format: z.enum(["daily", "weekly", "monthly", "yearly"]),
  categories: z.array(z.number()).optional(),
});

export type ReportType = z.infer<typeof ReportSchema>;
