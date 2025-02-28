import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs/server";

// Supprimer une notification spécifique
export async function DELETE(
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

    // Supprimer la notification
    await prisma.notification.deleteMany({
      where: {
        uniqueId: id,
        clerkId: userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression de la notification:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
