import { z } from "zod";

export const GoalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  targetAmount: z.number().min(0, "Target amount must be positive"),
  targetDate: z.date().min(new Date(), "Target date must be in the future"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
});

export type GoalType = z.infer<typeof GoalSchema>;

export const MilestoneSchema = z.object({
  name: z.string().min(1, "Name is required"),
  targetAmount: z.number().min(0, "Target amount must be positive"),
  targetDate: z.date().min(new Date(), "Target date must be in the future"),
});

export type MilestoneType = z.infer<typeof MilestoneSchema>;
