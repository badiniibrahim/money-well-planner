"use client";

import { State } from "@/src/entities/models/dashboard/state";

export type NotificationType = "warning" | "info" | "success";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  iconType:
    | "AlertCircle"
    | "TrendingUp"
    | "CreditCard"
    | "PiggyBank"
    | "Wallet";
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export class NotificationService {
  // Constantes pour la règle 50/30/20
  private static readonly NEEDS_THRESHOLD = 50; // 50% pour les besoins essentiels
  private static readonly SAVINGS_THRESHOLD = 30; // 30% pour l'épargne et les dettes
  private static readonly WANTS_THRESHOLD = 20; // 20% pour les loisirs

  private static generateEssentialNeedsNotifications(
    state: State
  ): Notification[] {
    const notifications: Notification[] = [];
    const totalNeeds = state.totalFixed + state.totalVariable;
    console.log({ totalNeeds });
    const needsPercentage = (totalNeeds / state.totalBudget) * 100;

    if (needsPercentage > this.NEEDS_THRESHOLD) {
      notifications.push({
        id: crypto.randomUUID(),
        type: "warning",
        title: "Dépenses essentielles élevées",
        message: `Vos dépenses essentielles représentent ${needsPercentage.toFixed(
          1
        )}% de votre budget (objectif: ${this.NEEDS_THRESHOLD}%)`,
        timestamp: new Date(),
        iconType: "AlertCircle",
        read: false,
        action: {
          label: "Voir les détails",
          onClick: () => console.log("Voir les détails des dépenses"),
        },
      });
    } else if (needsPercentage < this.NEEDS_THRESHOLD - 10) {
      notifications.push({
        id: crypto.randomUUID(),
        type: "success",
        title: "Gestion optimale des dépenses",
        message: `Vos dépenses essentielles sont bien maîtrisées à ${needsPercentage.toFixed(
          1
        )}% du budget`,
        timestamp: new Date(),
        iconType: "TrendingUp",
        read: false,
      });
    }

    return notifications;
  }

  private static generateSavingsAndDebtNotifications(
    state: State
  ): Notification[] {
    const notifications: Notification[] = [];
    const totalSavingsAndDebt = state.savings + state.totalDebt;
    const savingsPercentage = (totalSavingsAndDebt / state.totalBudget) * 100;

    if (savingsPercentage < this.SAVINGS_THRESHOLD) {
      notifications.push({
        id: crypto.randomUUID(),
        type: "warning",
        title: "Épargne insuffisante",
        message: `Votre épargne et remboursement de dettes représentent ${savingsPercentage.toFixed(
          1
        )}% (objectif: ${this.SAVINGS_THRESHOLD}%)`,
        timestamp: new Date(),
        iconType: "PiggyBank",
        read: false,
        action: {
          label: "Conseils d'épargne",
          onClick: () => console.log("Voir les conseils d'épargne"),
        },
      });
    } else if (savingsPercentage > this.SAVINGS_THRESHOLD) {
      notifications.push({
        id: crypto.randomUUID(),
        type: "success",
        title: "Excellent taux d'épargne",
        message: `Vous épargnez ${savingsPercentage.toFixed(
          1
        )}% de votre budget, continuez ainsi !`,
        timestamp: new Date(),
        iconType: "PiggyBank",
        read: false,
      });
    }

    return notifications;
  }

  private static generateDiscretionaryNotifications(
    state: State
  ): Notification[] {
    const notifications: Notification[] = [];
    const pleasurePercentage = (state.totalPleasure / state.totalBudget) * 100;

    if (pleasurePercentage > this.WANTS_THRESHOLD) {
      notifications.push({
        id: crypto.randomUUID(),
        type: "warning",
        title: "Dépenses de loisirs élevées",
        message: `Vos dépenses de loisirs représentent ${pleasurePercentage.toFixed(
          1
        )}% (objectif: ${this.WANTS_THRESHOLD}%)`,
        timestamp: new Date(),
        iconType: "Wallet",
        read: false,
        action: {
          label: "Voir le détail",
          onClick: () => console.log("Voir le détail des loisirs"),
        },
      });
    } else if (pleasurePercentage < this.WANTS_THRESHOLD - 5) {
      notifications.push({
        id: crypto.randomUUID(),
        type: "info",
        title: "Budget loisirs disponible",
        message: `Il vous reste de la marge pour vos loisirs (${pleasurePercentage.toFixed(
          1
        )}% sur ${this.WANTS_THRESHOLD}%)`,
        timestamp: new Date(),
        iconType: "Wallet",
        read: false,
      });
    }

    return notifications;
  }

  private static generateBudgetBalanceNotifications(
    state: State
  ): Notification[] {
    const notifications: Notification[] = [];
    const remainingPercentage = (state.remainsBudget / state.totalBudget) * 100;

    if (remainingPercentage < 10) {
      notifications.push({
        id: crypto.randomUUID(),
        type: "warning",
        title: "Budget restant faible",
        message: `Attention, il ne reste que ${remainingPercentage.toFixed(
          1
        )}% de votre budget mensuel`,
        timestamp: new Date(),
        iconType: "AlertCircle",
        read: false,
        action: {
          label: "Voir le budget",
          onClick: () => console.log("Voir le budget"),
        },
      });
    }

    return notifications;
  }

  private static generateDebtRatioNotifications(state: State): Notification[] {
    const notifications: Notification[] = [];
    const debtRatio = (state.totalDebt / state.totalBudget) * 100;
    const maxDebtRatio = this.SAVINGS_THRESHOLD / 2; // La dette ne devrait pas dépasser la moitié du seuil d'épargne

    if (debtRatio > maxDebtRatio) {
      notifications.push({
        id: crypto.randomUUID(),
        type: "warning",
        title: "Niveau d'endettement élevé",
        message: `Votre dette représente ${debtRatio.toFixed(
          1
        )}% de votre budget, ce qui est élevé`,
        timestamp: new Date(),
        iconType: "CreditCard",
        read: false,
        action: {
          label: "Plan de désendettement",
          onClick: () => console.log("Voir le plan de désendettement"),
        },
      });
    }

    return notifications;
  }

  static generateNotifications(state: State): Notification[] {
    return [
      ...this.generateEssentialNeedsNotifications(state),
      ...this.generateSavingsAndDebtNotifications(state),
      ...this.generateDiscretionaryNotifications(state),
      ...this.generateBudgetBalanceNotifications(state),
      ...this.generateDebtRatioNotifications(state),
    ];
  }
}
