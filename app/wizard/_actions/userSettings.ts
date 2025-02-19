"user server";

import { DEFAULT_BUDGET_RULES } from "@/constants";
import prisma from "@/prisma/prisma";
import { UpdateUserCurrencySchema } from "@/schema/userSettings";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function updateUserCurrency(currency: string) {
  const parserBody = UpdateUserCurrencySchema.safeParse({ currency });

  if (!parserBody.success) {
    throw parserBody.error;
  }

  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }

  const userSettings = await prisma.userSettings.update({
    where: {
      clerkId: user.id,
    },
    data: {
      currency: currency,
    },
  });

  return userSettings;
}

export async function createUser(user: any) {
  try {
    const email = user.primaryEmailAddress?.emailAddress ?? "";
    const fullName = user.fullName ?? "";

    if (!email || !fullName) {
      throw new Error("User email or full name is missing.");
    }

    await prisma.$transaction(async (prisma) => {
      const newUser = await createOrUpdateUser(user.id, email, fullName);
      await createOrUpdateBudgetRule(newUser.id, user.id);
    });
  } catch (error) {
    console.error("Failed to create user:", error);
    throw error;
  }
}

async function createOrUpdateUser(
  clerkId: string,
  email: string,
  fullName: string
) {
  return await prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: {
      clerkId,
      email,
      name: fullName,
    },
  });
}

async function createOrUpdateBudgetRule(userId: number, clerkId: string) {
  return await prisma.budgetRule.upsert({
    where: { clerkId },
    update: {},
    create: {
      ...DEFAULT_BUDGET_RULES,
      clerkId,
    },
  });
}

export async function deleteUser(id: string) {
  try {
    await prisma.$transaction(async (prisma) => {
      await prisma.budget.deleteMany({ where: { clerkId: id } });
      await prisma.budgetRule.deleteMany({ where: { clerkId: id } });
      await prisma.userSettings.deleteMany({ where: { clerkId: id } });
      await prisma.user.delete({ where: { clerkId: id } });
    });

    console.log("User and associated data deleted successfully.");
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
}

export async function updateUser(id: string, user: any) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      throw new Error("User not found or not authenticated.");
    }

    const updatedUser = await prisma.user.update({
      where: { clerkId: user.id },
      data: {
        email: "",
        name: "",
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Failed to update user:", error);
    throw error;
  }
}
