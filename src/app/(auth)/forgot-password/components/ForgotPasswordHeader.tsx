import { motion } from "framer-motion";
import { Key, Shield, Lock, CheckCircle } from "lucide-react";

interface ForgotPasswordHeaderProps {
  step: "email" | "verification" | "new-password" | "success";
}

export default function ForgotPasswordHeader({ step }: ForgotPasswordHeaderProps) {
  const getStepIcon = () => {
    switch (step) {
      case "email":
        return <Key className="w-8 h-8 text-white" />;
      case "verification":
        return <Shield className="w-8 h-8 text-white" />;
      case "new-password":
        return <Lock className="w-8 h-8 text-white" />;
      case "success":
        return <CheckCircle className="w-8 h-8 text-white" />;
    }
  };

  const getTitle = () => {
    switch (step) {
      case "email":
        return "بازیابی رمز عبور";
      case "verification":
        return "تایید ایمل";
      case "new-password":
        return "رمز عبور جدید";
      case "success":
        return "رمز عبور تغییر کرد";
    }
  };

  const getDescription = () => {
    switch (step) {
      case "email":
        return "ایمل خود را وارد کنید";

      case "verification":
        return (
          <>
            کد تایید ارسال شده را وارد کنید
            <br />
            لطفاً ایمل خود را چک کنید. یک ایمل با کد تایید برای‌تان ارسال شده است.
          </>
        );

      case "new-password":
        return "رمز عبور جدید خود را وارد کنید";

      case "success":
        return "رمز عبور شما با موفقیت تغییر کرد";
    }
  };

  const steps = ["email", "verification", "new-password", "success"];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-4 md:mb-8"
    >
      <div className="relative inline-flex items-center justify-center mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-cyan-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
        <div className="relative bg-gradient-to-br from-primary-500 to-cyan-600 p-4 rounded-2xl shadow-lg">
          {getStepIcon()}
        </div>
      </div>

      <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-600 to-cyan-600 bg-clip-text text-transparent">
        {getTitle()}
      </h1>

      <p className="text-gray-600 mt-2 text-sm leading-relaxed">
        {getDescription()}
      </p>

      <div className="flex justify-center mt-6 space-x-2">
        {steps.map((s, index) => (
          <div
            key={s}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              step === s
                ? "bg-primary-500 w-6"
                : index < steps.indexOf(step)
                ? "bg-primary-300"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
