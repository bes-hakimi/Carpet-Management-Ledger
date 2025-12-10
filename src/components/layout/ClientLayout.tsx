"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import TopBar from "@/components/layout/topbar/TopBar";
import MobileBottomBar from "@/components/layout/sidebar/MobileBottomBar";
import { Toaster } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import PageLoading from "@/components/loading/PageLoading";

export default function ClientLayout({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("SW Registered"))
        .catch((err) => console.log("SW Failed:", err));
    }
  }, []);

  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { isLoggedIn, isAuthLoading } = useAuth();

  // 🔹 تا وقتی وضعیت auth مشخص نشده، فقط صفحه لودینگ نشان بده
  if (isAuthLoading) return <PageLoading />;

  // مسیرهایی که نباید نوار بالا نمایش داده شود
  const hidePaths = ["/login", "/forgot-password"];
  if (!isLoggedIn) hidePaths.push("/");

  const showTopBar = !hidePaths.includes(pathname);

  return (
    <div className="flex flex-col h-screen">
      {/* ✅ TopBar فقط اگر مسیر مجاز باشد */}
      {showTopBar && <TopBar />}

      <div className={`flex flex-row-reverse flex-1 overflow-hidden ${showTopBar ? "pt-16 md:pt-[56px]" : ""} `}>
        {/* Sidebar فقط برای دسکتاپ */}
        {showTopBar && (
          <div className="fixed top-[56px] bottom-0 right-0 hidden sm:block z-10">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          </div>
        )}

        {/* بخش محتوا */}
        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ${showTopBar && (collapsed ? "sm:mr-[4rem]" : "sm:mr-[16rem]")} ${showTopBar ? "p-3 md:p-6 pb-36 md:pb-16" : ""}`}
        >
          {children}
        </main>

        {/* 🔹 نوار پایین فقط برای موبایل */}
        {showTopBar && <MobileBottomBar />}
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "8px",
            padding: "8px",
            fontSize: "14px"
          },
          success: {
            style: {
              background: "var(--primary-600)",
              color: "white"
            }
          },
          error: {
            style: {
              background: "#ef4444",
              color: "white"
            }
          },
          duration: 4000,
        }}
      />
    </div>
  );
}
