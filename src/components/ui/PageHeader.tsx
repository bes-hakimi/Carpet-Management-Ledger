// src/components/ui/PageHeader.tsx (نسخه ساده‌تر)
"use client";
import { ArrowRight, Home } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface PageHeaderProps {
    title: string;
    description?: string;
    showBackButton?: boolean;
    showNextButton?: boolean;
    showHomeIcon?: boolean;
    backUrl?: string;
    nextUrl?: string;
}

export function PageHeader({
    title,
    description,
    showBackButton = true,
    showHomeIcon = true,
    backUrl,
}: PageHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();

    const handleBack = () => {
        if (backUrl) {
            router.push(backUrl);
        } else {
            router.back();
        }
    };

    const handleHome = () => {
        router.push('/');
    };

    // منطق ساده برای غیرفعال کردن دکمه‌ها
    const isBackDisabled = !backUrl && pathname === '/';

    return (
        <div className="relative mb-6">
            {/* Background decoration */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-primary-200 to-cyan-200 rounded-full opacity-60 blur-xl"></div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-tr from-primary-200 to-cyan-200 rounded-full opacity-40 blur-lg"></div>

            <div className="relative flex items-center gap-2 md:gap-4">
                {/* Navigation buttons */}
                <div className="flex items-center gap-2">
                    {showBackButton && (
                        <button
                            onClick={handleBack}
                            disabled={isBackDisabled}
                            className="group flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-md md:rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary-300 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:scale-100"
                            title={isBackDisabled ? "امکان بازگشت وجود ندارد" : "بازگشت"}
                        >
                            <ArrowRight
                                size={18}
                                className="text-gray-600 group-hover:text-primary-600 transition-transform duration-300 disabled:group-hover:text-gray-600"
                            />
                        </button>
                    )}

                    {showHomeIcon && (
                        <button
                            onClick={handleHome}
                            className="group flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-md md:rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary-300 hover:scale-105"
                            title="صفحه اصلی"
                        >
                            <Home
                                size={18}
                                className="text-gray-600 group-hover:text-primary-600 transition-transform duration-300"
                            />
                        </button>
                    )}

                </div>

                {/* Title section */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-1 md:w-1.5 h-6 md:h-8 bg-gradient-to-b from-primary-500 to-cyan-500 rounded-full"></div>
                        <h1 className="text-base md:text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            {title}
                        </h1>
                    </div>

                    {description && (
                        <p className="text-gray-600 text-xs md:text-sm pr-4 leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {/* Bottom border gradient */}
            <div className="relative mt-4">
                <div className="h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent"></div>
                {/* <div className="absolute top-0 left-1/4 w-2/12 h-0.5 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full"></div> */}
            </div>
        </div>
    );
}