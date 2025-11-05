'use client';

import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth'; // مسیر هوک خودتان
import { useRouter } from 'next/navigation';

interface SidebarFooterProps {
  collapsed: boolean;
}

const SidebarFooter = ({ collapsed }: SidebarFooterProps) => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login'); // ریدایرکت به صفحه ورود
  };

  return (
    <div className="border-t border-gray-200 p-4 space-y-2">
      <button className="flex items-center space-x-2 w-full text-gray-700 hover:text-teal-500 hover:bg-teal-100 p-2 rounded-lg transition">
        <Settings size={20} />
        {!collapsed && <span>تنظیمات</span>}
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
