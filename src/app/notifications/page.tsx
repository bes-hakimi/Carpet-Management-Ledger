"use client";

import React, { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Bell } from "lucide-react";
import NotificationStatsCard from "./components/NotificationStatsCard";
import NotificationFilters from "./components/NotificationFilters";
import NotificationItem from "./components/NotificationItem";

import { useApiGet } from "@/hooks/useApi";
import { NOTIFICATION } from "@/endpoints/notification";
import type { ApiNotification, NotificationListResponse, NotificationType } from "@/types/notification/notifications";

const NotificationsPage = () => {
  // دریافت داده واقعی از API
  const { data, isLoading } = useApiGet<NotificationListResponse>(
    "notification-list",
    NOTIFICATION.list
  );

  const notifications: ApiNotification[] = data?.data ?? [];

  // ---------------------- Filters ---------------------
  const [filter, setFilter] = useState<NotificationType | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [readFilter, setReadFilter] = useState<"all" | "read" | "unread">("all");

  // -------------------- Filtered Data -----------------
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const typeMatch = filter === "all" || n.type === filter;
      const priorityMatch = priorityFilter === "all" || n.priority === priorityFilter;
      const readMatch =
        readFilter === "all" ||
        (readFilter === "read" && n.is_read) ||
        (readFilter === "unread" && !n.is_read);

      return typeMatch && priorityMatch && readMatch;
    });
  }, [notifications, filter, priorityFilter, readFilter]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">

        <PageHeader
          title="اعلان‌ها"
          description={`مدیریت و مشاهده اطلاعیه‌ها • ${unreadCount} اعلان خوانده نشده`}
          showBackButton
          showHomeIcon
          backUrl="/dashboard"
        />

        <NotificationStatsCard
          notificationsCount={notifications.length}
          unreadCount={unreadCount}
          onMarkAllRead={() => {}} // بعدا اضافه می‌کنیم
        />

        <NotificationFilters
          filter={filter}
          readFilter={readFilter}
          priorityFilter={priorityFilter}
          setFilter={setFilter}
          setReadFilter={setReadFilter}
          setPriorityFilter={setPriorityFilter}
          filteredCount={filteredNotifications.length}
          totalCount={notifications.length}
        />

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center p-6">در حال بارگذاری...</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-xs border border-gray-200/60 p-12 text-center">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">اعلانی یافت نشد</h3>
              <p className="text-gray-500">هیچ داده‌ای با این فیلترها پیدا نشد.</p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onMarkAsRead={() => {}}
                onDelete={() => {}}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
