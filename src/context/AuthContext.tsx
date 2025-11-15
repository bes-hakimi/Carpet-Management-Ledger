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

  const { userData, isLoggedIn, isExpired, logout, isAuthLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [canAccess, setCanAccess] = useState(false);

  const role = userData?.user?.role || null;

  // مسیرهای عمومی
  const publicRoutes = ['/login', '/forgot-password', '/unauthorized'];

  // مسیرهای ممنوعه بر اساس نقش
  const forbiddenRoutes: Record<string, string[]> = {
    superadmin: [],
    admin: ['/company'],
    staff: ['/company', '/staff', '/branch'],
  };

  useEffect(() => {
    if (isAuthLoading) return;

    const checkAccess = () => {
      setIsLoading(true);

      // مسیرهای عمومی
      if (publicRoutes.some(route => pathname.startsWith(route))) {
        setCanAccess(true);
        setIsLoading(false);
        return;
      }

      // منقضی شدن
      if (isExpired) {
        toast.error('دسترسی شما منقضی شده است');
        logout();
        router.replace('/login');
        setCanAccess(false);
        setIsLoading(false);
        return;
      }

      // لاگین نکرده
      if (!isLoggedIn && !isAuthLoading && !isExpired) {
        if (!publicRoutes.some(route => pathname.startsWith(route))) {
          router.replace('/login');
          return;
        }
      }

      // بررسی نقش
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

      setCanAccess(true);
      setIsLoading(false);
    };

    // اجرا در ابتدا
    checkAccess();

    // 🔥 اضافه کردن event listener
    window.addEventListener("auth-changed", checkAccess);

    return () => {
      window.removeEventListener("auth-changed", checkAccess);
    };
  }, [pathname, isLoggedIn, isExpired, role, isAuthLoading]);

  // ✅ تا وقتی useAuth در حال لود شدنه
  if (isAuthLoading || isLoading) {
    return <PageLoading />;
  }

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
