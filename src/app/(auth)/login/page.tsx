"use client";

import { useState } from "react";
import LoginForm from "./components/LoginForm";
import LoginHeader from "./components/LoginHeader";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // اگر خطا باشد
        toast.error(data.detail || "خطا در ورود. لطفاً دوباره تلاش کنید.");
      } else {
        // ذخیره همه اطلاعات در یک کلید
        const storageData = {
          access: data.access,
          refresh: data.refresh,
          token: data.token,
          user: data.user,
          expiresAt: new Date().getTime() + 30 * 24 * 60 * 60 * 1000, // ۳۰ روز آینده
        };

        localStorage.setItem("management-ledger", JSON.stringify(storageData));

        toast.success("ورود با موفقیت انجام شد!");
        console.log("User data:", data.user);


        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("خطای شبکه. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="h-full max-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 w-full max-w-md">
        <LoginHeader />
        <LoginForm
          onSubmit={handleLogin}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
