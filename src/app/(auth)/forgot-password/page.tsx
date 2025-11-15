"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useApiPost } from "@/hooks/useApi";
import { FORGOT_PASSWORD } from "@/endpoints/forgot-password";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import ForgotPasswordHeader from "./components/ForgotPasswordHeader";
import { ApiError } from "@/types/api/api";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "verification" | "new-password" | "success">("email");
  const [email, setEmail] = useState<string>(""); // نگهداری ایمیل کاربر

  // -----------------------------
  // ایجاد mutation objects
  // -----------------------------
  const sendCodeMutation = useApiPost<{ message: string }, { email: string }>(FORGOT_PASSWORD.send);
  const verifyCodeMutation = useApiPost<{ message: string }, { email: string; otp: string }>(FORGOT_PASSWORD.varify);
  const resetPasswordMutation = useApiPost<
    { message: string },
    { email: string; new_password: string; confirm_password: string }
  >(FORGOT_PASSWORD.password);


  const sendCodeAsync = sendCodeMutation.mutateAsync;
  const verifyCodeAsync = verifyCodeMutation.mutateAsync;
  const resetPasswordAsync = resetPasswordMutation.mutateAsync;

  // وضعیت لودینگ کلی
  // وضعیت لودینگ کلی
  // لودینگ مختص هر دکمه
  const isSendCodeLoading = sendCodeMutation.status === 'pending';
  const isVerifyCodeLoading = verifyCodeMutation.status === 'pending';
  const isResetPasswordLoading = resetPasswordMutation.status === 'pending';

  // -----------------------------
  // توابع handle
  // -----------------------------
  const handleSendCode = async (userEmail: string) => {
    try {
      const res = await sendCodeAsync({ email: userEmail });
      setEmail(userEmail); // ذخیره ایمیل برای مراحل بعد
      setStep("verification");
      toast.success(res.message || "کد تایید به ایمیل شما ارسال شد!");
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.response?.data?.message || "ارسال کد با خطا مواجه شد");
    }
  };

  const handleVerifyCode = async (code: string) => {
    try {
      const res = await verifyCodeAsync({ email, otp: code });
      setStep("new-password");
      toast.success(res.message || "کد تایید با موفقیت تایید شد!");
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.response?.data?.message || "تایید کد با خطا مواجه شد");
    }
  };

  const handleResetPassword = async (newPassword: string, confirmPassword: string) => {
    try {
      const res = await resetPasswordAsync({
        email,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setStep("success");
      toast.success(res.message || "رمز عبور شما با موفقیت تغییر یافت!");
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.response?.data?.message || "تغییر رمز عبور با خطا مواجه شد");
    }
  };

  const handleResendCode = async () => {
    if (!email) return; // اگر ایمیل هنوز ثبت نشده بود، کاری نکن
    try {
      const res = await sendCodeAsync({ email });
      toast.success(res.message || "کد تایید دوباره به ایمیل شما ارسال شد!");
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.response?.data?.message || "ارسال کد مجدد با خطا مواجه شد");
    }
  };



  // -----------------------------
  // رندر صفحه
  // -----------------------------
  return (
    <div className="h-full max-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 w-full max-w-md">
        <ForgotPasswordHeader step={step} />
        <ForgotPasswordForm
          step={step}
          onSendCode={handleSendCode}
          onVerifyCode={handleVerifyCode}
          onResetPassword={handleResetPassword}
          onResendCode={handleResendCode}
          isSendCodeLoading={isSendCodeLoading}
          isVerifyCodeLoading={isVerifyCodeLoading}
          isResetPasswordLoading={isResetPasswordLoading}
        />

      </div>
    </div>
  );
}
