"use client";

import { State } from "@/src/entities/models/dashboard/state";
import {
  Budget,
  BudgetRule,
  Expense,
  Debts,
  Savings,
  Pleasure,
  FinancialGoal,
} from "@prisma/client";

export type NotificationType = "warning" | "info" | "success" | "critical";

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
    | "Wallet"
    | "Calendar"
    | "Bell"
    | "DollarSign";
  read: boolean;
  priority: number; // 1 (highest) to 5 (lowest)
  expiresAt?: Date; // Date d'expiration de la notification
  action?: {
    label: string;
    onClick: () => void;
    route?: string; // Route optionnelle pour la navigation
  };
  category: "budget" | "savings" | "expenses" | "debt" | "system";
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

  // Durée de vie des notifications (en jours)
  private static readonly NOTIFICATION_LIFETIME = {
    critical: 7, // 7 jours
    warning: 5, // 5 jours
    info: 3, // 3 jours
    success: 2, // 2 jours
  };

  /**
   * Génère un ID unique pour une notification
   */
  private static generateNotificationId(
    category: string,
    type: string
  ): string {
    return `${category}_${type}_${crypto.randomUUID()}`;
  }

  /**
   * Calcule la date d'expiration d'une notification
   */
  private static calculateExpirationDate(type: NotificationType): Date {
    const days = this.NOTIFICATION_LIFETIME[type] || 3;
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    return expirationDate;
  }

  /**
   * Génère les notifications liées aux besoins essentiels
   */
  private static generateEssentialNeedsNotifications(
    state: State
  ): Notification[] {
    const notifications: Notification[] = [];

    // Vérification du budget total
    if (state.totalBudget <= 0) {
      notifications.push({
        id: this.generateNotificationId("budget", "undefined"),
        type: "warning",
        title: "Budget non défini",
        message:
          "Veuillez définir votre budget mensuel pour commencer le suivi",
        timestamp: new Date(),
        iconType: "AlertCircle",
        read: false,
        priority: 1,
        expiresAt: this.calculateExpirationDate("warning"),
        category: "budget",
        action: {
          label: "Définir le budget",
          onClick: () => console.log("Définir le budget"),
          route: "/income",
        },
      });
      return notifications;
    }

    const totalNeeds = state.totalFixed + state.totalVariable;
    const needsPercentage = (totalNeeds / state.totalBudget) * 100;

    if (totalNeeds === 0) {
      notifications.push({
        id: this.generateNotificationId("expenses", "no_expenses"),
        type: "info",
        title: "Dépenses non enregistrées",
        message:
          "Commencez à enregistrer vos dépenses essentielles pour un meilleur suivi",
        timestamp: new Date(),
        iconType: "AlertCircle",
        read: false,
        priority: 3,
        expiresAt: this.calculateExpirationDate("info"),
        category: "expenses",
        action: {
          label: "Ajouter des dépenses",
          onClick: () => console.log("Ajouter des dépenses"),
          route: "/expenses",
        },
      });
    } else if (
      needsPercentage >
      this.NEEDS_THRESHOLD * this.CRITICAL_THRESHOLD
    ) {
      notifications.push({
        id: this.generateNotificationId("expenses", "critical_needs"),
        type: "warning",
        title: "Dépenses essentielles critiques",
        message: `Vos dépenses essentielles (${needsPercentage.toFixed(
          1
        )}%) dépassent presque le seuil recommandé de ${this.NEEDS_THRESHOLD}%`,
        timestamp: new Date(),
        iconType: "AlertCircle",
        read: false,
        priority: 2,
        expiresAt: this.calculateExpirationDate("warning"),
        category: "expenses",
        action: {
          label: "Analyser les dépenses",
          onClick: () => console.log("Analyser les dépenses"),
          route: "/expenses/analysis",
        },
      });
    } else if (needsPercentage > this.NEEDS_THRESHOLD) {
      notifications.push({
        id: this.generateNotificationId("expenses", "high_needs"),
        type: "warning",
        title: "Dépenses essentielles élevées",
        message: `Vos dépenses essentielles (${needsPercentage.toFixed(
          1
        )}%) dépassent le seuil recommandé de ${this.NEEDS_THRESHOLD}%`,
        timestamp: new Date(),
        iconType: "AlertCircle",
        read: false,
        priority: 2,
        expiresAt: this.calculateExpirationDate("warning"),
        category: "expenses",
        action: {
          label: "Voir les détails",
          onClick: () => console.log("Voir les détails"),
          route: "/expenses",
        },
      });
    } else if (
      needsPercentage > 0 &&
      needsPercentage <= this.NEEDS_THRESHOLD * this.LOW_THRESHOLD
    ) {
      notifications.push({
        id: this.generateNotificationId("expenses", "low_needs"),
        type: "info",
        title: "Dépenses essentielles faibles",
        message:
          "Vérifiez que toutes vos dépenses essentielles sont bien enregistrées",
        timestamp: new Date(),
        iconType: "AlertCircle",
        read: false,
        priority: 4,
        expiresAt: this.calculateExpirationDate("info"),
        category: "expenses",
      });
    } else if (needsPercentage > 0 && needsPercentage <= this.NEEDS_THRESHOLD) {
      notifications.push({
        id: this.generateNotificationId("expenses", "balanced_needs"),
        type: "success",
        title: "Dépenses essentielles maîtrisées",
        message: `Excellent ! Vos dépenses essentielles (${needsPercentage.toFixed(
          1
        )}%) respectent l'objectif de ${this.NEEDS_THRESHOLD}%`,
        timestamp: new Date(),
        iconType: "TrendingUp",
        read: false,
        priority: 5,
        expiresAt: this.calculateExpirationDate("success"),
        category: "expenses",
      });
    }

    return notifications;
  }

  /**
   * Génère les notifications liées à l'épargne et aux dettes
   */
  private static generateSavingsAndDebtNotifications(
    state: State
  ): Notification[] {
    const notifications: Notification[] = [];
    if (state.totalBudget <= 0) return notifications;

    const savingsPercentage = (state.totalSavings / state.totalBudget) * 100;
    const debtRatio = (state.totalDebt / state.totalBudget) * 100;

    // Analyse de l'épargne
    if (state.totalSavings === 0) {
      notifications.push({
        id: this.generateNotificationId("savings", "no_savings"),
        type: "warning",
        title: "Aucune épargne",
        message: "Pensez à mettre de l'argent de côté pour les imprévus",
        timestamp: new Date(),
        iconType: "PiggyBank",
        read: false,
        priority: 2,
        expiresAt: this.calculateExpirationDate("warning"),
        category: "savings",
        action: {
          label: "Conseils d'épargne",
          onClick: () => console.log("Conseils d'épargne"),
          route: "/savings/tips",
        },
      });
    } else if (
      savingsPercentage <
      this.SAVINGS_THRESHOLD * this.LOW_THRESHOLD
    ) {
      notifications.push({
        id: this.generateNotificationId("savings", "low_savings"),
        type: "warning",
        title: "Épargne très faible",
        message: `Votre taux d'épargne (${savingsPercentage.toFixed(
          1
        )}%) est bien en dessous de l'objectif de ${this.SAVINGS_THRESHOLD}%`,
        timestamp: new Date(),
        iconType: "PiggyBank",
        read: false,
        priority: 2,
        expiresAt: this.calculateExpirationDate("warning"),
        category: "savings",
        action: {
          label: "Plan d'épargne",
          onClick: () => console.log("Plan d'épargne"),
          route: "/savings/plan",
        },
      });
    } else if (savingsPercentage >= this.SAVINGS_THRESHOLD) {
      notifications.push({
        id: this.generateNotificationId("savings", "good_savings"),
        type: "success",
        title: "Objectif d'épargne atteint",
        message: `Félicitations ! Votre taux d'épargne (${savingsPercentage.toFixed(
          1
        )}%) atteint l'objectif recommandé de ${this.SAVINGS_THRESHOLD}%`,
        timestamp: new Date(),
        iconType: "PiggyBank",
        read: false,
        priority: 5,
        expiresAt: this.calculateExpirationDate("success"),
        category: "savings",
      });
    }

    // Analyse des dettes
    if (state.totalDebt > 0) {
      if (debtRatio > this.SAVINGS_THRESHOLD) {
        notifications.push({
          id: this.generateNotificationId("debt", "critical_debt"),
          type: "critical",
          title: "Niveau d'endettement critique",
          message: `Vos dettes représentent ${debtRatio.toFixed(
            1
          )}% de votre budget, ce qui est très élevé`,
          timestamp: new Date(),
          iconType: "CreditCard",
          read: false,
          priority: 1,
          expiresAt: this.calculateExpirationDate("critical"),
          category: "debt",
          action: {
            label: "Plan de désendettement",
            onClick: () => console.log("Plan de désendettement"),
            route: "/debt/plan",
          },
        });
      } else if (debtRatio > this.SAVINGS_THRESHOLD / 2) {
        notifications.push({
          id: this.generateNotificationId("debt", "high_debt"),
          type: "warning",
          title: "Niveau d'endettement élevé",
          message: `Vos dettes représentent ${debtRatio.toFixed(
            1
          )}% de votre budget`,
          timestamp: new Date(),
          iconType: "CreditCard",
          read: false,
          priority: 2,
          expiresAt: this.calculateExpirationDate("warning"),
          category: "debt",
          action: {
            label: "Plan de désendettement",
            onClick: () => console.log("Plan de désendettement"),
            route: "/debt/plan",
          },
        });
      }
    }

    // Ratio épargne/dette
    if (state.totalSavings > 0 && state.totalDebt > 0) {
      const savingsToDebtRatio = state.totalSavings / state.totalDebt;
      if (savingsToDebtRatio < 1) {
        notifications.push({
          id: this.generateNotificationId("debt", "savings_debt_ratio"),
          type: "info",
          title: "Équilibre épargne/dette",
          message:
            "Votre épargne est inférieure à vos dettes. Pensez à équilibrer",
          timestamp: new Date(),
          iconType: "PiggyBank",
          read: false,
          priority: 3,
          expiresAt: this.calculateExpirationDate("info"),
          category: "debt",
          action: {
            label: "Stratégies d'équilibrage",
            onClick: () => console.log("Stratégies d'équilibrage"),
            route: "/debt/strategies",
          },
        });
      }
    }

    return notifications;
  }

  /**
   * Génère les notifications liées aux dépenses discrétionnaires
   */
  private static generateDiscretionaryNotifications(
    state: State
  ): Notification[] {
    const notifications: Notification[] = [];
    if (state.totalBudget <= 0) return notifications;

    const pleasurePercentage = (state.totalPleasure / state.totalBudget) * 100;

    if (state.totalPleasure === 0) {
      notifications.push({
        id: this.generateNotificationId("expenses", "no_pleasure"),
        type: "info",
        title: "Budget loisirs non utilisé",
        message: "N'oubliez pas de prévoir un budget pour vos loisirs",
        timestamp: new Date(),
        iconType: "Wallet",
        read: false,
        priority: 4,
        expiresAt: this.calculateExpirationDate("info"),
        category: "expenses",
      });
    } else if (pleasurePercentage > this.WANTS_THRESHOLD * 1.5) {
      notifications.push({
        id: this.generateNotificationId("expenses", "critical_pleasure"),
        type: "critical",
        title: "Dépenses de loisirs excessives",
        message: `Vos loisirs représentent ${pleasurePercentage.toFixed(
          1
        )}% de votre budget, bien au-delà des ${
          this.WANTS_THRESHOLD
        }% recommandés`,
        timestamp: new Date(),
        iconType: "Wallet",
        read: false,
        priority: 1,
        expiresAt: this.calculateExpirationDate("critical"),
        category: "expenses",
        action: {
          label: "Réduire les dépenses",
          onClick: () => console.log("Réduire les dépenses"),
          route: "/expenses/reduce",
        },
      });
    } else if (
      pleasurePercentage >
      this.WANTS_THRESHOLD * this.CRITICAL_THRESHOLD
    ) {
      notifications.push({
        id: this.generateNotificationId("expenses", "high_pleasure"),
        type: "warning",
        title: "Dépenses de loisirs élevées",
        message: `Attention, vos loisirs représentent ${pleasurePercentage.toFixed(
          1
        )}% de votre budget (max: ${this.WANTS_THRESHOLD}%)`,
        timestamp: new Date(),
        iconType: "Wallet",
        read: false,
        priority: 2,
        expiresAt: this.calculateExpirationDate("warning"),
        category: "expenses",
        action: {
          label: "Analyser les dépenses",
          onClick: () => console.log("Analyser les dépenses"),
          route: "/expenses/analysis",
        },
      });
    } else if (
      pleasurePercentage > 0 &&
      pleasurePercentage <= this.WANTS_THRESHOLD
    ) {
      notifications.push({
        id: this.generateNotificationId("expenses", "balanced_pleasure"),
        type: "success",
        title: "Budget loisirs équilibré",
        message: `Vous gérez bien votre budget loisirs (${pleasurePercentage.toFixed(
          1
        )}%)`,
        timestamp: new Date(),
        iconType: "Wallet",
        read: false,
        priority: 5,
        expiresAt: this.calculateExpirationDate("success"),
        category: "expenses",
      });
    }

    return notifications;
  }

  /**
   * Génère les notifications liées à l'équilibre budgétaire
   */
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
        id: this.generateNotificationId("budget", "depleted"),
        type: "critical",
        title: "Budget épuisé",
        message: "Vous avez atteint la limite de votre budget mensuel",
        timestamp: new Date(),
        iconType: "AlertCircle",
        read: false,
        priority: 1,
        expiresAt: this.calculateExpirationDate("critical"),
        category: "budget",
        action: {
          label: "Voir le budget",
          onClick: () => console.log("Voir le budget"),
          route: "/budget",
        },
      });
    } else if (remainingPercentage < 10) {
      notifications.push({
        id: this.generateNotificationId("budget", "critical_balance"),
        type: "critical",
        title: "Budget critique",
        message: `Il ne reste que ${remainingPercentage.toFixed(
          1
        )}% de votre budget pour ce mois`,
        timestamp: new Date(),
        iconType: "AlertCircle",
        read: false,
        priority: 1,
        expiresAt: this.calculateExpirationDate("critical"),
        category: "budget",
        action: {
          label: "Voir le budget",
          onClick: () => console.log("Voir le budget"),
          route: "/budget",
        },
      });
    } else if (remainingPercentage < 20 && monthProgress < 75) {
      notifications.push({
        id: this.generateNotificationId("budget", "tension"),
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
        priority: 2,
        expiresAt: this.calculateExpirationDate("warning"),
        category: "budget",
        action: {
          label: "Voir le budget",
          onClick: () => console.log("Voir le budget"),
          route: "/budget",
        },
      });
    } else if (remainingPercentage > 50 && monthProgress > 75) {
      notifications.push({
        id: this.generateNotificationId("budget", "good_management"),
        type: "success",
        title: "Bonne gestion budgétaire",
        message: `Il vous reste ${remainingPercentage.toFixed(
          1
        )}% de votre budget en fin de mois`,
        timestamp: new Date(),
        iconType: "TrendingUp",
        read: false,
        priority: 5,
        expiresAt: this.calculateExpirationDate("success"),
        category: "budget",
      });
    }

    return notifications;
  }

  /**
   * Génère les notifications liées aux échéances à venir
   */
  private static generateUpcomingDeadlinesNotifications(
    state: State
  ): Notification[] {
    const notifications: Notification[] = [];
    const today = new Date();

    // Filtrer les dépenses avec des dates d'échéance
    const upcomingDeadlines = state.expenses
      .filter((expense) => expense.dueDate !== null)
      .map((expense) => ({
        name: expense.name,
        date: new Date(expense.dueDate!),
        amount: expense.budgetAmount,
      }));

    // Filtrer les échéances dans les 7 prochains jours
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);

    upcomingDeadlines.forEach((deadline) => {
      if (deadline.date <= sevenDaysFromNow && deadline.date >= today) {
        const daysUntilDeadline = Math.ceil(
          (deadline.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        notifications.push({
          id: this.generateNotificationId(
            "expenses",
            `deadline_${deadline.name.toLowerCase().replace(/\s+/g, "_")}`
          ),
          type: daysUntilDeadline <= 2 ? "warning" : "info",
          title: `Échéance à venir : ${deadline.name}`,
          message: `Paiement de ${deadline.amount}${
            state.currency
          } prévu dans ${daysUntilDeadline} jour${
            daysUntilDeadline > 1 ? "s" : ""
          }`,
          timestamp: new Date(),
          iconType: "Calendar",
          read: false,
          priority: daysUntilDeadline <= 2 ? 2 : 3,
          expiresAt: deadline.date,
          category: "expenses",
          action: {
            label: "Voir les échéances",
            onClick: () => console.log("Voir les échéances"),
            route: "/expenses",
          },
        });
      }
    });

    return notifications;
  }

  /**
   * Génère les notifications liées aux objectifs financiers
   */
  private static generateFinancialGoalsNotifications(
    state: State
  ): Notification[] {
    const notifications: Notification[] = [];

    if (!state.financialGoals || state.financialGoals.length === 0) {
      return notifications;
    }

    state.financialGoals.forEach((goal) => {
      const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
      const today = new Date();
      const daysUntilDeadline = Math.ceil(
        (new Date(goal.targetDate).getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      // Calculer le temps écoulé depuis le début de l'objectif
      const totalDays = Math.ceil(
        (new Date(goal.targetDate).getTime() -
          new Date(goal.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const elapsedDays = totalDays - daysUntilDeadline;
      const timeProgressPercentage = (elapsedDays / totalDays) * 100;

      // Objectif presque atteint
      if (progressPercentage >= 90 && progressPercentage < 100) {
        notifications.push({
          id: this.generateNotificationId(
            "savings",
            `goal_almost_${goal.name.toLowerCase().replace(/\s+/g, "_")}`
          ),
          type: "success",
          title: `Objectif presque atteint : ${goal.name}`,
          message: `Vous avez atteint ${progressPercentage.toFixed(
            0
          )}% de votre objectif de ${goal.targetAmount}${state.currency}`,
          timestamp: new Date(),
          iconType: "TrendingUp",
          read: false,
          priority: 3,
          expiresAt: this.calculateExpirationDate("success"),
          category: "savings",
          action: {
            label: "Voir l'objectif",
            onClick: () => console.log("Voir l'objectif"),
            route: "/savings/goals",
          },
        });
      }
      // Objectif en retard
      else if (
        progressPercentage < timeProgressPercentage - 20 &&
        daysUntilDeadline > 0
      ) {
        notifications.push({
          id: this.generateNotificationId(
            "savings",
            `goal_behind_${goal.name.toLowerCase().replace(/\s+/g, "_")}`
          ),
          type: "warning",
          title: `Objectif en retard : ${goal.name}`,
          message: `Vous avez atteint ${progressPercentage.toFixed(
            0
          )}% de votre objectif alors que ${timeProgressPercentage.toFixed(
            0
          )}% du temps s'est écoulé`,
          timestamp: new Date(),
          iconType: "AlertCircle",
          read: false,
          priority: 2,
          expiresAt: this.calculateExpirationDate("warning"),
          category: "savings",
          action: {
            label: "Ajuster l'objectif",
            onClick: () => console.log("Ajuster l'objectif"),
            route: "/savings/goals",
          },
        });
      }
      // Objectif dépassé
      else if (daysUntilDeadline < 0 && progressPercentage < 100) {
        notifications.push({
          id: this.generateNotificationId(
            "savings",
            `goal_overdue_${goal.name.toLowerCase().replace(/\s+/g, "_")}`
          ),
          type: "critical",
          title: `Objectif dépassé : ${goal.name}`,
          message: `La date limite est dépassée et vous avez atteint ${progressPercentage.toFixed(
            0
          )}% de votre objectif`,
          timestamp: new Date(),
          iconType: "AlertCircle",
          read: false,
          priority: 1,
          expiresAt: this.calculateExpirationDate("critical"),
          category: "savings",
          action: {
            label: "Revoir l'objectif",
            onClick: () => console.log("Revoir l'objectif"),
            route: "/savings/goals",
          },
        });
      }
      // Objectif atteint
      else if (progressPercentage >= 100) {
        notifications.push({
          id: this.generateNotificationId(
            "savings",
            `goal_achieved_${goal.name.toLowerCase().replace(/\s+/g, "_")}`
          ),
          type: "success",
          title: `Objectif atteint : ${goal.name}`,
          message: `Félicitations ! Vous avez atteint votre objectif de ${goal.targetAmount}${state.currency}`,
          timestamp: new Date(),
          iconType: "TrendingUp",
          read: false,
          priority: 4,
          expiresAt: this.calculateExpirationDate("success"),
          category: "savings",
          action: {
            label: "Voir l'objectif",
            onClick: () => console.log("Voir l'objectif"),
            route: "/savings/goals",
          },
        });
      }
    });

    return notifications;
  }

  /**
   * Génère les notifications basées sur les règles budgétaires
   */
  private static generateBudgetRuleNotifications(state: State): Notification[] {
    const notifications: Notification[] = [];

    if (!state.budgetRules) {
      return notifications;
    }

    const {
      needsPercentage,
      savingsPercentage,
      wantsPercentage,
      actualNeedsPercentage,
      actualSavingsPercentage,
      actualWantsPercentage,
    } = state.budgetRules;

    // Écart important entre objectif et réalité pour les besoins
    if (Math.abs(actualNeedsPercentage - needsPercentage) > 10) {
      const isOver = actualNeedsPercentage > needsPercentage;
      notifications.push({
        id: this.generateNotificationId("budget", "needs_rule_gap"),
        type: isOver ? "warning" : "info",
        title: `Écart sur les dépenses essentielles`,
        message: `Vos dépenses essentielles (${actualNeedsPercentage.toFixed(
          1
        )}%) sont ${
          isOver ? "supérieures" : "inférieures"
        } à votre objectif de ${needsPercentage}%`,
        timestamp: new Date(),
        iconType: isOver ? "AlertCircle" : "TrendingUp",
        read: false,
        priority: isOver ? 2 : 3,
        expiresAt: this.calculateExpirationDate(isOver ? "warning" : "info"),
        category: "budget",
        action: {
          label: "Voir les détails",
          onClick: () => console.log("Voir les détails"),
          route: "/settings/budget",
        },
      });
    }

    // Écart important entre objectif et réalité pour l'épargne
    if (Math.abs(actualSavingsPercentage - savingsPercentage) > 10) {
      const isUnder = actualSavingsPercentage < savingsPercentage;
      notifications.push({
        id: this.generateNotificationId("budget", "savings_rule_gap"),
        type: isUnder ? "warning" : "success",
        title: `Écart sur l'épargne`,
        message: `Votre épargne (${actualSavingsPercentage.toFixed(1)}%) est ${
          isUnder ? "inférieure" : "supérieure"
        } à votre objectif de ${savingsPercentage}%`,
        timestamp: new Date(),
        iconType: isUnder ? "AlertCircle" : "PiggyBank",
        read: false,
        priority: isUnder ? 2 : 4,
        expiresAt: this.calculateExpirationDate(
          isUnder ? "warning" : "success"
        ),
        category: "budget",
        action: {
          label: "Voir les détails",
          onClick: () => console.log("Voir les détails"),
          route: "/settings/budget",
        },
      });
    }

    // Écart important entre objectif et réalité pour les loisirs
    if (Math.abs(actualWantsPercentage - wantsPercentage) > 10) {
      const isOver = actualWantsPercentage > wantsPercentage;
      notifications.push({
        id: this.generateNotificationId("budget", "wants_rule_gap"),
        type: isOver ? "warning" : "info",
        title: `Écart sur les dépenses de loisirs`,
        message: `Vos dépenses de loisirs (${actualWantsPercentage.toFixed(
          1
        )}%) sont ${
          isOver ? "supérieures" : "inférieures"
        } à votre objectif de ${wantsPercentage}%`,
        timestamp: new Date(),
        iconType: isOver ? "AlertCircle" : "Wallet",
        read: false,
        priority: isOver ? 2 : 3,
        expiresAt: this.calculateExpirationDate(isOver ? "warning" : "info"),
        category: "budget",
        action: {
          label: "Voir les détails",
          onClick: () => console.log("Voir les détails"),
          route: "/settings/budget",
        },
      });
    }

    return notifications;
  }

  /**
   * Filtre les notifications expirées
   */
  private static filterExpiredNotifications(
    notifications: Notification[]
  ): Notification[] {
    const now = new Date();
    return notifications.filter((notification) => {
      return !notification.expiresAt || notification.expiresAt > now;
    });
  }

  /**
   * Déduplique les notifications par catégorie
   * Ne garde que la notification la plus prioritaire pour chaque catégorie spécifique
   */
  private static deduplicateNotifications(
    notifications: Notification[]
  ): Notification[] {
    const categoryMap = new Map<string, Notification>();

    // Regrouper par sous-catégorie (extraite de l'ID)
    notifications.forEach((notification) => {
      const idParts = notification.id.split("_");
      const subCategory =
        idParts.length > 1
          ? `${notification.category}_${idParts[1]}`
          : notification.category;

      if (
        !categoryMap.has(subCategory) ||
        notification.priority < categoryMap.get(subCategory)!.priority
      ) {
        categoryMap.set(subCategory, notification);
      }
    });

    return Array.from(categoryMap.values());
  }

  /**
   * Génère toutes les notifications et les trie par priorité
   */
  static generateNotifications(state: State): Notification[] {
    const allNotifications = [
      ...this.generateEssentialNeedsNotifications(state),
      ...this.generateSavingsAndDebtNotifications(state),
      ...this.generateDiscretionaryNotifications(state),
      ...this.generateBudgetBalanceNotifications(state),
      ...this.generateUpcomingDeadlinesNotifications(state),
      ...this.generateFinancialGoalsNotifications(state),
      ...this.generateBudgetRuleNotifications(state),
    ];

    // Filtrer les notifications expirées
    const activeNotifications =
      this.filterExpiredNotifications(allNotifications);

    // Dédupliquer les notifications similaires
    const deduplicatedNotifications =
      this.deduplicateNotifications(activeNotifications);

    // Trier par priorité puis par type
    return deduplicatedNotifications.sort((a, b) => {
      // D'abord par priorité (1 est plus important que 5)
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }

      // Ensuite par type (critical > warning > info > success)
      const typeOrder = { critical: 0, warning: 1, info: 2, success: 3 };
      return typeOrder[a.type] - typeOrder[b.type];
    });
  }

  /**
   * Convertit une notification en format de base de données
   */
  static convertToDatabaseFormat(notification: Notification) {
    return {
      uniqueId: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      timestamp: notification.timestamp,
      iconType: notification.iconType,
      read: notification.read,
      priority: notification.priority,
      expiresAt: notification.expiresAt,
      actionLabel: notification.action?.label,
      actionRoute: notification.action?.route,
      category: notification.category,
    };
  }

  /**
   * Convertit un format de base de données en notification
   */
  static convertFromDatabaseFormat(dbNotification: any): Notification {
    return {
      id: dbNotification.uniqueId,
      type: dbNotification.type as NotificationType,
      title: dbNotification.title,
      message: dbNotification.message,
      timestamp: new Date(dbNotification.timestamp),
      iconType: dbNotification.iconType as any,
      read: dbNotification.read,
      priority: dbNotification.priority,
      expiresAt: dbNotification.expiresAt
        ? new Date(dbNotification.expiresAt)
        : undefined,
      action: dbNotification.actionLabel
        ? {
            label: dbNotification.actionLabel,
            onClick: () =>
              console.log(`Action clicked: ${dbNotification.actionLabel}`),
            route: dbNotification.actionRoute,
          }
        : undefined,
      category: dbNotification.category as any,
    };
  }

  /**
   * Persiste les notifications dans le stockage local (pour compatibilité)
   */
  static saveNotificationsToStorage(notifications: Notification[]): void {
    try {
      localStorage.setItem("notifications", JSON.stringify(notifications));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des notifications:", error);
    }
  }

  /**
   * Récupère les notifications depuis le stockage local (pour compatibilité)
   */
  static getNotificationsFromStorage(): Notification[] {
    try {
      const storedNotifications = localStorage.getItem("notifications");
      if (storedNotifications) {
        const parsedNotifications = JSON.parse(storedNotifications);
        // Convertir les chaînes de date en objets Date
        return parsedNotifications.map((notification: any) => ({
          ...notification,
          timestamp: new Date(notification.timestamp),
          expiresAt: notification.expiresAt
            ? new Date(notification.expiresAt)
            : undefined,
        }));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
    }
    return [];
  }

  /**
   * Fusionne les nouvelles notifications avec celles existantes
   * en préservant l'état "lu" des notifications existantes
   */
  static mergeNotifications(
    existingNotifications: Notification[],
    newNotifications: Notification[]
  ): Notification[] {
    const existingMap = new Map(existingNotifications.map((n) => [n.id, n]));

    return newNotifications.map((notification) => {
      const existing = existingMap.get(notification.id);
      if (existing) {
        // Préserver l'état "lu" et la date de création originale
        return {
          ...notification,
          read: existing.read,
          timestamp: existing.timestamp,
        };
      }
      return notification;
    });
  }
}
