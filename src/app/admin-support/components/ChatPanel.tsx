// components/ChatPanel.tsx

import { SupportMessage } from '@/types/support/support';
import { User } from 'lucide-react';

interface Props {
  message: SupportMessage;
}

export function ChatPanel({ message }: Props) {
  const user = message.user;

  return (
    <div className="bg-white rounded-xl border border-gray-200 h-full flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-primary-100 to-primary-50 border-b border-primary-200">
        <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-primary-100 flex-shrink-0 shadow-sm">
          {user.company_logo ? (
            <img
              src={user.company_logo}
              alt="Company Logo"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-6 h-6 text-primary-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-semibold text-lg truncate text-text-primary">
            {user.first_name || user.email}
          </div>
          <div className="text-xs text-text-secondary">
            {new Date(message.created_at).toLocaleString('fa-IR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <p className="text-sm leading-7 whitespace-pre-line text-text-primary">
          {message.message}
        </p>
      </div>

      {/* Footer / Notice */}
      <div className="px-6 py-4 border-t bg-warning/10 rounded-b-xl text-warning text-xs font-medium flex items-center gap-2">
        💡 چت زنده فعال نیست، فقط امکان مشاهده پیام‌ها وجود دارد
      </div>
    </div>
  );
}
