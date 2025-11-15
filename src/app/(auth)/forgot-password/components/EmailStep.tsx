import { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface EmailStepProps {
  onSubmit: (email: string) => void;
  isLoading: boolean;
}

export default function EmailStep({ onSubmit, isLoading }: EmailStepProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    if (!email.trim()) return "ایمیل الزامی است";
    // اعتبارسنجی ساده ایمیل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "ایمیل معتبر نیست";
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError("");
    onSubmit(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Input
          label="ایمیل"
          type="email"
          placeholder="example@mail.com"
          value={email}
          onChange={handleEmailChange}
          error={error}
          icon={<Mail className="w-4 h-4" />}
          dir="ltr"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          type="submit"
          loading={isLoading}
          loadingText="در حال ارسال کد..."
          fullWidth
        >
          ارسال کد تایید
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <p className="text-xs text-gray-500">
          کد تایید به ایمیل شما ارسال خواهد شد
        </p>
      </motion.div>
    </form>
  );
}
