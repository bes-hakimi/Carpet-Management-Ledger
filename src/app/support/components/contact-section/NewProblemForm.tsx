'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

import { SUPPORT } from '@/endpoints/support';
import { useApiPost } from '@/hooks/useApi';
import { ApiError } from '@/types/api/api';

interface SupportPayload {
    subject: string;
    message: string;
}

export default function NewProblemForm() {
    const [message, setMessage] = useState('');

    const { mutate, isPending } = useApiPost<unknown, SupportPayload>(
        SUPPORT.create
    );

    const handleSubmit = () => {
        if (!message.trim()) {
            toast.error('لطفاً مشکل خود را وارد کنید');
            return;
        }

        mutate(
            {
                subject: 'technical',
                message,
            },
            {
                onSuccess: () => {
                    toast.success('مشکل شما با موفقیت ثبت شد');
                    setMessage('');
                },
                onError: (error: ApiError) => {
                    toast.error(
                        error?.response?.data?.message ||
                        error?.response?.data?.detail ||
                        'خطا در ثبت مشکل، لطفاً دوباره تلاش کنید'
                    );
                },
            }
        );
    };

    return (
        <div className="bg-surface rounded-xl shadow p-6 border border-gray-300">
            <h3 className="font-semibold mb-4">ثبت مشکل جدید</h3>

            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="مشکل خود را شرح دهید..."
                rows={4}
                disabled={isPending}
                className="w-full border border-gray-300 rounded-lg p-3 mb-3 text-sm outline-none disabled:opacity-60"
            />

            <Button
                onClick={handleSubmit}
                disabled={isPending}
                loading={isPending}
                loadingText='در حال ارسال ...'
                className="w-full bg-primary-500 hover:bg-primary-600"
                icon={<MessageCircle className="w-4 h-4" />}
            >
                ارسال مشکل
            </Button>
        </div>
    );
}
