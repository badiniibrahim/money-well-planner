"use server";

import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getUserSettings() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const [settings, budgetRules] = await Promise.all([
      prisma.userSettings.findUnique({
        where: {
          clerkId: userId,
        },
      }),
      prisma.budgetRule.findFirst({
        where: {
          clerkId: userId,
        },
      }),
    ]);

    return {
      ...settings,
      budgetRules,
    };
  } catch (error) {
    console.error("Error fetching user settings:", error);
    throw new Error("Failed to fetch user settings");
  }
}

export async function updateUserSettings(data: {
  currency: string;
  language: string;
  theme: string;
  emailNotifications: boolean;
  budgetAlerts: boolean;
  weeklyReports: boolean;
}) {
  try {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    const settings = await prisma.userSettings.upsert({
      where: {
        clerkId: userId,
      },
      update: data,
      create: {
        ...data,
        clerkId: userId,
      },
    });

    revalidatePath("/settings");
    return settings;
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw new Error("Failed to update user settings");
  }
}

export async function updateBudgetRules(data: {
  needsPercentage: number;
  savingsPercentage: number;
  wantsPercentage: number;
}) {
  try {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    const budgetRules = await prisma.budgetRule.upsert({
      where: {
        clerkId: userId,
      },
      update: data,
      create: {
        ...data,
        actualNeedsPercentage: 0,
        actualSavingsPercentage: 0,
        actualWantsPercentage: 0,
        clerkId: userId,
      },
    });

    revalidatePath("/settings");
    revalidatePath("/income");
    return budgetRules;
  } catch (error) {
    console.error("Error updating budget rules:", error);
    throw new Error("Failed to update budget rules");
  }
}
