"use client";

import { useState } from "react";
import LoginForm from "./components/LoginForm";
import LoginHeader from "./components/LoginHeader";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";


export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();


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
        toast.error(data.detail || "خطا در ورود. لطفاً دوباره تلاش کنید.");
      } else {
        // ✅ به جای localStorage مستقیم، از setUser استفاده می‌کنیم
        setUser({
          access: data.access,
          refresh: data.refresh,
          token: data.token,
          user: data.user,
        });

        toast.success("ورود با موفقیت انجام شد!");
        console.log("User data:", data.user);

        // ✅ بعد از setUser ریدایرکت
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
