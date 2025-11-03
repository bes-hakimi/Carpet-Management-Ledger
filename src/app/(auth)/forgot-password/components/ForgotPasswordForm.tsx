"use client";

import { motion } from "framer-motion";
import PhoneStep from "./PhoneStep";
import VerificationStep from "./VerificationStep";
import NewPasswordStep from "./NewPasswordStep";
import SuccessStep from "./SuccessStep";

interface ForgotPasswordFormProps {
  step: "phone" | "verification" | "new-password" | "success";
  onSendCode: (phoneNumber: string) => void;
  onVerifyCode: (code: string) => void;
  onResetPassword: (newPassword: string) => void;
  isLoading: boolean;
}

export default function ForgotPasswordForm({
  step,
  onSendCode,
  onVerifyCode,
  onResetPassword,
  isLoading
}: ForgotPasswordFormProps) {
  const renderStep = () => {
    switch (step) {
      case "phone":
        return (
          <PhoneStep
            onSubmit={onSendCode}
            isLoading={isLoading}
          />
        );
      case "verification":
        return (
          <VerificationStep
            onSubmit={onVerifyCode}
            isLoading={isLoading}
          />
        );
      case "new-password":
        return (
          <NewPasswordStep
            onSubmit={onResetPassword}
            isLoading={isLoading}
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