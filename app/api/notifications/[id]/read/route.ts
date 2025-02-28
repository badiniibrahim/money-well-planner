import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs/server";

// Marquer une notification comme lue
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;

    // Vérifier si la notification existe
    const notification = await prisma.notification.findFirst({
      where: {
        uniqueId: id,
        clerkId: userId,
      },
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Notification non trouvée" },
        { status: 404 }
      );
    }

    // Mettre à jour la notification
    await prisma.notification.updateMany({
      where: {
        uniqueId: id,
        clerkId: userId,
      },
      data: {
        read: true,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      "Erreur lors du marquage de la notification comme lue:",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
