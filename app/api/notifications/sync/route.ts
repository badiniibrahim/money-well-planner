import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { notifications } = await request.json();

    if (!notifications || !Array.isArray(notifications)) {
      return NextResponse.json(
        { error: "Format de données invalide" },
        { status: 400 }
      );
    }

    // Récupérer les IDs des notifications existantes
    const existingNotifications = await prisma.notification.findMany({
      where: { clerkId: userId },
      select: { uniqueId: true, read: true },
    });

    const existingIds = new Map(
      existingNotifications.map((n) => [n.uniqueId, n.read])
    );

    // Créer un ensemble pour suivre les IDs traités
    const processedIds = new Set();

    // Traiter chaque notification
    for (const notification of notifications) {
      // Ajouter le clerkId à chaque notification
      notification.clerkId = userId;

      // Marquer cet ID comme traité
      processedIds.add(notification.uniqueId);

      // Vérifier si la notification existe déjà
      if (existingIds.has(notification.uniqueId)) {
        // Préserver l'état "lu" pour les notifications existantes
        notification.read = existingIds.get(notification.uniqueId);

        // Mettre à jour la notification existante
        await prisma.notification.updateMany({
          where: { uniqueId: notification.uniqueId, clerkId: userId },
          data: {
            title: notification.title,
            message: notification.message,
            type: notification.type,
            iconType: notification.iconType,
            priority: notification.priority,
            expiresAt: notification.expiresAt,
            actionLabel: notification.actionLabel,
            actionRoute: notification.actionRoute,
            category: notification.category,
            read: notification.read,
            updatedAt: new Date(),
          },
        });
      } else {
        // Créer une nouvelle notification
        await prisma.notification.create({
          data: {
            uniqueId: notification.uniqueId,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            timestamp: notification.timestamp || new Date(),
            iconType: notification.iconType,
            read: notification.read || false,
            priority: notification.priority,
            expiresAt: notification.expiresAt,
            actionLabel: notification.actionLabel,
            actionRoute: notification.actionRoute,
            category: notification.category,
            clerkId: userId,
          },
        });
      }
    }

    // Supprimer les notifications expirées
    await prisma.notification.deleteMany({
      where: {
        clerkId: userId,
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      "Erreur lors de la synchronisation des notifications:",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
