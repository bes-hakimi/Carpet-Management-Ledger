'use client';

import { useState, useRef } from 'react';
import { Send, Phone, Mail, User, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'support';
    time: string;
}

export default function SupportPage() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: 'سلام! چطور می‌تونم کمکتون کنم؟', sender: 'support', time: '10:30' },
        { id: 2, text: 'مشکل در گزارش فروش روزانه دارم', sender: 'user', time: '10:32' },
    ]);

    const [newMessage, setNewMessage] = useState('');
    const [problem, setProblem] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const sendMessage = () => {
        if (!newMessage.trim()) return;

        const newMsg: Message = {
            id: messages.length + 1,
            text: newMessage,
            sender: 'user',
            time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMsg]);
        setNewMessage('');

        // پاسخ خودکار
        setTimeout(() => {
            const reply: Message = {
                id: messages.length + 2,
                text: 'پیام شما دریافت شد. به زودی پاسخ می‌دم.',
                sender: 'support',
                time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, reply]);
        }, 1000);
    };

    const submitProblem = () => {
        if (!problem.trim()) return;
        alert('مشکل شما ثبت شد. به زودی با شما تماس می‌گیریم.');
        setProblem('');
    };

    return (
        <div className="min-h-screen bg-secondary-100 p-4 md:p-6">
            <PageHeader
                title="پشتیبانی"
                showHomeIcon={true}
                description="راه‌های ارتباط با پشتیبانی"
            />
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ستون سمت راست: اطلاعات تماس */}
                    <div className="space-y-6">

                        {/* کارت اطلاعات */}
                        <div className="bg-surface rounded-xl shadow p-6 border border-border">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">رضا محمدی</h3>
                                    <p className="text-sm text-text-secondary">reza@goldshop.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-success">
                                <div className="w-2 h-2 bg-success rounded-full"></div>
                                <span className="text-sm">آنلاین</span>
                            </div>
                        </div>

                        {/* راه‌های تماس */}
                        <div className="bg-surface rounded-xl shadow p-6 border border-border">
                            <h3 className="font-semibold mb-4">تماس مستقیم</h3>

                            <div className="space-y-4">
                                <a href="tel:09123456789" className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-secondary-50">
                                    <Phone className="w-5 h-5 text-danger" />
                                    <div>
                                        <p className="font-medium">تماس تلفنی</p>
                                        <p className="text-sm text-text-secondary">۰۹۱۲۳۴۵۶۷۸۹</p>
                                    </div>
                                </a>

                                <a href="mailto:support@gold-system.ir" className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-secondary-50">
                                    <Mail className="w-5 h-5 text-info" />
                                    <div>
                                        <p className="font-medium">ایمیل</p>
                                        <p className="text-sm text-text-secondary">support@gold-system.ir</p>
                                    </div>
                                </a>
                            </div>

                            <div className="mt-6 pt-6 border-t border-border">
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm">پاسخگویی: ۹ صبح تا ۵ عصر</span>
                                </div>
                            </div>
                        </div>

                        {/* ثبت مشکل */}
                        <div className="bg-surface rounded-xl shadow p-6 border border-border">
                            <h3 className="font-semibold mb-4">ثبت مشکل جدید</h3>
                            <textarea
                                value={problem}
                                onChange={(e) => setProblem(e.target.value)}
                                placeholder="مشکل خود را شرح دهید..."
                                rows={4}
                                className="w-full border border-border rounded-lg p-3 mb-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                            <Button
                                onClick={submitProblem}
                                className="w-full bg-primary-500 hover:bg-primary-600"
                                icon={<MessageCircle className="w-4 h-4" />}
                            >
                                ارسال مشکل
                            </Button>
                        </div>
                    </div>

                    {/* ستون چپ: چت */}
                    <div className="lg:col-span-2">
                        <div className="bg-surface rounded-xl shadow h-full flex flex-col border border-border">

                            {/* هدر چت */}
                            <div className="p-4 border-b border-border">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-success" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">پشتیبانی طلافروشی</h3>
                                            <p className="text-sm text-text-secondary">آنلاین - پاسخ سریع</p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 bg-success/10 text-success rounded-full text-sm">
                                        آنلاین
                                    </div>
                                </div>
                            </div>

                            {/* پیام‌ها */}
                            <div className="flex-1 p-4 overflow-y-auto bg-secondary-50">
                                <div className="space-y-4">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-md px-4 py-3 rounded-2xl ${msg.sender === 'user'
                                                        ? 'bg-primary-500 text-white rounded-tr-none'
                                                        : 'bg-surface border border-border text-text-primary rounded-tl-none'
                                                    }`}
                                            >
                                                <p>{msg.text}</p>
                                                <p className={`text-xs mt-2 ${msg.sender === 'user' ? 'text-primary-200' : 'text-text-secondary'}`}>
                                                    {msg.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>

                            {/* ارسال پیام */}
                            <div className="p-4 border-t border-border">
                                <div className="flex gap-2">
                                    <Input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="پیام خود را بنویسید..."
                                        className="flex-1"
                                    />
                                    <Button
                                        onClick={sendMessage}
                                        className="bg-primary-500 hover:bg-primary-600"
                                        icon={<Send className="w-4 h-4" />}
                                    >
                                        ارسال
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}