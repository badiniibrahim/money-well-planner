"use client";

import React from "react";
import {
  Bell,
  X,
  AlertCircle,
  TrendingUp,
  CreditCard,
  PiggyBank,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type NotificationType = "warning" | "info" | "success";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  icon: React.ElementType;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

function NotificationItem({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: (id: string) => void;
}) {
  const Icon = notification.icon;

  return (
    <div
      className={cn(
        "group relative rounded-lg p-4 transition-all duration-200",
        "hover:bg-slate-800/50",
        !notification.read && "bg-slate-800/30"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "rounded-full p-2 transition-transform group-hover:scale-110",
            notification.type === "warning" && "bg-amber-500/20",
            notification.type === "info" && "bg-blue-500/20",
            notification.type === "success" && "bg-emerald-500/20"
          )}
        >
          <Icon
            className={cn(
              "h-5 w-5",
              notification.type === "warning" && "text-amber-400",
              notification.type === "info" && "text-blue-400",
              notification.type === "success" && "text-emerald-400"
            )}
          />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium text-white">{notification.title}</p>
              <p className="text-sm text-slate-400">{notification.message}</p>
            </div>
            <button
              onClick={() => onDismiss(notification.id)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <time className="text-xs text-slate-500">
              {new Intl.RelativeTimeFormat("fr", { numeric: "auto" }).format(
                Math.ceil(
                  (notification.timestamp.getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24)
                ),
                "day"
              )}
            </time>
            {notification.action && (
              <Button
                variant="ghost"
                size="sm"
                onClick={notification.action.onClick}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                {notification.action.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationCenter() {
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: "1",
      type: "warning",
      title: "Dépassement de budget",
      message: "Vous avez dépassé votre budget 'Restaurants' de 15%",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      icon: AlertCircle,
      read: false,
      action: {
        label: "Voir le budget",
        onClick: () => console.log("Voir le budget"),
      },
    },
    {
      id: "2",
      type: "info",
      title: "Paiement à venir",
      message: "Facture d'électricité à payer dans 3 jours",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      icon: CreditCard,
      read: false,
    },
    {
      id: "3",
      type: "success",
      title: "Objectif atteint",
      message:
        "Félicitations ! Vous avez atteint 50% de votre objectif d'épargne",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      icon: PiggyBank,
      read: true,
    },
    {
      id: "4",
      type: "info",
      title: "Tendance détectée",
      message: "Vos dépenses en transport ont augmenté de 20% ce mois-ci",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      icon: TrendingUp,
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-slate-800/50 transition-colors">
          <Bell className="h-5 w-5 text-slate-400" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-medium text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-sm bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 border-slate-700/50 p-0"
      >
        <SheetHeader className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold text-white">
              Notifications
            </SheetTitle>
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-slate-400 hover:text-white"
              >
                Tout marquer comme lu
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6">
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onDismiss={dismissNotification}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Pas de notifications
              </h3>
              <p className="text-sm text-slate-400">
                Vous serez notifié des événements importants concernant vos
                finances
              </p>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export default NotificationCenter;
