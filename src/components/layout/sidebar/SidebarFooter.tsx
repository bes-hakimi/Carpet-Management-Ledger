'use client';

import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface SidebarFooterProps {
  collapsed: boolean;
}

const SidebarFooter = ({ collapsed }: SidebarFooterProps) => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  return (
    <div className="border-t border-gray-200 p-4 space-y-2">
      <button
        onClick={handleProfile}
        className="flex items-center space-x-2 w-full text-gray-700 hover:text-primary-500 hover:bg-primary-100 p-2 rounded-lg transition"
      >
        <User size={20} />
        {!collapsed && <span>پروفایل</span>}
      </button>

      <button
        onClick={handleLogout}
        className="flex items-center space-x-2 w-full text-gray-700 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
      >
        <LogOut size={20} />
        {!collapsed && <span>خروج</span>}
      </button>
    </div>
  );
};

export default SidebarFooter;
