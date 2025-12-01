// app/not-found.tsx
'use client';

import React from 'react';
import { 
  Home,
  AlertTriangle,
  LayoutDashboard,
} from 'lucide-react';
import Link from 'next/link';
import { PrimaryButton, OutlineButton } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { Menu } from './menu';

const AdminNotFoundPage = () => {
  // استخراج لینک‌های سریع از منوی ادمین
  const quickLinks = Menu.map(item => ({
    name: item.title,
    href: item.link || '#',
    icon: item.icon
  })).filter(item => item.href !== '#');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-blue-50/20">
      <div className="w-full">
        
        {/* استفاده از کامپوننت PageHeader */}
        <PageHeader 
          title="خطای ۴۰۴ - صفحه یافت نشد"
          description="صفحه مورد نظر شما در پنل مدیریت وجود ندارد یا دسترسی به آن امکان‌پذیر نمی‌باشد"
          showBackButton={true}
          showHomeIcon={true}
          backUrl="/dashboard"
        />

        <div className="space-y-6">
          
          {/* بخش اصلی خطا */}
          <div className="relative">
            {/* مدارهای پویا */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-72 border-2 border-dashed border-teal-200/40 rounded-full animate-pulse"></div>
              <div className="w-56 h-56 border-2 border-dashed border-teal-300/30 rounded-full animate-pulse delay-75"></div>
              <div className="w-40 h-40 border-2 border-dashed border-teal-400/20 rounded-full animate-pulse delay-150"></div>
            </div>
            
            {/* محتوای مرکزی */}
            <div className="relative z-10 text-center">
              <div className="w-full mx-auto bg-white rounded-lg border border-gray-300 flex flex-col items-center justify-center p-4 md:p-8">
                
                {/* آیکون خطا */}
                <div className="mb-4 md:mb-8">
                  <div className="relative">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                      <AlertTriangle className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-3 -right-3">
                      <div className="bg-red-500 text-white text-sm md:text-lg font-bold rounded-full w-8 h-8 md:w-16 md:h-16 flex items-center justify-center shadow-lg">
                        404
                      </div>
                    </div>
                  </div>
                </div>

                {/* متن خطا */}
                <div className="space-y-2 md:space-y-4 mb-4 md:mb-8">
                  <h2 className="text-xl md:text-3xl font-bold text-gray-900">صفحه مورد نظر یافت نشد</h2>
                  <p className="text-gray-600 leading-relaxed text-base md:text-lg max-w-md mx-auto">
                    ممکن است صفحه حذف شده، منتقل شده یا آدرس آن تغییر کرده باشد.
                  </p>
                </div>

                {/* دکمه‌های فوری */}
                <div className="flex justify-center gap-4 w-full max-w-md mx-auto">
                  <PrimaryButton
                    icon={<LayoutDashboard className="w-5 h-5" />}
                    onClick={() => window.location.href = '/dashboard'}
                    fullWidth
                    size="md"
                    className='w-fit text-nowrap'
                  >
                    بازگشت به داشبورد
                  </PrimaryButton>
                  
                  <OutlineButton
                    icon={<Home className="w-5 h-5" />}
                    onClick={() => window.location.href = '/'}
                    fullWidth
                    size="md"
                    className='w-fit text-nowrap'
                  >
                    صفحه اصلی سایت
                  </OutlineButton>
                </div>
              </div>
            </div>
          </div>

          {/* لینک‌های سریع */}
          <div className="bg-white rounded-lg border border-gray-300 flex flex-col p-4 md:p-8">
            <h3 className="font-semibold text-gray-800 mb-6 text-lg text-center">دسترسی سریع به بخش‌های مدیریت</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {quickLinks.slice(0, 10).map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={index}
                    href={link.href}
                    className="group flex items-center gap-4 p-4 bg-gray-50 hover:bg-teal-50 rounded-xl border border-gray-200 hover:border-teal-300 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300">
                      <IconComponent className="w-5 h-5 text-teal-600" />
                    </div>
                    <span className="text-base font-medium text-gray-700 group-hover:text-teal-700 flex-1">
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* اطلاعات پشتیبانی */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* راهنمای عیب‌یابی */}
            <div className="bg-amber-50 rounded-lg p-4 md:p-8  border border-amber-200/50">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                <div className="space-y-3">
                  <h4 className="font-semibold text-amber-800 text-lg">راهنمای عیب‌یابی</h4>
                  <ul className="text-amber-700 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                      <span>آدرس صفحه را بررسی کنید</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                      <span className='hidden md:block'>از منوی کنار صفحه استفاده نمایید</span>
                      <span className='md:hidden'>از منوی پایین صفحه استفاده نمایید</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                      <span>در صورت تکرار خطا با پشتیبانی تماس بگیرید</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* اطلاعات سیستم */}
            <div className="bg-white rounded-lg border border-gray-300 flex flex-col p-4 md:p-8">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">وضعیت سیستم</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600">۹۹.۹٪</div>
                    <div className="text-sm text-gray-600">آپتایم</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="text-2xl font-bold text-gray-700">فعال</div>
                    </div>
                    <div className="text-sm text-gray-600">وضعیت</div>
                  </div>
                </div>
                <div className="text-center pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">پنل مدیریت نسخه 1.0</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* فوتر */}
        <div className="mt-12 pt-8 border-t border-gray-200/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-6">
              <span>کلیه حقوق محفوظ است</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span>نیاز به کمک دارید؟</span>
              <Link 
                href="/support" 
                className="text-teal-600 hover:text-teal-700 font-medium underline"
              >
                تماس با پشتیبانی
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotFoundPage;