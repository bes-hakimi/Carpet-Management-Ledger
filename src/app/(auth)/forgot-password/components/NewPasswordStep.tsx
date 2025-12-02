import { useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";

interface NewPasswordStepProps {
  onSubmit: (newPassword: string, confirmPassword: string) => void;
  isLoading: boolean;
}

export default function NewPasswordStep({ onSubmit, isLoading }: NewPasswordStepProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: ""
  });

  const validateForm = () => {
    const newErrors = {
      password: "",
      confirmPassword: ""
    };

    if (!password.trim()) {
      newErrors.password = "رمز عبور الزامی است";
    } else if (password.length < 6) {
      newErrors.password = "رمز عبور باید حداقل 6 کاراکتر باشد";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "تکرار رمز عبور الزامی است";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "رمز عبور و تکرار آن مطابقت ندارند";
    }

    setErrors(newErrors);
    return !newErrors.password && !newErrors.confirmPassword;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // فقط رمز عبور را ارسال کن و اجازه بده صفحه اصلی مرحله success را مدیریت کند
   onSubmit(password, confirmPassword);

  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-4"
      >
        <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
          <Lock className="w-8 h-8 text-primary-500 mx-auto mb-2" />
          <h3 className="text-sm font-medium text-primary-800">
            رمز عبور جدید خود را وارد کنید
          </h3>
          <p className="text-xs text-primary-600 mt-1">
            رمز عبور باید حداقل 6 کاراکتر باشد
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <PasswordInput
          value={password}
          onChange={setPassword}
          error={errors.password}
          label="رمز عبور جدید"
          placeholder="رمز عبور جدید خود را وارد کنید"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <PasswordInput
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={errors.confirmPassword}
          label="تکرار رمز عبور"
          placeholder="رمز عبور جدید را مجدداً وارد کنید"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          type="submit"
          loading={isLoading}
          loadingText="در حال تغییر رمز عبور..."
          fullWidth
        >
          تغییر رمز عبور
        </Button>
      </motion.div>
    </form>
  );
}