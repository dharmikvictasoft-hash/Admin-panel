import type { AppNotification } from "../../context/NotificationContext";
import { Link } from "react-router-dom";
import {
  formatNotificationTime,
  notificationTypeLabels,
  priorityClassMap,
  typeDotClassMap,
} from "./notificationUtils";

type NotificationItemProps = {
  notification: AppNotification;
  compact?: boolean;
  selected?: boolean;
  onClick?: () => void;
  onMarkRead?: (id: string) => void;
};

function NotificationItem({
  notification,
  compact = false,
  selected = false,
  onClick,
  onMarkRead,
}: NotificationItemProps) {
  return (
    <div
      className={`group flex items-start gap-3 rounded-xl border p-3 transition ${
        selected
          ? "border-brand-300 bg-brand-50/80 ring-1 ring-brand-200"
          : notification.read
          ? "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
          : "border-brand-100 bg-brand-50/70 hover:border-brand-200"
      } ${compact ? "px-3 py-2.5" : "px-4 py-3.5"} ${
        onClick ? "cursor-pointer" : ""
      } dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700`}
      onClick={onClick}
    >
      <div className="relative shrink-0">
        {notification.actorAvatar ? (
          <img
            src={notification.actorAvatar}
            alt={notification.actorName || "notification"}
            className={`${compact ? "h-9 w-9" : "h-11 w-11"} rounded-full object-cover`}
          />
        ) : (
          <div
            className={`${compact ? "h-9 w-9 text-xs" : "h-11 w-11"} flex items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200`}
          >
            {(notification.actorName || "N").slice(0, 1).toUpperCase()}
          </div>
        )}
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${typeDotClassMap[notification.type]} dark:border-gray-900`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <h4 className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">
            {notification.title}
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatNotificationTime(notification.createdAt)}
          </span>
        </div>

        <p
          className={`text-gray-600 dark:text-gray-300 ${
            compact ? "line-clamp-2 text-xs" : "line-clamp-2 text-sm"
          }`}
        >
          {notification.message}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {notificationTypeLabels[notification.type]}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${priorityClassMap[notification.priority]}`}
          >
            {notification.priority}
          </span>

          {!notification.read && onMarkRead ? (
            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onMarkRead(notification.id);
                }}
                className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                Mark read
              </button>
              {notification.actionPath ? (
                <Link
                  to={notification.actionPath}
                  className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
                  onClick={(event) => event.stopPropagation()}
                >
                  {notification.actionLabel || "Open"}
                </Link>
              ) : null}
            </div>
          ) : notification.actionPath ? (
            <div className="ml-auto">
              <Link
                to={notification.actionPath}
                className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
                onClick={(event) => event.stopPropagation()}
              >
                {notification.actionLabel || "Open"}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default NotificationItem;
