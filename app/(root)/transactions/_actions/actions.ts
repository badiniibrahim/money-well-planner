"use server";

import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getAllTransactions() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const transactions = await prisma.transaction.findMany({
      where: {
        clerkId: userId,
      },
      include: {
        category: true,
        attachments: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    const categories = await prisma.category.findMany({
      where: {
        clerkId: userId,
      },
      select: {
        id: true,
        name: true,
        type: true,
      },
    });

    return { transactions, categories };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to fetch transactions");
  }
}

export async function createTransaction(data: {
  amount: number;
  type: string;
  description?: string;
  date: Date;
  categoryId?: number;
}) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const transaction = await prisma.transaction.create({
      data: {
        ...data,
        clerkId: userId,
      },
    });

    revalidatePath("/transactions");
    return transaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw new Error("Failed to create transaction");
  }
}

export async function deleteTransaction(id: number) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await prisma.transaction.delete({
      where: {
        id,
        clerkId: userId,
      },
    });

    revalidatePath("/transactions");
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw new Error("Failed to delete transaction");
  }
}
