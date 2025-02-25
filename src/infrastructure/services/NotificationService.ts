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
  private static readonly NEEDS_THRESHOLD = 50;
  private static readonly SAVINGS_THRESHOLD = 30;
  private static readonly WANTS_THRESHOLD = 20;

  // Seuils d'alerte
  private static readonly CRITICAL_THRESHOLD = 0.9; // 90% du seuil
  private static readonly WARNING_THRESHOLD = 0.8; // 80% du seuil
  private static readonly LOW_THRESHOLD = 0.2; // 20% du seuil

  private static generateEssentialNeedsNotifications(
    state: State
  ): Notification[] {
    const notifications: Notification[] = [];

    // Vérification du budget total
    if (state.totalBudget <= 0) {
      notifications.push({
        id: crypto.randomUUID(),
        type: "warning",
        title: "Budget non défini",
        message:
          "Veuillez définir votre budget mensuel pour commencer le suivi",
        timestamp: new Date(),
        iconType: "AlertCircle",
        read: false,
        action: {
          label: "Définir le budget",
          onClick: () => console.log("Définir le budget"),
        },
      });
      return notifications;
    }

    const totalNeeds = state.totalFixed + state.totalVariable;
    const needsPercentage = (totalNeeds / state.totalBudget) * 100;

    if (totalNeeds === 0) {
      notifications.push({
        id: crypto.randomUUID(),
        type: "info",
        title: "Dépenses non enregistrées",
        message:
          "Commencez à enregistrer vos dépenses essentielles pour un meilleur suivi",
        timestamp: new Date(),
        iconType: "AlertCircle",
        read: false,
      });
    } else if (
      needsPercentage >
      this.NEEDS_THRESHOLD * this.CRITICAL_THRESHOLD
    ) {
      notifications.push({
        id: crypto.randomUUID(),
        type: "warning",
        title: "Dépenses essentielles critiques",
        message: `Vos dépenses essentielles (${needsPercentage.toFixed(
          1
        )}%) dépassent presque le seuil recommandé de ${this.NEEDS_THRESHOLD}%`,
        timestamp: new Date(),
        iconType: "AlertCircle",
        read: false,
        action: {
          label: "Analyser les dépenses",
          onClick: () => console.log("Analyser les dépenses"),
        },
      });
    } else if (needsPercentage > this.NEEDS_THRESHOLD) {
      notifications.push({
        id: crypto.randomUUID(),
        type: "warning",
        title: "Dépenses essentielles élevées",
        message: `Vos dépenses essentielles (${needsPercentage.toFixed(
          1
        )}%) dépassent le seuil recommandé de ${this.NEEDS_THRESHOLD}%`,
        timestamp: new Date(),
        iconType: "AlertCircle",
        read: false,
        action: {
          label: "Voir les détails",
          onClick: () => console.log("Voir les détails"),
        },
      });
    } else if (
      needsPercentage > 0 &&
      needsPercentage <= this.NEEDS_THRESHOLD * this.LOW_THRESHOLD
    ) {
      notifications.push({
        id: crypto.randomUUID(),
        type: "info",
        title: "Dépenses essentielles faibles",
        message:
          "Vérifiez que toutes vos dépenses essentielles sont bien enregistrées",
        timestamp: new Date(),
        iconType: "AlertCircle",
        read: false,
      });
    } else if (needsPercentage > 0 && needsPercentage <= this.NEEDS_THRESHOLD) {
      notifications.push({
        id: crypto.randomUUID(),
        type: "success",
        title: "Dépenses essentielles maîtrisées",
        message: `Excellent ! Vos dépenses essentielles (${needsPercentage.toFixed(
          1
        )}%) respectent l'objectif de ${this.NEEDS_THRESHOLD}%`,
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
    if (state.totalBudget <= 0) return notifications;

    const totalSavingsAndDebt = state.savings + state.totalDebt;
    const savingsPercentage = (totalSavingsAndDebt / state.totalBudget) * 100;
    const debtRatio = (state.totalDebt / state.totalBudget) * 100;

    // Analyse de l'épargne
    if (state.savings === 0) {
      notifications.push({
        id: crypto.randomUUID(),
        type: "warning",
        title: "Aucune épargne",
        message: "Pensez à mettre de l'argent de côté pour les imprévus",
        timestamp: new Date(),
        iconType: "PiggyBank",
        read: false,
        action: {
          label: "Conseils d'épargne",
          onClick: () => console.log("Conseils d'épargne"),
        },
      });
    } else if (
      savingsPercentage <
      this.SAVINGS_THRESHOLD * this.LOW_THRESHOLD
    ) {
      notifications.push({
        id: crypto.randomUUID(),
        type: "warning",
        title: "Épargne très faible",
        message: `Votre taux d'épargne (${savingsPercentage.toFixed(
          1
        )}%) est bien en dessous de l'objectif de ${this.SAVINGS_THRESHOLD}%`,
        timestamp: new Date(),
        iconType: "PiggyBank",
        read: false,
        action: {
          label: "Plan d'épargne",
          onClick: () => console.log("Plan d'épargne"),
        },
      });
    }

    // Analyse des dettes
    if (state.totalDebt > 0) {
      if (debtRatio > this.SAVINGS_THRESHOLD / 2) {
        notifications.push({
          id: crypto.randomUUID(),
          type: "warning",
          title: "Niveau d'endettement élevé",
          message: `Vos dettes représentent ${debtRatio.toFixed(
            1
          )}% de votre budget`,
          timestamp: new Date(),
          iconType: "CreditCard",
          read: false,
          action: {
            label: "Plan de désendettement",
            onClick: () => console.log("Plan de désendettement"),
          },
        });
      }
    }

    // Ratio épargne/dette
    if (state.savings > 0 && state.totalDebt > 0) {
      const savingsToDebtRatio = state.savings / state.totalDebt;
      if (savingsToDebtRatio < 1) {
        notifications.push({
          id: crypto.randomUUID(),
          type: "info",
          title: "Équilibre épargne/dette",
          message:
            "Votre épargne est inférieure à vos dettes. Pensez à équilibrer",
          timestamp: new Date(),
          iconType: "PiggyBank",
          read: false,
        });
      }
    }

    return notifications;
  }

  private static generateDiscretionaryNotifications(
    state: State
  ): Notification[] {
    const notifications: Notification[] = [];
    if (state.totalBudget <= 0) return notifications;

    const pleasurePercentage = (state.totalPleasure / state.totalBudget) * 100;

    if (state.totalPleasure === 0) {
      notifications.push({
        id: crypto.randomUUID(),
        type: "info",
        title: "Budget loisirs non utilisé",
        message: "N'oubliez pas de prévoir un budget pour vos loisirs",
        timestamp: new Date(),
        iconType: "Wallet",
        read: false,
      });
    } else if (
      pleasurePercentage >
      this.WANTS_THRESHOLD * this.CRITICAL_THRESHOLD
    ) {
      notifications.push({
        id: crypto.randomUUID(),
        type: "warning",
        title: "Dépenses de loisirs élevées",
        message: `Attention, vos loisirs représentent ${pleasurePercentage.toFixed(
          1
        )}% de votre budget (max: ${this.WANTS_THRESHOLD}%)`,
        timestamp: new Date(),
        iconType: "Wallet",
        read: false,
        action: {
          label: "Analyser les dépenses",
          onClick: () => console.log("Analyser les dépenses"),
        },
      });
    } else if (
      pleasurePercentage > 0 &&
      pleasurePercentage <= this.WANTS_THRESHOLD
    ) {
      notifications.push({
        id: crypto.randomUUID(),
        type: "success",
        title: "Budget loisirs équilibré",
        message: `Vous gérez bien votre budget loisirs (${pleasurePercentage.toFixed(
          1
        )}%)`,
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
    if (state.totalBudget <= 0) return notifications;

    const remainingPercentage = (state.remainsBudget / state.totalBudget) * 100;
    const daysInMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    ).getDate();
    const currentDay = new Date().getDate();
    const monthProgress = (currentDay / daysInMonth) * 100;

    if (remainingPercentage <= 0) {
      notifications.push({
        id: crypto.randomUUID(),
        type: "warning",
        title: "Budget épuisé",
        message: "Vous avez atteint la limite de votre budget mensuel",
        timestamp: new Date(),
        iconType: "AlertCircle",
        read: false,
        action: {
          label: "Voir le budget",
          onClick: () => console.log("Voir le budget"),
        },
      });
    } else if (remainingPercentage < 20 && monthProgress < 75) {
      notifications.push({
        id: crypto.randomUUID(),
        type: "warning",
        title: "Budget en tension",
        message: `Il ne reste que ${remainingPercentage.toFixed(
          1
        )}% de votre budget alors que nous sommes à ${monthProgress.toFixed(
          0
        )}% du mois`,
        timestamp: new Date(),
        iconType: "AlertCircle",
        read: false,
        action: {
          label: "Voir le budget",
          onClick: () => console.log("Voir le budget"),
        },
      });
    } else if (remainingPercentage > 50 && monthProgress > 75) {
      notifications.push({
        id: crypto.randomUUID(),
        type: "success",
        title: "Bonne gestion budgétaire",
        message: `Il vous reste ${remainingPercentage.toFixed(
          1
        )}% de votre budget en fin de mois`,
        timestamp: new Date(),
        iconType: "TrendingUp",
        read: false,
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
    ].sort((a, b) => {
      // Trier par type (warning en premier, puis info, puis success)
      const typeOrder = { warning: 0, info: 1, success: 2 };
      return typeOrder[a.type] - typeOrder[b.type];
    });
  }
}
