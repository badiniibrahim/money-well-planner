"use client";

import { State } from "@/src/entities/models/dashboard/state";
import { Notification, NotificationService } from "./NotificationService";

export class NotificationDataService {
  /**
   * Récupère toutes les données nécessaires pour générer les notifications
   */
  static async fetchNotificationData(): Promise<State | null> {
    try {
      // Appel à l'API pour récupérer les données
      const response = await fetch('/api/notifications/data');
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des données: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des données pour les notifications:", error);
      return null;
    }
  }

  /**
   * Récupère toutes les notifications depuis la base de données
   */
  static async fetchNotifications(): Promise<Notification[]> {
    try {
      const response = await fetch('/api/notifications');
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des notifications: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Convertir les notifications de la base de données en format client
      return data.map((notification: any) => NotificationService.convertFromDatabaseFormat(notification));
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
      return [];
    }
  }

  /**
   * Synchronise les notifications avec la base de données
   */
  static async syncNotifications(notifications: Notification[]): Promise<void> {
    try {
      // Convertir les notifications en format de base de données
      const dbNotifications = notifications.map(notification => 
        NotificationService.convertToDatabaseFormat(notification)
      );

      // Envoyer les notifications à l'API pour synchronisation
      const response = await fetch('/api/notifications/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notifications: dbNotifications }),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la synchronisation des notifications: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erreur lors de la synchronisation des notifications:", error);
    }
  }

  /**
   * Marque une notification comme lue
   */
  static async markAsRead(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors du marquage de la notification comme lue: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erreur lors du marquage de la notification comme lue:", error);
      throw error;
    }
  }

  /**
   * Marque toutes les notifications comme lues
   */
  static async markAllAsRead(): Promise<void> {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors du marquage de toutes les notifications comme lues: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erreur lors du marquage de toutes les notifications comme lues:", error);
      throw error;
    }
  }

  /**
   * Supprime une notification
   */
  static async deleteNotification(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la suppression de la notification: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification:", error);
      throw error;
    }
  }

  /**
   * Supprime toutes les notifications
   */
  static async clearAllNotifications(): Promise<void> {
    try {
      const response = await fetch('/api/notifications', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la suppression de toutes les notifications: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de toutes les notifications:", error);
      throw error;
    }
  }

  /**
   * Met à jour les règles budgétaires avec les pourcentages réels
   */
  static async updateBudgetRules(): Promise<void> {
    try {
      // Appel à l'API pour mettre à jour les règles budgétaires
      const response = await fetch('/api/notifications/update-budget-rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la mise à jour des règles budgétaires: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des règles budgétaires:", error);
    }
  }
}