import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs/server";

// Marquer toutes les notifications comme lues
export async function PUT() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Vérifier si l'utilisateur a des notifications
    const notificationsCount = await prisma.notification.count({
      where: {
        clerkId: userId,
        read: false,
      },
    });

    if (notificationsCount === 0) {
      return NextResponse.json({
        success: true,
        message: "Aucune notification à marquer comme lue",
      });
    }

    // Mettre à jour toutes les notifications
    await prisma.notification.updateMany({
      where: {
        clerkId: userId,
        read: false,
      },
      data: {
        read: true,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, count: notificationsCount });
  } catch (error) {
    console.error(
      "Erreur lors du marquage de toutes les notifications comme lues:",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
