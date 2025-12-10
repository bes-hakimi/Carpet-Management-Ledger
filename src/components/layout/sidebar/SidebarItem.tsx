'use client';
import Link from 'next/link';
import clsx from 'clsx';
import SidebarSubmenu from './SidebarSubmenu';
import { useApiGet } from '@/hooks/useApi';
import { NOTIFICATION } from '@/endpoints/notification';
import { NotificationListResponse } from '@/types/notification/notifications';

interface SidebarItemProps {
  title: string;
  icon: React.ElementType;
  link?: string;
  submenu?: { title: string; link: string }[];
  collapsed: boolean;

  // اضافه شده ↓↓↓
  isOpen?: boolean;
  onToggle?: () => void;
}

const SidebarItem = ({ 
  title, 
  icon: Icon, 
  link, 
  submenu, 
  collapsed,
  isOpen = false,
  onToggle
}: SidebarItemProps) => {

  const { data: notifications } = useApiGet<NotificationListResponse>(
    'notifications',
    NOTIFICATION.list
  );

  const unreadCount = notifications?.data.filter(n => !n.is_read).length ?? 0;

  // اگر ساب‌مینو دارد
  if (submenu) {
    return (
      <div>
        <button
          onClick={onToggle}
          className={clsx(
            `flex items-center justify-between p-2 rounded-lg text-gray-700 hover:bg-primary-100 hover:text-primary-700 transition ${collapsed ? 'w-fit' : 'w-full'}`,
            isOpen && 'bg-primary-100 text-primary-700'
          )}
        >
          <div className="flex items-center space-x-2">
            <Icon size={20} />
            {!collapsed && <span>{title}</span>}
          </div>

          {!collapsed && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={clsx('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>

        {!collapsed && isOpen && <SidebarSubmenu items={submenu} />}
      </div>
    );
  }

  // اگر لینک معمولی است
  return (
    <Link
      href={link!}
      className={`${collapsed ? 'w-fit' : 'w-full'} flex items-center space-x-2 p-2 rounded-lg text-gray-700 hover:bg-primary-100 hover:text-primary-700 transition`}
    >
      <Icon size={20} />
      {!collapsed && (
        <div className="flex items-center space-x-2 relative w-full">
          <span>{title}</span>

          {title === 'اعلانات' && unreadCount > 0 && (
            <div className="absolute top-0 left-0 flex items-center justify-center min-w-5 min-h-5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
              <span className="pt-[2px]">{unreadCount}</span>
            </div>
          )}
        </div>
      )}
    </Link>
  );
};

export default SidebarItem;
