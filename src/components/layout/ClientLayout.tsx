"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import TopBar from "@/components/layout/topbar/TopBar";
import MobileBottomBar from "@/components/layout/sidebar/MobileBottomBar";
import { Toaster } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();

  // مسیرهایی که نباید نوار بالا نمایش داده شود
  // فقط اگر کاربر لاگین نیست، "/" را مخفی کن
  const hidePaths = ["/login", "/forgot-password"];
  if (!isLoggedIn) hidePaths.push("/"); 

  const showTopBar = !hidePaths.includes(pathname);

  return (
    <div className="flex flex-col h-screen">
      {/* ✅ TopBar فقط اگر مسیر مجاز باشد */}
      {showTopBar && <TopBar />}

      <div className={`flex flex-row-reverse flex-1 overflow-hidden ${showTopBar ? "pt-10 md:pt-[56px]" : ""} `}>
        {/* Sidebar فقط برای دسکتاپ */}
        {showTopBar && (
          <div className="fixed top-[56px] bottom-0 right-0 hidden sm:block z-10">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          </div>
        )}

        {/* بخش محتوا */}
        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ${showTopBar && (collapsed ? "sm:mr-[4rem]" : "sm:mr-[16rem]") } ${showTopBar ? "p-3 md:p-6 pb-36 md:pb-16" : ""}`}
        >
          {children}
        </main>

        {/* 🔹 نوار پایین فقط برای موبایل */}
        {showTopBar && <MobileBottomBar />}
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: "8px", padding: "8px", fontSize: "14px" },
          success: { style: { background: "#14b8a6", color: "white" } },
          error: { style: { background: "#ef4444", color: "white" } },
          duration: 4000,
        }}
      />
    </div>
  );
}
