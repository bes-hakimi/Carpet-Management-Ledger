"use client";

import { useState } from "react";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import ForgotPasswordHeader from "./components/ForgotPasswordHeader";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"phone" | "verification" | "new-password" | "success">("phone");

  const handleSendCode = async (phoneNumber: string) => {
    setIsLoading(true);
    
    // شبیه‌سازی ارسال کد تایید
    setTimeout(() => {
      setIsLoading(false);
      setStep("verification");
      console.log("Verification code sent to:", phoneNumber);
    }, 1500);
  };

  const handleVerifyCode = async (code: string) => {
    setIsLoading(true);
    
    // شبیه‌سازی تایید کد
    setTimeout(() => {
      setIsLoading(false);
      setStep("new-password"); // تغییر این خط
      console.log("Code verified:", code);
    }, 1500);
  };

  const handleResetPassword = async (newPassword: string) => {
    setIsLoading(true);
    
    // شبیه‌سازی تغییر رمز عبور
    setTimeout(() => {
      setIsLoading(false);
      setStep("success"); // تغییر این خط
      console.log("Password reset to:", newPassword);
    }, 1500);
  };

  return (
    <div className="h-full max-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 w-full max-w-md">
        <ForgotPasswordHeader step={step} />
        <ForgotPasswordForm
          step={step}
          onSendCode={handleSendCode}
          onVerifyCode={handleVerifyCode}
          onResetPassword={handleResetPassword}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}