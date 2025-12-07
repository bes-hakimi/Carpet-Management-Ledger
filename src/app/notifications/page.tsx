"use client";

import React, { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Bell } from "lucide-react";
import NotificationStatsCard from "./components/NotificationStatsCard";
import NotificationFilters from "./components/NotificationFilters";
import NotificationItem from "./components/NotificationItem";

import {
  useApiGet,
  useApiPut,
  useApiDeleteDynamic,
} from "@/hooks/useApi";

import toast from "react-hot-toast";
import { NOTIFICATION } from "@/endpoints/notification";

import type {
  ApiNotification,
  NotificationListResponse,
  NotificationFilterType,
  PriorityFilterType,
  ReadFilterType,
} from "@/types/notification/notifications";
import { ContentLoader } from "@/components/loading/DataLoading";

const NotificationsPage = () => {
  // -------------------------------- GET notifications --------------------------------
  const { data, isLoading } = useApiGet<NotificationListResponse>(
    "notification-list",
    NOTIFICATION.list
  );

  const notifications: ApiNotification[] = data?.data ?? [];

  // -------------------------------- DELETE mutation --------------------------------
  const deleteMutation = useApiDeleteDynamic<{ message: string }>();
  const [loadingDeleteId, setLoadingDeleteId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    const url = NOTIFICATION.delete(id);
    setLoadingDeleteId(id);

    try {
      await toast.promise(deleteMutation.mutateAsync(url), {
        loading: "در حال حذف...",
        success: "اعلان حذف شد",
        error: "خطا در حذف اعلان",
      });
    } finally {
      setLoadingDeleteId(null);
    }
  };

  // -------------------------- UPDATE mutation (Mark as Read) ------------------------
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loadingReadId, setLoadingReadId] = useState<number | null>(null);

  const updateMutation = useApiPut<ApiNotification, Partial<ApiNotification>>(
    selectedId ? NOTIFICATION.update(selectedId) : ""
  );

  const handleMarkAsRead = async (id: number) => {
    setSelectedId(id);
    setLoadingReadId(id);

    try {
      await toast.promise(updateMutation.mutateAsync({ is_read: true }), {
        loading: "در حال بروزرسانی...",
        success: "به عنوان خوانده شده علامت خورد",
        error: "خطا در بروزرسانی اعلان",
      });
    } finally {
      setLoadingReadId(null);
    }
  };

  // -------------------------------------- Filters -----------------------------------
  const [filter, setFilter] = useState<NotificationFilterType>("all");
  const [priorityFilter, setPriorityFilter] =
    useState<PriorityFilterType>("all");
  const [readFilter, setReadFilter] = useState<ReadFilterType>("all");

  // -------------------------------- Filtered Data -----------------------------------
  const filteredNotifications = useMemo<ApiNotification[]>(() => {
    return notifications.filter((n) => {
      const typeMatch = filter === "all" || n.type === filter;
      const priorityMatch =
        priorityFilter === "all" || n.priority === priorityFilter;
      const readMatch =
        readFilter === "all" ||
        (readFilter === "read" && n.is_read) ||
        (readFilter === "unread" && !n.is_read);

      return typeMatch && priorityMatch && readMatch;
    });
  }, [notifications, filter, priorityFilter, readFilter]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // -------------------------------------- JSX ---------------------------------------
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="اعلان‌ها"
          description={`مدیریت و مشاهده اطلاعیه‌ها • ${unreadCount} اعلان خوانده نشده`}
          showBackButton
          showHomeIcon
        />

        <NotificationStatsCard
          notificationsCount={notifications.length}
          unreadCount={unreadCount}
          onMarkAllRead={() => { }}
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
           <ContentLoader />
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-xs border border-gray-200/60 p-12 text-center">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                اعلانی یافت نشد
              </h3>
              <p className="text-gray-500">
                هیچ دیتایی با این فیلترها پیدا نشد.
              </p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onMarkAsRead={() => handleMarkAsRead(n.id)}
                onDelete={() => handleDelete(n.id)}
                markLoading={loadingReadId === n.id} 
                deleteLoading={loadingDeleteId === n.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
