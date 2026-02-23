import { Link } from "react-router-dom";
import type { AppNotification } from "../../context/NotificationContext";
import {
  formatNotificationTime,
  notificationTypeLabels,
  priorityClassMap,
} from "./notificationUtils";

type NotificationDetailPanelProps = {
  notification: AppNotification | null;
  inline?: boolean;
};

function NotificationDetailPanel({
  notification,
  inline = false,
}: NotificationDetailPanelProps) {
  if (!notification) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white ${
        inline ? "p-4" : "p-5"
      } dark:border-gray-800 dark:bg-gray-900`}
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90">
          {notification.title}
        </h3>
        {!notification.read ? (
          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
            unread
          </span>
        ) : null}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {notificationTypeLabels[notification.type]}
        </span>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${priorityClassMap[notification.priority]}`}
        >
          {notification.priority}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatNotificationTime(notification.createdAt)}
        </span>
      </div>

      <div className={`mb-4 rounded-xl bg-gray-50 ${inline ? "p-3.5" : "p-4"} dark:bg-gray-800/60`}>
        <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
          {notification.message}
        </p>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-300">
        <p className="font-medium">
          From:{" "}
          <span className="font-normal">{notification.actorName || "System"}</span>
        </p>
      </div>

      {notification.actionPath ? (
        <div className="mt-5">
          <Link
            to={notification.actionPath}
            className="inline-flex h-10 items-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            {notification.actionLabel || "Open"}
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export default NotificationDetailPanel;
