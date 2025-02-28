import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs/server";

// Récupérer toutes les notifications
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer toutes les notifications non expirées
    const notifications = await prisma.notification.findMany({
      where: {
        clerkId: userId,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      orderBy: [
        { priority: 'asc' },
        { timestamp: 'desc' }
      ]
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// Supprimer toutes les notifications
export async function DELETE() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Vérifier si l'utilisateur a des notifications
    const notificationsCount = await prisma.notification.count({
      where: { clerkId: userId }
    });

    if (notificationsCount === 0) {
      return NextResponse.json({ success: true, message: "Aucune notification à supprimer" });
    }

    // Supprimer toutes les notifications de l'utilisateur
    await prisma.notification.deleteMany({
      where: { clerkId: userId }
    });

    return NextResponse.json({ success: true, count: notificationsCount });
  } catch (error) {
    console.error("Erreur lors de la suppression des notifications:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}