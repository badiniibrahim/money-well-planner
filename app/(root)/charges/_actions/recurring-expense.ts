"use server";

import { ApplicationContainer } from "@/di/container";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

// Schéma pour la validation des données
const recurringExpenseSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  budgetAmount: z.coerce.number().positive("Le montant doit être positif"),
  startDate: z.date(),
  frequency: z.enum(["weekly", "monthly", "quarterly", "yearly"]),
  categoryId: z.number().optional(),
});

type RecurringExpenseInput = z.infer<typeof recurringExpenseSchema>;

/**
 * Crée une dépense récurrente
 */
export async function createRecurringExpense(data: RecurringExpenseInput) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error(
      "Vous devez être connecté pour créer une dépense récurrente"
    );
  }

  try {
    // Valider les données d'entrée
    const validatedData = recurringExpenseSchema.parse(data);

    // Ici, vous pourriez appeler un use case spécifique pour les dépenses récurrentes
    // Pour l'instant, nous allons simuler la création d'une dépense récurrente

    // Calculer les dates futures en fonction de la fréquence
    const nextDates = generateNextDates(
      validatedData.startDate,
      validatedData.frequency,
      6 // Générer les 6 prochaines occurrences
    );

    // Créer la dépense récurrente principale
    // Ceci est une simulation - vous devrez implémenter la logique réelle
    const recurringExpense = {
      ...validatedData,
      userId,
      nextDates,
    };

    // Ici, vous pourriez enregistrer la dépense récurrente dans la base de données
    // et créer les premières occurrences

    return {
      success: true,
      message: "Dépense récurrente créée avec succès",
      data: recurringExpense,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la création de la dépense récurrente:",
      error
    );
    throw new Error("Échec de la création de la dépense récurrente");
  }
}

/**
 * Génère les prochaines dates en fonction de la fréquence
 */
function generateNextDates(
  startDate: Date,
  frequency: "weekly" | "monthly" | "quarterly" | "yearly",
  count: number
): Date[] {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);

  for (let i = 0; i < count; i++) {
    const nextDate = new Date(currentDate);

    switch (frequency) {
      case "weekly":
        nextDate.setDate(nextDate.getDate() + 7 * (i + 1));
        break;
      case "monthly":
        nextDate.setMonth(nextDate.getMonth() + (i + 1));
        break;
      case "quarterly":
        nextDate.setMonth(nextDate.getMonth() + 3 * (i + 1));
        break;
      case "yearly":
        nextDate.setFullYear(nextDate.getFullYear() + (i + 1));
        break;
    }

    dates.push(nextDate);
  }

  return dates;
}
