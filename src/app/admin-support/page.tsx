'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';

import { CustomerList } from './components/CustomerList';
import { ChatPanel } from './components/ChatPanel';

import { SUPPORT } from '@/endpoints/support';
import { useApiGet } from '@/hooks/useApi';

import {
  SupportListResponse,
  SupportMessage,
} from '@/types/support/support';
import { ContentLoader } from '@/components/loading/DataLoading';
import { EmptyData } from '@/components/empty/EmptyData';

export default function AdminSupportPage() {
  const { data, isLoading, error } = useApiGet<SupportListResponse>(
    'support-list',
    SUPPORT.list
  );

  const messages = data?.data ?? [];
  const [selectedMessage, setSelectedMessage] =
    useState<SupportMessage | null>(null);

  return (
    <div className="min-h-screen p-4">
      {/* Header همیشه نمایش داده شود */}
      <PageHeader
        title="پشتیبانی مشتریان"
        showHomeIcon
        description="ادمین فقط پیام‌ها را مشاهده می‌کند"
      />

      <div className="max-w-7xl mx-auto mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Messages list */}
          <div>
            {isLoading ? (
              <ContentLoader />
            ) : error ? (
              <div className="bg-white rounded-xl p-6 text-center text-sm text-red-500">
                خطا در دریافت پیام‌ها
              </div>
            ) : messages.length === 0 ? (
              <EmptyData description="هیچ پیامی برای نمایش وجود ندارد" />
            ) : (
              <CustomerList
                items={messages}
                selected={selectedMessage}
                onSelect={setSelectedMessage}
              />
            )}
          </div>

          {/* Message viewer */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <ContentLoader />
            ) : error ? (
              <div className="bg-white rounded-xl p-6 text-center text-sm text-red-500">
                خطا در دریافت پیام‌ها
              </div>
            ) : messages.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center text-sm text-muted">
                هیچ پیام برای نمایش وجود ندارد
              </div>
            ) : selectedMessage ? (
              <ChatPanel message={selectedMessage} />
            ) : (
              <div className="bg-white rounded-xl p-6 text-center text-sm text-muted">
                یک پیام را برای مشاهده انتخاب کنید
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
