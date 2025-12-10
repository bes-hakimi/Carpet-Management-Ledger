import { Bell, Check } from "lucide-react";
import { PrimaryButton } from "@/components/ui/Button";

interface Props {
  notificationsCount: number;
  unreadCount: number;
  onMarkAllRead: () => void;
}

export default function NotificationStatsCard({
  notificationsCount,
  unreadCount,
  onMarkAllRead,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow-xs border border-gray-200/60 p-4 md:p-6 mb-4 md:mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-2 md:p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-lg">
            <Bell className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-gray-900">{notificationsCount}</div>
              <div className="text-sm text-gray-600">کل اعلان‌ها</div>
            </div>

            <div className="w-px h-12 bg-gray-300"></div>

            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-rose-500">{unreadCount}</div>
              <div className="text-sm text-gray-600">خوانده نشده</div>
            </div>
          </div>
        </div>

        <PrimaryButton
          icon={<Check className="w-5 h-5" />}
          onClick={onMarkAllRead}
          disabled={unreadCount === 0}
          size="md"
          className="font-normal"
        >
          علامت‌گذاری همه به عنوان خوانده شده
        </PrimaryButton>
      </div>
    </div>
  );
}
