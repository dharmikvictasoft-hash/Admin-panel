import type { AppNotification } from "../../context/NotificationContext";
import type { ReactNode } from "react";
import NotificationItem from "./NotificationItem";

type NotificationListProps = {
  notifications: AppNotification[];
  compact?: boolean;
  selectedId?: string | null;
  expandedId?: string | null;
  emptyTitle?: string;
  emptyMessage?: string;
  onNotificationClick?: (id: string) => void;
  onMarkRead?: (id: string) => void;
  renderExpandedContent?: (notification: AppNotification) => ReactNode;
};

function NotificationList({
  notifications,
  compact = false,
  selectedId,
  expandedId,
  emptyTitle = "No notifications yet",
  emptyMessage = "You're all caught up.",
  onNotificationClick,
  onMarkRead,
  renderExpandedContent,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center dark:border-gray-700">
        <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
          {emptyTitle}
        </h4>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className={`grid ${compact ? "gap-2.5" : "gap-3"}`}>
      {notifications.map((notification) => (
        <div key={notification.id}>
          <NotificationItem
            notification={notification}
            compact={compact}
            selected={selectedId === notification.id}
            onClick={() => onNotificationClick?.(notification.id)}
            onMarkRead={onMarkRead}
          />
          {expandedId === notification.id && renderExpandedContent ? (
            <div className="mt-2">
              {renderExpandedContent(notification)}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default NotificationList;
