'use client';

import { useAuth } from '@/hooks/useAuth';
import LoginPage from '@/app/(auth)/login/page';
import DashboardPage from '@/app/dashboard/page';

export default function AuthGuard() {
  const { isLoggedIn } = useAuth();

  // اگر کاربر لاگین است داشبورد را نشان بده
  if (isLoggedIn) return <DashboardPage />;

  // اگر کاربر لاگین نیست، لاگین را نشان بده
  return <LoginPage />;
}
