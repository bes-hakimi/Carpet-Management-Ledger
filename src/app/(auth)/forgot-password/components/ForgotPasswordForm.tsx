"use client";

import { motion } from "framer-motion";
import EmailStep from "./EmailStep";
import VerificationStep from "./VerificationStep";
import NewPasswordStep from "./NewPasswordStep";
import SuccessStep from "./SuccessStep";

interface ForgotPasswordFormProps {
  step: "email" | "verification" | "new-password" | "success";
  onSendCode: (email: string) => void;
  onVerifyCode: (code: string) => void;
  onResetPassword: (newPassword: string, confirmPassword: string) => void;
  onResendCode: () => void;
  isSendCodeLoading: boolean;
  isVerifyCodeLoading: boolean;
  isResetPasswordLoading: boolean;
}


export default function ForgotPasswordForm({
  step,
  onSendCode,
  onVerifyCode,
  onResetPassword,
  onResendCode,
  isSendCodeLoading,
  isVerifyCodeLoading,
  isResetPasswordLoading
}: ForgotPasswordFormProps) {
  const renderStep = () => {
    switch (step) {
      case "email":
        return (
          <EmailStep
            onSubmit={onSendCode}
            isLoading={isSendCodeLoading} // ← لودینگ مخصوص این مرحله
          />
        );

      case "verification":
        return (
          <VerificationStep
            onSubmit={onVerifyCode}
            onResendCode={onResendCode}
            isLoading={isVerifyCodeLoading} // ← لودینگ مخصوص این مرحله
          />
        );

      case "new-password":
        return (
          <NewPasswordStep
            onSubmit={onResetPassword}
            isLoading={isResetPasswordLoading} // ← لودینگ مخصوص این مرحله
          />
        );

      case "success":
        return <SuccessStep />;

      default:
        return null;
    }
  };

  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {renderStep()}
    </motion.div>
  );
}

