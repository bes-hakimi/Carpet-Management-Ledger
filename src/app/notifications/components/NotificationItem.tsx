import {
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Package,
  ShoppingBag,
  Bell,
  Tag,
  AlertCircle,
  Trash2,
  Check,
} from "lucide-react";
import { OutlineButton, DestructiveButton } from "@/components/ui/Button";
import type { ApiNotification } from "@/types/notification/notifications";

interface Props {
  notification: ApiNotification;
  onMarkAsRead: () => void;
  onDelete: () => void;
  markLoading: boolean;
  deleteLoading: boolean;
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  markLoading,
  deleteLoading,
}: Props) {

  // ➤ تبدیل تاریخ API به فرمت فارسی
  const dt = new Date(notification.created_at);
  const date = dt.toLocaleDateString("fa-IR");
  const time = dt.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // -------------------- Icon handler --------------------
  const getNotificationIcon = (type: ApiNotification["type"]) => {
    const className = "w-6 h-6";
    switch (type) {
      case "info": return <Info className={className} />;
      case "warning": return <AlertTriangle className={className} />;
      case "success": return <CheckCircle className={className} />;
      case "error": return <XCircle className={className} />;
      case "inventory":
      case "product": return <Package className={className} />;
      case "sales": return <ShoppingBag className={className} />;
      default: return <Bell className={className} />;
    }
  };

  const getNotificationColor = (type: ApiNotification["type"]) => {
    switch (type) {
      case "info": return "bg-blue-50 border-blue-200 text-blue-600";
      case "warning": return "bg-amber-50 border-amber-200 text-amber-600";
      case "success": return "bg-emerald-50 border-emerald-200 text-emerald-600";
      case "error": return "bg-rose-50 border-rose-200 text-rose-600";
      case "inventory":
      case "product": return "bg-violet-50 border-violet-200 text-violet-600";
      case "sales": return "bg-indigo-50 border-indigo-200 text-indigo-600";
      default: return "bg-gray-50 border-gray-200 text-gray-600";
    }
  };

  const getPriorityBadge = (priority: ApiNotification["priority"]) => {
    switch (priority) {
      case "high": return "bg-rose-100 text-rose-800 border-rose-200";
      case "medium": return "bg-amber-100 text-amber-800 border-amber-200";
      case "low": return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
  };

  const getPriorityText = (priority: ApiNotification["priority"]) => {
    switch (priority) {
      case "high": return "بالا";
      case "medium": return "متوسط";
      case "low": return "پایین";
    }
  };

  return (
    <div
      className={`group rounded-lg shadow-xs border-2 transition-all duration-300 hover:shadow-md ${notification.is_read
          ? "border-gray-200/60 bg-white opacity-90"
          : "border-primary-200 bg-primary-50 shadow-primary-100"
        }`}
    >
      <div className="p-4 md:p-6">
        <div className="flex gap-4">
          {/* Icon */}
          <div
            className={`p-3 rounded-xl border-2 h-fit ${getNotificationColor(
              notification.type
            )}`}
          >
            {getNotificationIcon(notification.type)}
          </div>

          <div className="flex-1 min-w-0">
            {/* Title + priority + read badge */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h3
                  className={`text-lg font-semibold ${notification.is_read ? "text-gray-700" : "text-gray-900"
                    }`}
                >
                  {notification.title}
                </h3>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityBadge(
                    notification.priority
                  )}`}
                >
                  {getPriorityText(notification.priority)}
                </span>

                {!notification.is_read && (
                  <span className="flex items-center gap-1 bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                    <AlertCircle className="w-3 h-3" />
                    جدید
                  </span>
                )}
              </div>

              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-lg w-fit">
                {date} - {time}
              </div>
            </div>

            {/* Message */}
            <p className="text-gray-600 mb-4 leading-relaxed text-justify">
              {notification.message}
            </p>

            {/* Related URL */}
            {notification.url && (
              <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm">
                <Tag className="w-4 h-4" />
                {notification.url}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className={`flex justify-end gap-4 mt-4 pt-4 border-t  ${notification.is_read ? 'border-gray-200/60' : ' border-primary-300'}`}>
          {!notification.is_read && (
            <OutlineButton
              icon={<Check className="w-4 h-4" />}
              onClick={onMarkAsRead}
              size="sm"
              loading={markLoading}
            >
              خوانده شد
            </OutlineButton>
          )}

          <DestructiveButton
            icon={<Trash2 className="w-4 h-4" />}
            onClick={onDelete}
            size="sm"
            loading={deleteLoading}
          >
            حذف
          </DestructiveButton>
        </div>
      </div>
    </div>
  );
}
