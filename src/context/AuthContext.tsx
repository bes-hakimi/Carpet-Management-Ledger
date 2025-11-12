'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import PageLoading from '@/components/loading/PageLoading';

interface AuthContextType {
    canAccess: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const { userData, isLoggedIn, isExpired, logout } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [canAccess, setCanAccess] = useState(false);

    const role = userData?.user?.role || null;

    // مسیرهای ثابت عمومی
    const publicRoutes = ['/login', '/forgot-password', '/unauthorized'];

    // مسیرهای ممنوعه برای هر نقش
    const forbiddenRoutes: Record<string, string[]> = {
        superadmin: [], // superadmin همه مسیرها را می‌تواند ببیند
        admin: ['/company'], // admin به مسیرهای company دسترسی ندارد
        staff: ['/company', '/staff', '/branch'], // staff به مسیرهای company, staff و branch دسترسی ندارد
    };

    useEffect(() => {
        if (userData === null && !isLoggedIn && !isExpired) return;

        const checkAccess = () => {
            setIsLoading(true);

            // مسیر عمومی
            if (publicRoutes.some(route => pathname.startsWith(route))) {
                setCanAccess(true);
                setIsLoading(false);
                return;
            }

            // توکن منقضی شده
            if (isExpired) {
                toast.error('دسترسی شما منقضی شده است');
                logout();
                router.replace('/login');
                setCanAccess(false);
                setIsLoading(false);
                return;
            }

            // کاربر لاگین نکرده
            if (!isLoggedIn) {
                toast.error('لطفاً ابتدا وارد حساب خود شوید.');
                router.replace('/login');
                setCanAccess(false);
                setIsLoading(false);
                return;
            }

            // بررسی دسترسی بر اساس مسیرهای ممنوعه
            if (role) {
                const forbidden = forbiddenRoutes[role] || [];
                const isForbidden = forbidden.some(forbiddenPath =>
                    pathname.startsWith(forbiddenPath)
                );

                if (isForbidden) {
                    toast.error('شما به این صفحه دسترسی ندارید');
                    router.replace('/unauthorized');
                    setCanAccess(false);
                    setIsLoading(false);
                    return;
                }
            }

            // همه چیز اوکی
            setCanAccess(true);
            setIsLoading(false);
        };

        checkAccess();
    }, [pathname, isLoggedIn, isExpired, role, userData]);

    // if (isLoading || (userData === null && !isLoggedIn && !isExpired)) {
    //     return (
    //         <PageLoading />
    //     );
    // }

    if (!canAccess && pathname !== '/unauthorized') return null;

    return (
        <AuthContext.Provider value={{ canAccess, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
    return ctx;
}
