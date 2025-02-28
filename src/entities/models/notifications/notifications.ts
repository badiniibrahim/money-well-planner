import { z } from "zod";

export const NotificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  type: z.enum(["info", "warning", "success", "error"]),
  read: z.boolean().default(false),
});

export type NotificationType = z.infer<typeof NotificationSchema>;
