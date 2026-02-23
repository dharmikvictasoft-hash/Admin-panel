import type {
  AppNotification,
  NotificationPriority,
  NotificationType,
} from "../../context/NotificationContext";

export const notificationTypeLabels: Record<NotificationType, string> = {
  system: "System",
  orders: "Orders",
  users: "Users",
  billing: "Billing",
  security: "Security",
  marketing: "Marketing",
};

export const priorityClassMap: Record<NotificationPriority, string> = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-red-100 text-red-700",
};

export const typeDotClassMap: Record<NotificationType, string> = {
  system: "bg-indigo-500",
  orders: "bg-amber-500",
  users: "bg-emerald-500",
  billing: "bg-cyan-500",
  security: "bg-rose-500",
  marketing: "bg-violet-500",
};

export const formatNotificationTime = (isoDate: string): string => {
  const time = new Date(isoDate).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - time);

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return "just now";
  if (diffMs < hour) return `${Math.floor(diffMs / minute)} min ago`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)} hr ago`;
  const days = Math.floor(diffMs / day);
  return days === 1 ? "1 day ago" : `${days} days ago`;
};

export const sortNewestFirst = (
  notifications: AppNotification[]
): AppNotification[] => {
  return [...notifications].sort(
    (first, second) =>
      new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
  );
};
