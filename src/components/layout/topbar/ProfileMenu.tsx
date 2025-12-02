'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface ProfileMenuProps {
  name: string;
  avatar: string;
}

export default function ProfileMenu({ name, avatar }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const router = useRouter();

  // بستن مدال وقتی کاربر بیرون کلیک کند
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="relative" ref={menuRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <svg
          className="w-4 h-4 text-slate-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        <span className="text-slate-700 text-sm font-medium">{name}</span>
        <div className="w-6 h-6 md:w-8 md:h-8 relative rounded-sm border border-primary-400 overflow-hidden">
          <Image
            src={avatar}
            alt={name}
            fill
            className="object-cover"
            sizes="32px"
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50 overflow-hidden">
          <button
            onClick={() => router.push('/profile')}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-primary-500 hover:text-white transition"
          >
            <User size={18} />
            پروفایل
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={18} />
            خروج
          </button>


        </div>
      )}
    </div>
  );
}
