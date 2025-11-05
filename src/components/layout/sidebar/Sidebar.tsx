'use client';
import clsx from 'clsx';
import SidebarHeader from './SidebarHeader';
import SidebarFooter from './SidebarFooter';
import SidebarItem from './SidebarItem';
import { useAuth } from '@/hooks/useAuth'; // مسیر هوک خودتان

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

  const { userData } = useAuth();
  const role = userData?.user?.role || 'staff';
  // type Role = 'superadmin' | 'admin' | 'staff';
  // const role = 'staff' as Role;


  // انتخاب منو بر اساس نقش
  const sidebarMenu =
    role === 'superadmin'
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
