"use client";

import { useState } from "react";
import LoginForm from "./components/LoginForm";
import LoginHeader from "./components/LoginHeader";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (phoneNumber: string, password: string) => {
    setIsLoading(true);
    
    // شبیه‌سازی عملیات لاگین
    setTimeout(() => {
      setIsLoading(false);
      console.log("Login attempt:", { phoneNumber, password });
    }, 1500);
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