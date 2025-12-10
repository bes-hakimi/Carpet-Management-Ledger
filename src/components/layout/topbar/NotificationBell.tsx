"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, X, CheckCircle2, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useApiGet } from "@/hooks/useApi";
import { NOTIFICATION } from "@/endpoints/notification";
import type { ApiNotification, NotificationListResponse } from "@/types/notification/notifications";
import type { ApiError } from "@/types/api/api";
import { Button, OutlineButton } from "@/components/ui/Button";
import apiClient from "@/hooks/apiClient";
import { ContentLoader } from "@/components/loading/DataLoading";

export default function NotificationBell() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  // دریافت اعلان‌ها
  const { data, refetch, isLoading } = useApiGet<NotificationListResponse>(
    "notification-list",
    NOTIFICATION.list
  );

  const notifications: ApiNotification[] = data?.data ?? [];
  const unreadNotifications = notifications.filter((n) => !n.is_read);

  // بستن مدال با کلیک بیرون
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // تابع خواندن اعلان
  const handleMarkAsRead = async (id: number) => {
    if (loadingIds.includes(id)) return;
    setLoadingIds(prev => [...prev, id]);

    try {
      // اطمینان از اینکه Promise استاندارد جاوااسکریپت است
      const markPromise: Promise<ApiNotification> = new Promise((resolve, reject) => {
        apiClient
          .put<ApiNotification>(NOTIFICATION.update(id), { is_read: true })
          .then(res => resolve(res.data))
          .catch(err => reject(err));
      });

      await toast.promise(markPromise, {
        loading: "در حال بروزرسانی...",
        success: "اعلان خوانده شد",
        error: "خطا در بروزرسانی اعلان",
      });

      refetch();
    } catch (error) {
      const err = error as ApiError;
      console.error(
        "Failed to mark notification as read:",
        err.response?.data?.message ?? err.message
      );
    } finally {
      setLoadingIds(prev => prev.filter(i => i !== id));
    }
  };


  const handleViewAll = () => {
    setIsOpen(false);
    router.push("/notifications");
  };

  return (
    <div className="relative" ref={modalRef}>
      <button
        className="relative p-2 rounded-md hover:bg-primary-100 transition-colors duration-200 group"
        onClick={() => setIsOpen(prev => !prev)}
      >
        <Bell
          size={22}
          className="text-gray-600 group-hover:text-gray-800 transition-colors"
        />
        {unreadNotifications.length > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            <span className="pt-[2px]">
            {unreadNotifications.length}
            </span>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 md:w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 animate-in fade-in-0 zoom-in-95">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-600 rounded-md">
                  <Bell size={18} className="text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">اعلان‌ها</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {unreadNotifications.length} اعلان خوانده نشده
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={16} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <ContentLoader />
              </div>
            ) : unreadNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 size={48} className="text-primary-400 mb-3" />
                <p className="text-sm font-medium text-gray-900">همه اعلان‌ها خوانده شدند</p>
                <p className="text-xs text-gray-500 mt-1">هیچ اعلان جدیدی ندارید</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {unreadNotifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                    onClick={() => router.push("/notifications")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </p>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {notification.message}
                        </p>
                        {notification.created_at && (
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notification.created_at).toLocaleDateString("fa-IR")}
                          </p>
                        )}
                      </div>

                      <OutlineButton
                        size="xs"
                        loading={loadingIds.includes(notification.id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        className="md:opacity-0 md:group-hover:opacity-100 transition-opacity flex flex-nowrap"
                        icon={<CheckCircle2 size={14} />}
                      >
                        خواند شد
                      </OutlineButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {unreadNotifications.length > 0 && (
            <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
              <Button
                onClick={handleViewAll}
                className="w-full flex items-center justify-center gap-2"
                icon={<ExternalLink size={14} />}
              >
                مشاهده همه اعلان‌ها
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
