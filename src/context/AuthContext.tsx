'use client';

import { createContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import PageLoading from '@/components/loading/PageLoading';

// ثابت‌ها بیرون از کامپوننت
const publicRoutes = ['/login', '/forgot-password', '/unauthorized'];

const forbiddenRoutes: Record<string, string[]> = {
  superadmin: [],
  admin: ['/company'],
  staff: ['/company', '/staff', '/branch'],
};

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

  useEffect(() => {
    if (isAuthLoading) return;

    const checkAccess = () => {
      setIsLoading(true);

      if (publicRoutes.some(route => pathname.startsWith(route))) {
        setCanAccess(true);
        setIsLoading(false);
        return;
      }

      if (isExpired) {
        toast.error('دسترسی شما منقضی شده است');
        logout();
        router.replace('/login');
        setCanAccess(false);
        setIsLoading(false);
        return;
      }

      if (!isLoggedIn) {
        if (!publicRoutes.some(route => pathname.startsWith(route))) {
          sessionStorage.setItem("redirectAfterLogin", pathname);
          router.replace('/login');
          setCanAccess(false);
          setIsLoading(false);
          return;
        }
      }

      if (role) {
        const forbidden = forbiddenRoutes[role] || [];
        const isForbidden = forbidden.some(f => pathname.startsWith(f));

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

    checkAccess();
    window.addEventListener("auth-changed", checkAccess);

    return () => window.removeEventListener("auth-changed", checkAccess);

  }, [pathname, isLoggedIn, isExpired, role, isAuthLoading, logout, router]); // ← همه deps لازم

  if (isAuthLoading || isLoading) return <PageLoading />;

  if (!canAccess && pathname !== '/unauthorized') return null;

  return (
    <AuthContext.Provider value={{ canAccess, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
