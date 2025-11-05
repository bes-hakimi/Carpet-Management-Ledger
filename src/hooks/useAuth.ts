'use client';

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

// نوع کاربر
interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  phone?: string | null;
  company_name?: string | null;
  company_logo?: string | null;
  created_by?: string | null;
}

// نوع داده‌ای که در localStorage ذخیره می‌شود
interface StoredUserData {
  access: string;
  refresh: string;
  token: string;
  user: User;
  expiresAt: number;
}

export function useAuth() {
  const [userData, setUserData] = useState<StoredUserData | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  // بارگذاری داده‌ها از localStorage و بررسی انقضا
  useEffect(() => {
    const stored = localStorage.getItem("management-ledger");
    if (!stored) return;

    try {
      const parsed: StoredUserData = JSON.parse(stored);
      const expired = new Date().getTime() > parsed.expiresAt;
      setIsExpired(expired);

      setUserData(parsed); // داده‌ها را نگه می‌داریم، فقط وضعیت expired مشخص می‌شود
    } catch (error) {
      console.error("Failed to parse stored user data:", error);
      localStorage.removeItem("management-ledger");
      setUserData(null);
      setIsExpired(false);
    }
  }, []);

  // ذخیره یا بروزرسانی داده‌ها
  const setUser = (data: Omit<StoredUserData, "expiresAt">, daysValid = 30) => {
    const storageData: StoredUserData = {
      ...data,
      expiresAt: new Date().getTime() + daysValid * 24 * 60 * 60 * 1000,
    };
    localStorage.setItem("management-ledger", JSON.stringify(storageData));
    setUserData(storageData);
    setIsExpired(false);
  };

  // حذف داده‌ها (Logout) و نمایش پیام موفقیت
  const logout = () => {
    localStorage.removeItem("management-ledger");
    setUserData(null);
    setIsExpired(false);
    toast.success("خروج با موفقیت انجام شد!");
  };

  const isLoggedIn = !!userData && !isExpired;

  return {
    userData,
    setUser,
    logout,
    isLoggedIn,
    isExpired,
  };
}
