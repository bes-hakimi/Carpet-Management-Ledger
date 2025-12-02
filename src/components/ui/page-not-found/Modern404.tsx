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


const AdminNotFoundPage = () => {
  
  return (
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
              <div className="w-72 h-72 border-2 border-dashed border-primary-200/40 rounded-full animate-pulse"></div>
              <div className="w-56 h-56 border-2 border-dashed border-primary-300/30 rounded-full animate-pulse delay-75"></div>
              <div className="w-40 h-40 border-2 border-dashed border-primary-400/20 rounded-full animate-pulse delay-150"></div>
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
        </div>

        {/* فوتر */}
        <div className="mt-12 p-3 md:p-6 bg-primary-100 rounded-md">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-6">
              <span>کلیه حقوق محفوظ است</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span>نیاز به کمک دارید؟</span>
              <Link 
                href="/support" 
                className="text-primary-600 hover:text-primary-700 font-medium underline"
              >
                تماس با پشتیبانی
              </Link>
            </div>
          </div>
        </div>
      </div>

  );
};

export default AdminNotFoundPage;