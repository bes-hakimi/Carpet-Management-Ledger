'use client';
import Link from 'next/link';
import { useState } from 'react';
import clsx from 'clsx';
import SidebarSubmenu from './SidebarSubmenu';

interface SidebarItemProps {
  title: string;
  icon: React.ElementType;
  link?: string;
  submenu?: { title: string; link: string }[];
  collapsed: boolean;
}

const SidebarItem = ({ title, icon: Icon, link, submenu, collapsed }: SidebarItemProps) => {
  const [open, setOpen] = useState(false);

  if (submenu) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={clsx(
            `flex items-center justify-between p-2 rounded-lg text-gray-700 hover:bg-primary-100 hover:text-primary-700 transition ${collapsed ? "w-fit" : "w-full"
            }`,
            open && "bg-primary-100 text-primary-700"
          )}
        >

          <div className="flex items-center space-x-2">
            <Icon size={20} />
            {!collapsed && <span>{title}</span>}
          </div>
          {!collapsed && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={clsx('h-4 w-4 transition-transform', open && 'rotate-180')}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
        {!collapsed && open && <SidebarSubmenu items={submenu} />}
      </div>
    );
  }

  return (
    <Link
      href={link!}
      className={` ${collapsed?'w-fit':'w-full'} flex items-center space-x-2 p-2 rounded-lg text-gray-700 hover:bg-primary-100 hover:text-primary-700 transition`}
    >
      <Icon size={20} />
      {!collapsed && <span>{title}</span>}
    </Link>
  );
};

export default SidebarItem;
