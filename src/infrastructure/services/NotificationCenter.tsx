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
  Calendar,
  DollarSign,
  CheckCircle,
  Filter,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { State } from "@/src/entities/models/dashboard/state";
import {
  NotificationService,
  Notification,
  NotificationType,
} from "@/src/infrastructure/services/NotificationService";
import { NotificationDataService } from "@/src/infrastructure/services/NotificationDataService";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  dismissNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAllNotifications: () => void;
  filterNotifications: (category?: string, type?: NotificationType) => Notification[];
  refreshNotifications: () => Promise<void>;
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<State | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Charger les notifications depuis la base de données au démarrage
  useEffect(() => {
    if (typeof window !== 'undefined' && !initialized) {
      setInitialized(true);
      loadNotificationsFromDatabase();
    }
  }, [initialized]);

  // Rafraîchir les notifications toutes les 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadNotificationsFromDatabase();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Fonction pour charger uniquement les notifications depuis la base de données
  const loadNotificationsFromDatabase = async () => {
    try {
      setIsLoading(true);
      
      // Récupérer les notifications existantes depuis la base de données
      const dbNotifications = await NotificationDataService.fetchNotifications();
      
      // Mettre à jour l'état local avec les notifications de la base de données
      setNotifications(dbNotifications);
    } catch (error) {
      console.error("Erreur lors du chargement des notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour rafraîchir les notifications et générer de nouvelles
  const refreshNotifications = async () => {
    try {
      setIsLoading(true);
      
      // Vérifier si la dernière synchronisation a été faite il y a moins de 5 minutes
      const now = new Date();
      if (lastSyncTime && (now.getTime() - lastSyncTime.getTime()) < 5 * 60 * 1000) {
        // Si oui, simplement charger les notifications existantes
        await loadNotificationsFromDatabase();
        return;
      }
      
      // Récupérer les données depuis la base de données pour générer de nouvelles notifications
      const newState = await NotificationDataService.fetchNotificationData();
      
      if (newState) {
        setState(newState);
        
        // Récupérer les notifications existantes depuis la base de données
        const dbNotifications = await NotificationDataService.fetchNotifications();
        
        // Générer les nouvelles notifications
        const newNotifications = NotificationService.generateNotifications(newState);
        
        // Fusionner avec les notifications existantes pour préserver l'état "lu"
        const mergedNotifications = NotificationService.mergeNotifications(
          dbNotifications,
          newNotifications
        );
        
        // Mettre à jour les notifications en base de données
        await NotificationDataService.syncNotifications(mergedNotifications);
        
        // Mettre à jour la date de dernière synchronisation
        setLastSyncTime(new Date());
        
        // Récupérer à nouveau les notifications après synchronisation
        const updatedNotifications = await NotificationDataService.fetchNotifications();
        
        // Mettre à jour l'état local
        setNotifications(updatedNotifications);
      }
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const dismissNotification = async (id: string) => {
    try {
      // Supprimer la notification de la base de données
      await NotificationDataService.deleteNotification(id);
      
      // Mettre à jour l'état local
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification:", error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      // Marquer la notification comme lue dans la base de données
      await NotificationDataService.markAsRead(id);
      
      // Mettre à jour l'état local
      setNotifications((prev) => {
        return prev.map((n) => 
          n.id === id ? { ...n, read: true } : n
        );
      });
    } catch (error) {
      console.error("Erreur lors du marquage de la notification comme lue:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Marquer toutes les notifications comme lues dans la base de données
      await NotificationDataService.markAllAsRead();
      
      // Mettre à jour l'état local
      setNotifications((prev) => {
        return prev.map((n) => ({ ...n, read: true }));
      });
    } catch (error) {
      console.error("Erreur lors du marquage de toutes les notifications comme lues:", error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      // Supprimer toutes les notifications de la base de données
      await NotificationDataService.clearAllNotifications();
      
      // Mettre à jour l'état local
      setNotifications([]);
    } catch (error) {
      console.error("Erreur lors de la suppression de toutes les notifications:", error);
    }
  };

  const filterNotifications = (category?: string, type?: NotificationType) => {
    return notifications.filter(n => 
      (!category || n.category === category) && 
      (!type || n.type === type)
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ 
        notifications, 
        unreadCount,
        dismissNotification, 
        markAsRead,
        markAllAsRead, 
        clearAllNotifications,
        filterNotifications,
        refreshNotifications,
        isLoading
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
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
    case "Calendar":
      return Calendar;
    case "DollarSign":
      return DollarSign;
    default:
      return Bell;
  }
}

function getTypeColor(type: NotificationType) {
  switch (type) {
    case "critical":
      return "bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30";
    case "warning":
      return "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border-amber-500/30";
    case "info":
      return "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-blue-500/30";
    case "success":
      return "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-emerald-500/30";
    default:
      return "bg-slate-500/20 text-slate-400 hover:bg-slate-500/30 border-slate-500/30";
  }
}

function getCategoryLabel(category: string) {
  switch (category) {
    case "budget":
      return "Budget";
    case "savings":
      return "Épargne";
    case "expenses":
      return "Dépenses";
    case "debt":
      return "Dettes";
    case "system":
      return "Système";
    default:
      return category.charAt(0).toUpperCase() + category.slice(1);
  }
}

function formatRelativeTime(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return "à l'instant";
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `il y a ${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''}`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `il y a ${diffInHours} h${diffInHours > 1 ? 's' : ''}`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
  }
  
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function NotificationItem({
  notification,
  onDismiss,
  onMarkAsRead,
}: {
  notification: Notification;
  onDismiss: (id: string) => void;
  onMarkAsRead: (id: string) => void;
}) {
  const IconComponent = getIconComponent(notification.iconType);
  const router = useRouter();

  const handleAction = () => {
    if (notification.action) {
      notification.action.onClick();
      if (notification.action.route) {
        router.push(notification.action.route);
      }
    }
    onMarkAsRead(notification.id);
  };

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
            notification.type === "critical" && "bg-red-500/20",
            notification.type === "warning" && "bg-amber-500/20",
            notification.type === "info" && "bg-blue-500/20",
            notification.type === "success" && "bg-emerald-500/20"
          )}
        >
          <IconComponent
            className={cn(
              "h-5 w-5",
              notification.type === "critical" && "text-red-400",
              notification.type === "warning" && "text-amber-400",
              notification.type === "info" && "text-blue-400",
              notification.type === "success" && "text-emerald-400"
            )}
          />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-white">{notification.title}</p>
                {!notification.read && (
                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                )}
              </div>
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
            <div className="flex items-center gap-2">
              <time className="text-xs text-slate-500">
                {formatRelativeTime(notification.timestamp)}
              </time>
              <Badge className={cn("text-xs", getTypeColor(notification.type))}>
                {getCategoryLabel(notification.category)}
              </Badge>
            </div>
            {notification.action && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAction}
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
  const { 
    notifications, 
    unreadCount, 
    dismissNotification, 
    markAsRead,
    markAllAsRead, 
    clearAllNotifications,
    filterNotifications,
    refreshNotifications,
    isLoading
  } = useNotifications();
  
  const [activeTab, setActiveTab] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<{
    category?: string;
    type?: NotificationType;
  }>({});

  const filteredNotifications = activeFilter.category || activeFilter.type
    ? filterNotifications(activeFilter.category, activeFilter.type)
    : notifications;

  const displayedNotifications = activeTab === "all" 
    ? filteredNotifications 
    : filteredNotifications.filter(n => activeTab === "unread" ? !n.read : n.read);

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    if (activeTab === "unread" && displayedNotifications.length === 1) {
      setActiveTab("all");
    }
  };

  const handleClearFilter = () => {
    setActiveFilter({});
  };

  const handleRefresh = async () => {
    await refreshNotifications();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button 
          className="relative p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
          onClick={() => setIsOpen(true)}
        >
          <Bell className="h-5 w-5 text-slate-400" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-medium text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 border-slate-700/50 p-0 flex flex-col"
      >
        <SheetHeader className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <Badge className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border-rose-500/30">
                  {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
                </Badge>
              )}
            </SheetTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={isLoading}
                className="h-8 w-8 text-slate-400 hover:text-white"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border-slate-700 text-slate-200">
                  <DropdownMenuLabel>Filtrer par</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuLabel className="text-xs text-slate-400">Catégorie</DropdownMenuLabel>
                  {["budget", "savings", "expenses", "debt"].map((category) => (
                    <DropdownMenuItem 
                      key={category}
                      className={cn(
                        "cursor-pointer",
                        activeFilter.category === category && "bg-slate-700"
                      )}
                      onClick={() => setActiveFilter(prev => ({ ...prev, category }))}
                    >
                      {getCategoryLabel(category)}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuLabel className="text-xs text-slate-400">Type</DropdownMenuLabel>
                  {["critical", "warning", "info", "success"].map((type) => (
                    <DropdownMenuItem 
                      key={type}
                      className={cn(
                        "cursor-pointer",
                        activeFilter.type === type && "bg-slate-700"
                      )}
                      onClick={() => setActiveFilter(prev => ({ ...prev, type: type as NotificationType }))}
                    >
                      <Badge className={cn("mr-2", getTypeColor(type as NotificationType))}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Badge>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem 
                    className="cursor-pointer text-blue-400 hover:text-blue-300"
                    onClick={handleClearFilter}
                  >
                    Effacer les filtres
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Tout lire
                </Button>
              )}
            </div>
          </div>
          
          {(activeFilter.category || activeFilter.type) && (
            <div className="flex items-center gap-2 mt-2">
              <p className="text-xs text-slate-400">Filtres actifs:</p>
              {activeFilter.category && (
                <Badge className="bg-slate-700 text-slate-300 hover:bg-slate-600">
                  {getCategoryLabel(activeFilter.category)}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => setActiveFilter(prev => ({ ...prev, category: undefined }))}
                  />
                </Badge>
              )}
              {activeFilter.type && (
                <Badge className={cn(getTypeColor(activeFilter.type))}>
                  {activeFilter.type.charAt(0).toUpperCase() + activeFilter.type.slice(1)}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => setActiveFilter(prev => ({ ...prev, type: undefined }))}
                  />
                </Badge>
              )}
            </div>
          )}
        </SheetHeader>

        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <TabsList className="grid grid-cols-3 p-1 mx-6 mt-4 bg-slate-800/50">
            <TabsTrigger 
              value="all"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
            >
              Toutes
            </TabsTrigger>
            <TabsTrigger 
              value="unread"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
            >
              Non lues
            </TabsTrigger>
            <TabsTrigger 
              value="read"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
            >
              Lues
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="flex-1 p-0 m-0">
            <ScrollArea className="flex-1 h-[calc(100vh-220px)]">
              <div className="p-6">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-12 w-12 rounded-full border-4 border-slate-700 border-t-slate-400 animate-spin mb-4"></div>
                    <h3 className="text-lg font-medium text-white mb-2">
                      Chargement des notifications...
                    </h3>
                    <p className="text-sm text-slate-400">
                      Nous récupérons vos dernières notifications
                    </p>
                  </div>
                ) : displayedNotifications.length > 0 ? (
                  <div className="space-y-4">
                    {displayedNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onDismiss={dismissNotification}
                        onMarkAsRead={handleMarkAsRead}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Bell className="h-12 w-12 text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      {activeFilter.category || activeFilter.type
                        ? "Aucune notification ne correspond aux filtres"
                        : "Pas de notifications"}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {activeFilter.category || activeFilter.type
                        ? "Essayez de modifier ou supprimer les filtres"
                        : "Vous serez notifié des événements importants concernant vos finances"}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="unread" className="flex-1 p-0 m-0">
            <ScrollArea className="flex-1 h-[calc(100vh-220px)]">
              <div className="p-6">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-12 w-12 rounded-full border-4 border-slate-700 border-t-slate-400 animate-spin mb-4"></div>
                    <h3 className="text-lg font-medium text-white mb-2">
                      Chargement des notifications...
                    </h3>
                    <p className="text-sm text-slate-400">
                      Nous récupérons vos dernières notifications
                    </p>
                  </div>
                ) : displayedNotifications.length > 0 ? (
                  <div className="space-y-4">
                    {displayedNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onDismiss={dismissNotification}
                        onMarkAsRead={handleMarkAsRead}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle className="h-12 w-12 text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      Toutes les notifications ont été lues
                    </h3>
                    <p className="text-sm text-slate-400">
                      Vous n'avez aucune notification non lue pour le moment
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="read" className="flex-1 p-0 m-0">
            <ScrollArea className="flex-1 h-[calc(100vh-220px)]">
              <div className="p-6">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-12 w-12 rounded-full border-4 border-slate-700 border-t-slate-400 animate-spin mb-4"></div>
                    <h3 className="text-lg font-medium text-white mb-2">
                      Chargement des notifications...
                    </h3>
                    <p className="text-sm text-slate-400">
                      Nous récupérons vos dernières notifications
                    </p>
                  </div>
                ) : displayedNotifications.length > 0 ? (
                  <div className="space-y-4">
                    {displayedNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onDismiss={dismissNotification}
                        onMarkAsRead={handleMarkAsRead}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Bell className="h-12 w-12 text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      Aucune notification lue
                    </h3>
                    <p className="text-sm text-slate-400">
                      Vous n'avez pas encore marqué de notifications comme lues
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {notifications.length > 0 && (
          <SheetFooter className="p-4 border-t border-slate-700/50">
            <Button
              variant="destructive"
              size="sm"
              onClick={clearAllNotifications}
              className="w-full bg-red-900/30 hover:bg-red-900/50 text-red-400"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Effacer toutes les notifications
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

