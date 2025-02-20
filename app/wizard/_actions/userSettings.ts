"use server";

import { DEFAULT_BUDGET_RULES } from "@/constants";
import prisma from "@/prisma/prisma";
import { UserData } from "@/schema/user";
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

export async function createUser(user: UserData) {
  try {
    if (!user) {
      throw new Error("User not found or not authenticated.");
    }

    const newUser = await createOrUpdateUser(user);
    await createOrUpdateBudgetRule(user.clerkId);
    return newUser;
  } catch (error) {
    console.error("Failed to create user:", error);
    throw error;
  }
}

async function createOrUpdateUser(user: UserData) {
  return await prisma.user.upsert({
    where: { clerkId: user.clerkId },
    update: {},
    create: {
      clerkId: user.clerkId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      photo: user.photo,
    },
  });
}

async function createOrUpdateBudgetRule(clerkId: string) {
  return await prisma.budgetRule.upsert({
    where: { clerkId },
    update: {},
    create: {
      ...DEFAULT_BUDGET_RULES,
      clerkId,
    },
  });
}

export async function deleteUser(clerkId: string) {
  try {
    await prisma.$transaction(async (prisma) => {
      // await prisma.budget.deleteMany({ where: { clerkId} });
      await prisma.budgetRule.deleteMany({ where: { clerkId } });
      //await prisma.userSettings.deleteMany({ where: { clerkId } });
      await prisma.user.delete({ where: { clerkId } });
    });

    console.log("User and associated data deleted successfully.");
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
}

export async function updateUser(user: UserData) {
  try {
    if (!user && user) {
      throw new Error("User not found or not authenticated.");
    }
    const updatedUser = await prisma.user.update({
      where: { clerkId: user.clerkId },
      data: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        photo: user.photo,
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Failed to update user:", error);
    throw error;
  }
}
