'use client';
import Link from 'next/link';

interface SidebarSubmenuProps {
  items: { title: string; link: string }[];
}

const SidebarSubmenu = ({ items }: SidebarSubmenuProps) => {
  return (
    <div className="ml-6 mt-1 space-y-1">
      {items.map((item) => (
        <Link
          key={item.title}
          href={item.link}
          className="block px-3 py-1.5 text-sm text-gray-600 hover:bg-primary-100 hover:text-primary-700 rounded-md transition"
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
};

export default SidebarSubmenu;
