// components/CustomerList.tsx

'use client';

import { useState, useMemo } from 'react';
import { User } from 'lucide-react';
import { SupportMessage } from '@/types/support/support';

interface Props {
  items: SupportMessage[];
  selected: SupportMessage | null;
  onSelect: (item: SupportMessage) => void;
}

const ITEMS_PER_PAGE = 5;

export function CustomerList({ items, selected, onSelect }: Props) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [items, page]);

  return (
    <div className="bg-white rounded-xl border border-gray-300 shadow-sm flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300">
        <h3 className="font-semibold text-sm">پیام‌های پشتیبانی</h3>

        {/* Count badge */}
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary-100 text-primary-700">
          {items.length} پیام
        </span>
      </div>

      {/* List */}
      <div className="p-3 space-y-2 h-96 overflow-y-scroll no-scroll">
        {paginatedItems.map(item => {
          const user = item.user;

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className={`w-full  flex items-start gap-3 p-3 rounded-lg border border-gray-300 transition text-right
                ${
                  selected?.id === item.id
                    ? 'bg-primary-50 border-primary-500'
                    : 'hover:bg-gray-50'
                }`}
            >
              {/* Avatar / Logo */}
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-primary-100 shrink-0">
                {user.company_logo ? (
                  <img
                    src={user.company_logo}
                    alt="company logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-primary-500" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {user.first_name || user.email}
                </div>

                {/* One-line message */}
                <div className="text-xs text-muted line-clamp-1">
                  {item.message}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t text-xs">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 rounded-md border border-primary-200 bg-primary-100 disabled:bg-gray-50 disabled:border-gray-100 hover:bg-primary-200"
          >
            قبلی
          </button>

          <span className="text-muted">
            صفحه {page} از {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 rounded-md border border-primary-200 bg-primary-100 disabled:bg-gray-50 disabled:border-gray-100 hover:bg-primary-200"
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  );
}
