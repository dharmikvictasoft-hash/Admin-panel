import type { NotificationType } from "../../context/NotificationContext";
import { notificationTypeLabels } from "./notificationUtils";

type NotificationFiltersProps = {
  activeType: "all" | NotificationType;
  onTypeChange: (type: "all" | NotificationType) => void;
  activeTab: "all" | "unread";
  onTabChange: (tab: "all" | "unread") => void;
};

const allTypes: Array<"all" | NotificationType> = [
  "all",
  "system",
  "orders",
  "users",
  "billing",
  "security",
  "marketing",
];

function NotificationFilters({
  activeType,
  onTypeChange,
  activeTab,
  onTabChange,
}: NotificationFiltersProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-wrap gap-2">
        {allTypes.map((type) => {
          const label = type === "all" ? "All Types" : notificationTypeLabels[type];
          const isActive = activeType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onTypeChange(type)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                isActive
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-brand-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
        <button
          type="button"
          onClick={() => onTabChange("all")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
            activeTab === "all"
              ? "bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white"
              : "text-gray-600 dark:text-gray-300"
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => onTabChange("unread")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
            activeTab === "unread"
              ? "bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white"
              : "text-gray-600 dark:text-gray-300"
          }`}
        >
          Unread
        </button>
      </div>
    </div>
  );
}

export default NotificationFilters;
