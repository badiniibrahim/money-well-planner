"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Bell,
  X,
  AlertCircle,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Wallet,
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
import { State } from "@/src/entities/models/dashboard/state";
import {
  NotificationService,
  Notification,
} from "@/src/infrastructure/services/NotificationService";

interface NotificationContextType {
  notifications: Notification[];
  dismissNotification: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
  state,
}: {
  children: React.ReactNode;
  state: State;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const newNotifications = NotificationService.generateNotifications(state);
    setNotifications(newNotifications);
  }, [state]);

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, dismissNotification, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}

function getIconComponent(iconType: string) {
  switch (iconType) {
    case "AlertCircle":
      return AlertCircle;
    case "TrendingUp":
      return TrendingUp;
    case "CreditCard":
      return CreditCard;
    case "PiggyBank":
      return PiggyBank;
    case "Wallet":
      return Wallet;
    default:
      return Bell;
  }
}

function NotificationItem({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: (id: string) => void;
}) {
  const IconComponent = getIconComponent(notification.iconType);

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
          <IconComponent
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

export function NotificationCenter() {
  const { notifications, dismissNotification, markAllAsRead } =
    useNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

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
