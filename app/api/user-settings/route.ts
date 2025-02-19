import prisma from "@/prisma/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (existingUser) {
    const userSettings = await prisma.userSettings.findUnique({
      where: {
        id: existingUser.id,
      },
    });
    if (!userSettings) {
      await prisma.userSettings.create({
        data: {
          id: existingUser.id,
          currency: "USD",
          clerkId: existingUser.clerkId,
        },
      });
    }
    revalidatePath("/");
    return Response.json(userSettings);
  }
}
