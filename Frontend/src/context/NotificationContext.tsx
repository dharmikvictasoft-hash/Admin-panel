import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type NotificationType =
  | "system"
  | "orders"
  | "users"
  | "billing"
  | "security"
  | "marketing";

export type NotificationPriority = "low" | "medium" | "high";

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  createdAt: string;
  read: boolean;
  actorName?: string;
  actorAvatar?: string;
  actionLabel?: string;
  actionPath?: string;
};

type NotificationContextValue = {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

const initialNotifications: AppNotification[] = [
  {
    id: "n-1",
    title: "New subscription purchased",
    message: "A Pro yearly subscription was purchased by Olivia Bennett.",
    type: "billing",
    priority: "medium",
    createdAt: "2026-02-23T08:40:00.000Z",
    read: false,
    actorName: "Olivia Bennett",
    actorAvatar: "/images/user/user-03.jpg",
    actionLabel: "Review Plan",
    actionPath: "/subscriptions",
  },
  {
    id: "n-2",
    title: "Food item pending approval",
    message: "3 new food entries need moderation from your team.",
    type: "orders",
    priority: "high",
    createdAt: "2026-02-23T08:10:00.000Z",
    read: false,
    actorName: "Moderation Bot",
    actionLabel: "Open Food DB",
    actionPath: "/food",
  },
  {
    id: "n-3",
    title: "Password changed successfully",
    message: "Your admin account password was updated 2 hours ago.",
    type: "security",
    priority: "medium",
    createdAt: "2026-02-23T06:20:00.000Z",
    read: false,
    actorName: "Security Service",
  },
  {
    id: "n-4",
    title: "New user registered",
    message: "A new user signed up with goal: Weight Loss.",
    type: "users",
    priority: "low",
    createdAt: "2026-02-22T16:45:00.000Z",
    read: true,
    actorName: "Aarav Sharma",
    actorAvatar: "/images/user/user-02.jpg",
    actionLabel: "Open Users",
    actionPath: "/users",
  },
  {
    id: "n-5",
    title: "Weekly campaign completed",
    message: "The February retention campaign reached 78% completion.",
    type: "marketing",
    priority: "low",
    createdAt: "2026-02-22T12:25:00.000Z",
    read: true,
    actorName: "Campaign Engine",
  },
  {
    id: "n-6",
    title: "System maintenance reminder",
    message: "Planned maintenance starts tonight at 11:30 PM.",
    type: "system",
    priority: "high",
    createdAt: "2026-02-22T10:05:00.000Z",
    read: false,
    actorName: "Platform Ops",
  },
  {
    id: "n-7",
    title: "Meal plan assigned",
    message: "A meal plan was assigned to 24 active users.",
    type: "orders",
    priority: "medium",
    createdAt: "2026-02-21T15:00:00.000Z",
    read: true,
    actorName: "Nutrition Team",
    actionLabel: "View Meal Plans",
    actionPath: "/meals",
  },
  {
    id: "n-8",
    title: "Invoice paid",
    message: "Invoice #INV-4203 has been paid and reconciled.",
    type: "billing",
    priority: "low",
    createdAt: "2026-02-21T11:30:00.000Z",
    read: true,
    actorName: "Finance Bot",
  },
];

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] =
    useState<AppNotification[]>(initialNotifications);

  const markAsRead = (id: string) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.read ? notification : { ...notification, read: true }
      )
    );
  };

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: notifications.filter((notification) => !notification.read).length,
      markAsRead,
      markAllAsRead,
    }),
    [notifications]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
};
