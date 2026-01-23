import { Info, User } from 'lucide-react';

interface Props {
    isLiveChatEnabled: boolean;
}

export default function ChatHeader({ isLiveChatEnabled }: Props) {
    return (
        <div className="p-4 border-b border-gray-300 space-y-2">

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold">پشتیبانی طلافروشی</h3>
                        <p className="text-sm text-text-secondary">
                            {isLiveChatEnabled ? 'آنلاین' : 'چت آنلاین غیرفعال است'}
                        </p>
                    </div>
                </div>

                <span className="px-3 py-1 bg-primary-200 text-primary-500 rounded-full text-sm">
                    به‌زودی
                </span>
            </div>

            {!isLiveChatEnabled && (
                <div className="flex items-center gap-2 text-sm text-red-400 bg-red-100 px-3 py-2 rounded-lg">
                    <Info className="w-4 h-4" />
                    <span>
                        چت آنلاین هنوز فعال نشده است. لطفاً از تماس، ایمیل یا بخش ثبت مشکل استفاده کنید.
                    </span>
                </div>
            )}
        </div>
    );
}
