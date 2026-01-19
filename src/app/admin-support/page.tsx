'use client';

import { useState } from 'react';
import { Search, User, Phone, Mail, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';

interface Customer {
    id: number;
    name: string;
    email: string;
    status: 'online' | 'offline';
    unread: number;
}

interface Message {
    id: number;
    text: string;
    sender: 'customer' | 'admin';
    time: string;
}

export default function AdminSupportPage() {
    const [customers] = useState<Customer[]>([
        { id: 1, name: 'رضا محمدی', email: 'reza@goldshop.com', status: 'online', unread: 3 },
        { id: 2, name: 'علی کریمی', email: 'ali@goldshop.com', status: 'offline', unread: 0 },
        { id: 3, name: 'مریم احمدی', email: 'maryam@goldshop.com', status: 'online', unread: 1 },
    ]);

    const [selectedCustomer, setSelectedCustomer] = useState<Customer>(customers[0]);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: 'سلام! مشکل در گزارش فروش دارم', sender: 'customer', time: '10:30' },
        { id: 2, text: 'لطفا دقیقا چه خطایی می‌بینید؟', sender: 'admin', time: '10:32' },
    ]);

    const [newMessage, setNewMessage] = useState('');
    const [search, setSearch] = useState('');

    const sendMessage = () => {
        if (!newMessage.trim()) return;

        setMessages([...messages, {
            id: messages.length + 1,
            text: newMessage,
            sender: 'admin',
            time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
        }]);

        setNewMessage('');
    };

    const filteredCustomers = customers.filter(customer =>
        customer.name.includes(search) || customer.email.includes(search)
    );

    return (
        <div className="min-h-screen bg-secondary-100 p-4">
            <PageHeader
                title="پشتیبانی مشتریان"
                showHomeIcon={true}
                description="ارتباط و مدیریت درخواست‌های پشتیبانی مشتریان"
            />
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* لیست مشتریان */}
                    <div>
                        <div className="bg-surface rounded-xl shadow border border-border">

                            {/* جستجو */}
                            <div className="p-4 border-b border-border">
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="جستجوی مشتری..."
                                    icon={<Search className="w-4 h-4" />}
                                />
                            </div>

                            {/* مشتریان */}
                            <div className="divide-y divide-border">
                                {filteredCustomers.map((customer) => (
                                    <button
                                        key={customer.id}
                                        onClick={() => setSelectedCustomer(customer)}
                                        className={`w-full p-4 text-right hover:bg-secondary-50 flex items-center justify-between ${selectedCustomer.id === customer.id ? 'bg-primary-50' : ''
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-primary-600" />
                                                </div>
                                                {customer.status === 'online' && (
                                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-surface"></div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-text-primary">{customer.name}</p>
                                                <p className="text-sm text-text-secondary">{customer.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end">
                                            <span className={`text-xs ${customer.status === 'online' ? 'text-success' : 'text-text-secondary'}`}>
                                                {customer.status === 'online' ? 'آنلاین' : 'آفلاین'}
                                            </span>
                                            {customer.unread > 0 && (
                                                <span className="mt-1 bg-danger text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                    {customer.unread}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* چت */}
                    <div className="lg:col-span-3">
                        <div className="bg-surface rounded-xl shadow h-full flex flex-col border border-border">

                            {/* هدر */}
                            <div className="p-4 border-b border-border">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                                <User className="w-6 h-6 text-primary-600" />
                                            </div>
                                            {selectedCustomer.status === 'online' && (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-surface"></div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-text-primary">{selectedCustomer.name}</h3>
                                            <p className="text-sm text-text-secondary">{selectedCustomer.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            icon={<Phone className="w-4 h-4" />}
                                            onClick={() => window.open(`tel:09123456789`)}
                                        >
                                            تماس
                                        </Button>
                                        <Button
                                            variant="outline"
                                            icon={<Mail className="w-4 h-4" />}
                                            onClick={() => window.open(`mailto:${selectedCustomer.email}`)}
                                        >
                                            ایمیل
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* پیام‌ها */}
                            <div className="flex-1 p-4 overflow-y-auto bg-secondary-50">
                                <div className="space-y-4">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
                                        >
                                            <div
                                                className={`max-w-md px-4 py-3 rounded-2xl ${msg.sender === 'customer'
                                                        ? 'bg-surface border border-border text-text-primary rounded-tl-none'
                                                        : 'bg-primary-500 text-white rounded-tr-none'
                                                    }`}
                                            >
                                                <p>{msg.text}</p>
                                                <p className={`text-xs mt-2 ${msg.sender === 'customer' ? 'text-text-secondary' : 'text-primary-200'}`}>
                                                    {msg.sender === 'customer' ? 'مشتری' : 'شما'} • {msg.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ارسال */}
                            <div className="p-4 border-t border-border">
                                <div className="flex gap-2">
                                    <Input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="پاسخ خود را بنویسید..."
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

                {/* آمار */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-surface p-6 rounded-xl shadow border border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <MessageCircle className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{customers.length}</p>
                                <p className="text-text-secondary">مشتری فعال</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface p-6 rounded-xl shadow border border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-success" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{customers.filter(c => c.status === 'online').length}</p>
                                <p className="text-text-secondary">آنلاین</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface p-6 rounded-xl shadow border border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-danger/10 rounded-full flex items-center justify-center">
                                <MessageCircle className="w-5 h-5 text-danger" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {customers.reduce((sum, c) => sum + c.unread, 0)}
                                </p>
                                <p className="text-text-secondary">پیام نخوانده</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}