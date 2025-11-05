// components/layout/sidebar/Sidebar.tsx
'use client';
import clsx from 'clsx';
import SidebarHeader from './SidebarHeader';
import SidebarFooter from './SidebarFooter';
import SidebarItem from './SidebarItem';

// منوهای جدا برای هر نقش
import { sidebarMenuSuperAdmin } from './sidebar-menu/SuperAdmin';
import { sidebarMenuAdmin } from './sidebar-menu/Admin';
import { sidebarMenuStaff } from './sidebar-menu/Staff';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const toggleCollapse = () => setCollapsed(!collapsed);

  // 🔹 نقش فعلاً به صورت دستی تنظیم می‌شود
  const role = 'super_admin'; // بعداً از context یا API گرفته می‌شود

  // 🔹 انتخاب منو بر اساس نقش
  const sidebarMenu =
    role === 'super_admin'
      ? sidebarMenuSuperAdmin
      : role === 'admin'
      ? sidebarMenuAdmin
      : sidebarMenuStaff;

  return (
    <aside
      className={clsx(
        'bg-white shadow-sm border-r border-gray-200 h-full flex flex-col justify-between transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <SidebarHeader collapsed={collapsed} onToggle={toggleCollapse} />

      <nav className="flex-1 overflow-y-auto px-2 space-y-2">
        {sidebarMenu.map((item) => (
          <SidebarItem key={item.title} {...item} collapsed={collapsed} />
        ))}
      </nav>

      <SidebarFooter collapsed={collapsed} />
    </aside>
  );
};

export default Sidebar;
