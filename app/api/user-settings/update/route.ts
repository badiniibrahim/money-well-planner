import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { UpdateUserCurrencySchema } from "@/schema/userSettings";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = UpdateUserCurrencySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error },
        { status: 400 }
      );
    }

    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    const updatedSettings = await prisma.userSettings.update({
      where: { clerkId: user.id },
      data: { currency: parsed.data.currency },
    });

    return NextResponse.json(updatedSettings, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
