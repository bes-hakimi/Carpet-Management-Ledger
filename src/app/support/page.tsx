'use client';

import { useState, useRef } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';

import ContactSection from './components/contact-section/ContactSection';
import ChatHeader from './components/chat-section/ChatHeader';
import ChatMessages from './components/chat-section/ChatMessages';
import ChatInput from './components/chat-section/ChatInput';

export interface Message {
    id: number;
    text: string;
    sender: 'user' | 'support';
    time: string;
}

export default function SupportPage() {
    const isLiveChatEnabled = false;

    const [messages] = useState<Message[]>([
        {
            id: 1,
            text: '⚠️ چت آنلاین هنوز فعال نیست. لطفاً از تماس تلفنی، ایمیل یا بخش ثبت مشکل استفاده کنید.',
            sender: 'support',
            time: '',
        },
    ]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    return (
        <div className="min-h-screen p-4 md:p-6">
            <PageHeader
                title="پشتیبانی"
                showHomeIcon
                description="راه‌های ارتباط با پشتیبانی"
            />

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Right side */}
                    <ContactSection />

                    {/* Left side – Chat */}
                    <div className="lg:col-span-2">
                        <div className=" rounded-xl shadow h-full flex flex-col border border-gray-300">
                            <ChatHeader isLiveChatEnabled={isLiveChatEnabled} />
                            <ChatMessages
                                messages={messages}
                                messagesEndRef={messagesEndRef}
                            />
                            <ChatInput disabled />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
