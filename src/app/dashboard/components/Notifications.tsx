"use client";

import { Card } from "@/components/ui/Card";
import { Clock, ArrowLeft, Bell, User, AlertTriangle, Package, ShoppingBag } from "lucide-react";
import { useApiGet } from "@/hooks/useApi";
import { NOTIFICATION } from "@/endpoints/notification";
import { NotificationListResponse, ApiNotification } from "@/types/notification/notifications";
import { useRouter } from "next/navigation";
import { CardLoader } from "@/components/loading/DataLoading";

export default function Notifications() {
  const router = useRouter();

  const { data, isLoading } = useApiGet<NotificationListResponse>(
    "notifications-list",
    NOTIFICATION.list
  );

  // ۳ اعلان آخر، فرقی ندارد خوانده شده باشند یا نه
  const latestNotifications: ApiNotification[] = (data?.data ?? []).slice(0, 3);
  const totalCount = data?.count ?? 0;

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-amber-50 border-amber-200 text-amber-700";
      case "urgent":
        return "bg-rose-50 border-rose-200 text-rose-700";
      case "success":
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      case "product":
      case "inventory":
        return "bg-primary-50 border-primary-200 text-primary-700"; // رنگ برند
      case "sales":
        return "bg-indigo-50 border-indigo-200 text-indigo-700";
      case "info":
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4" />;
      case "urgent":
        return <Clock className="w-4 h-4" />;
      case "success":
        return <Bell className="w-4 h-4" />;
      case "product":
      case "inventory":
        return <Package className="w-4 h-4" />;
      case "sales":
        return <ShoppingBag className="w-4 h-4" />;
      case "info":
      default:
        return <User className="w-4 h-4" />;
    }
  };

  // تبدیل تاریخ به شمسی (YYYY/M/D)
  const formatPersianDate = (isoString: string) => {
    const dt = new Date(isoString);
    return dt.toLocaleDateString("fa-IR");
  };

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm border border-gray-200/60 shadow-xs hover:shadow-md transition-all duration-300">
      <div className="p-0 md:p-6">
        {/* سربرگ */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-full flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div className="w-full flex justify-between items-center">
              <h2 className="text-lg font-semibold text-primary-600">آخرین اعلان‌ها</h2>
              <p className="text-sm text-gray-600 mt-1">
                نمایش {latestNotifications.length} اعلان از {totalCount}
              </p>
            </div>
          </div>
        </div>

        {/* لیست آگاه‌سازی‌ها */}
        <div className="space-y-3">
          {isLoading ? (
            <CardLoader />
          ) : latestNotifications.length === 0 ? (
            <div className="rounded-lg shadow-xs border border-gray-200/60 p-12 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-700">
                اعلانی یافت نشد
              </h3>
              <p className="text-sm text-gray-500">
                هیچ اعلانی وجود ندارد.
              </p>
            </div>
          ) : (
            latestNotifications.map((note) => (
              <div
                key={note.id}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-sm group ${!note.is_read ? "border-primary-200 bg-primary-50/50" : "border-gray-200/60 bg-white"
                  }`}
              >
                {/* آیکون */}
                <div
                  className={`p-2 rounded-md border-2 ${getNotificationColor(note.type)}`}
                >
                  {getNotificationIcon(note.type)}
                </div>

                {/* محتوا */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p
                      className={`text-sm font-medium leading-relaxed ${!note.is_read ? "text-gray-900" : "text-gray-700"
                        }`}
                    >
                      {note.message}
                    </p>
                    {!note.is_read && (
                      <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2 animate-pulse"></div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatPersianDate(note.created_at)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* پاورقی */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200/60">
          <div className="text-sm text-gray-600">
            نمایش {latestNotifications.length} اعلان
          </div>
          <button
            onClick={() => router.push("/notifications")}
            className="flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors duration-200 group"
          >
            دیدن همه اعلان‌ها
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </Card>
  );
}
