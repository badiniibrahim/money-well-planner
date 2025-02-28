"use server";

import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getAllCategories() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const categories = await prisma.category.findMany({
      where: {
        clerkId: userId,
      },
      include: {
        budgets: true,
        expenses: true,
        transactions: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

export async function createCategory(data: {
  name: string;
  type: string;
  icon?: string;
  color?: string;
}) {
  try {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    const category = await prisma.category.create({
      data: {
        ...data,
        clerkId: userId,
      },
    });

    revalidatePath("/categories");
    return category;
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }
}

export async function deleteCategory(id: number) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await prisma.category.delete({
      where: {
        id,
        clerkId: userId,
      },
    });

    revalidatePath("/categories");
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }
}
