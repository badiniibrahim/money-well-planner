"use server";

import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getAllGoals() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const goals = await prisma.financialGoal.findMany({
      where: {
        clerkId: userId,
      },
      include: {
        milestones: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return goals;
  } catch (error) {
    console.error("Error fetching goals:", error);
    throw new Error("Failed to fetch goals");
  }
}

export async function createGoal(data: {
  name: string;
  targetAmount: number;
  targetDate: Date;
  description?: string;
  priority: string;
}) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const goal = await prisma.financialGoal.create({
      data: {
        ...data,
        clerkId: userId,
      },
    });

    revalidatePath("/goals");
    return goal;
  } catch (error) {
    console.error("Error creating goal:", error);
    throw new Error("Failed to create goal");
  }
}

export async function updateGoalProgress(
  goalId: number,
  currentAmount: number
) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const goal = await prisma.financialGoal.update({
      where: {
        id: goalId,
        clerkId: userId,
      },
      data: {
        currentAmount,
      },
    });

    revalidatePath("/goals");
    return goal;
  } catch (error) {
    console.error("Error updating goal progress:", error);
    throw new Error("Failed to update goal progress");
  }
}

export async function deleteGoal(goalId: number) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await prisma.financialGoal.delete({
      where: {
        id: goalId,
        clerkId: userId,
      },
    });

    revalidatePath("/goals");
  } catch (error) {
    console.error("Error deleting goal:", error);
    throw new Error("Failed to delete goal");
  }
}
