import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageHeaderWithBreadcrumb from "../../components/common/PageHeaderWithBreadcrumb";
import ScrollReveal from "../../components/common/ScrollReveal";
import NotificationFilters from "../../components/notifications/NotificationFilters";
import NotificationList from "../../components/notifications/NotificationList";
import NotificationDetailPanel from "../../components/notifications/NotificationDetailPanel";
import { useNotifications } from "../../context/NotificationContext";
import type { NotificationType } from "../../context/NotificationContext";
import { sortNewestFirst } from "../../components/notifications/notificationUtils";

function Notify() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<"all" | NotificationType>("all");
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(
    null
  );

  const orderedNotifications = useMemo(
    () => sortNewestFirst(notifications),
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orderedNotifications.filter((notification) => {
      const matchesType = activeType === "all" || notification.type === activeType;
      const matchesTab = activeTab === "all" || !notification.read;
      const matchesSearch =
        query.length === 0 ||
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query) ||
        notification.type.toLowerCase().includes(query) ||
        (notification.actorName || "").toLowerCase().includes(query);

      return matchesType && matchesTab && matchesSearch;
    });
  }, [activeType, activeTab, orderedNotifications, search]);

  const highPriorityUnreadCount = useMemo(
    () =>
      notifications.filter(
        (notification) => !notification.read && notification.priority === "high"
      ).length,
    [notifications]
  );

  const typeCount = useMemo(() => {
    return notifications.reduce<Record<NotificationType, number>>(
      (countMap, notification) => {
        countMap[notification.type] += 1;
        return countMap;
      },
      {
        system: 0,
        orders: 0,
        users: 0,
        billing: 0,
        security: 0,
        marketing: 0,
      }
    );
  }, [notifications]);

  useEffect(() => {
    if (!selectedNotificationId) return;
    const selectedStillExists = filteredNotifications.some(
      (notification) => notification.id === selectedNotificationId
    );
    if (!selectedStillExists) {
      setSelectedNotificationId(null);
    }
  }, [filteredNotifications, selectedNotificationId]);

  useEffect(() => {
    const notificationFromQuery = searchParams.get("notification");
    if (!notificationFromQuery) return;

    setActiveType("all");
    setActiveTab("all");
    setSearch("");
    setSelectedNotificationId(notificationFromQuery);
  }, [searchParams]);

  const handleOpenNotification = (id: string) => {
    setSelectedNotificationId((previous) => {
      const nextSelectedId = previous === id ? null : id;
      if (nextSelectedId) {
        setSearchParams({ notification: nextSelectedId });
      } else {
        setSearchParams({});
      }
      return nextSelectedId;
    });
    markAsRead(id);
  };

  const openedNotificationList = useMemo(() => {
    if (!selectedNotificationId) return filteredNotifications;
    return filteredNotifications.filter(
      (notification) => notification.id === selectedNotificationId
    );
  }, [filteredNotifications, selectedNotificationId]);

  return (
    <>
      <PageMeta
        title="Notifications"
        description="Central notification hub for all operational updates"
      />

      <div className="px-1 sm:px-0 sm:ml-[15px] sm:mr-[15px]">
        <ScrollReveal origin="left" delay={0.1} className="relative z-10">
          <PageHeaderWithBreadcrumb
            title="Notifications"
            crumbs={[
              { label: "Dashboard", to: "/dashboard" },
              { label: "Notifications" },
            ]}
          />
        </ScrollReveal>

        <ScrollReveal origin="top" delay={0.14} className="relative z-10">
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-white to-gray-50 p-5 dark:border-gray-800 dark:from-gray-900 dark:to-gray-800">
              <p className="text-xs uppercase tracking-wide text-gray-500">Total Alerts</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-white/90">
                {notifications.length}
              </p>
            </div>
            <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-5 dark:border-orange-900/40 dark:from-orange-950/20 dark:to-gray-900">
              <p className="text-xs uppercase tracking-wide text-orange-700 dark:text-orange-300">
                Unread
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-white/90">
                {unreadCount}
              </p>
            </div>
            <div className="rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 to-white p-5 dark:border-red-900/40 dark:from-red-950/20 dark:to-gray-900">
              <p className="text-xs uppercase tracking-wide text-red-700 dark:text-red-300">
                High Priority Unread
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-white/90">
                {highPriorityUnreadCount}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-xs uppercase tracking-wide text-gray-500">Orders & Billing</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-white/90">
                {typeCount.orders + typeCount.billing}
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal origin="right" delay={0.18} className="relative z-10">
          <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search notifications, users, categories..."
                className="h-11 w-full rounded-lg border border-gray-200 px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 lg:max-w-xl"
              />
              <button
                type="button"
                onClick={markAllAsRead}
                className="h-11 w-full rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600 sm:w-auto"
              >
                Mark All As Read
              </button>
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-5 grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
          <ScrollReveal origin="left" delay={0.22} className="relative z-10">
            <NotificationFilters
              activeType={activeType}
              onTypeChange={setActiveType}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </ScrollReveal>

          <ScrollReveal origin="top" delay={0.25} className="relative z-10">
            <div className="rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white/90">
                  Notification Feed
                </h2>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {openedNotificationList.length} items
                </span>
              </div>
              {selectedNotificationId ? (
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedNotificationId(null);
                      setSearchParams({});
                    }}
                    className="inline-flex h-9 w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    Back to all notifications
                  </button>
                </div>
              ) : null}
              <NotificationList
                notifications={openedNotificationList}
                selectedId={selectedNotificationId}
                expandedId={selectedNotificationId}
                onNotificationClick={handleOpenNotification}
                onMarkRead={markAsRead}
                emptyTitle="No matching notifications"
                emptyMessage="Try changing your filters or search query."
                renderExpandedContent={(notification) => (
                  <NotificationDetailPanel notification={notification} inline />
                )}
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </>
  );
}

export default Notify;
