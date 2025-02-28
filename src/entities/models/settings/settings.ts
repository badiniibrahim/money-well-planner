import { z } from "zod";

export const UserSettingsSchema = z.object({
  currency: z.string().min(1, "Currency is required"),
  language: z.string().default("en"),
  theme: z.enum(["light", "dark"]).default("dark"),
  emailNotifications: z.boolean().default(true),
  budgetAlerts: z.boolean().default(true),
  weeklyReports: z.boolean().default(true),
});

export type UserSettingsType = z.infer<typeof UserSettingsSchema>;
