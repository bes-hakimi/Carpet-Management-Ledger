import { useState } from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface PhoneStepProps {
  onSubmit: (phoneNumber: string) => void;
  isLoading: boolean;
}

export default function PhoneStep({ onSubmit, isLoading }: PhoneStepProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const validatePhone = (phone: string) => {
    if (!phone.trim()) {
      return "شماره تماس الزامی است";
    }
    if (!/^07\d{8}$/.test(phone)) {
      return "شماره تماس معتبر نیست";
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validatePhone(phoneNumber);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError("");
    onSubmit(phoneNumber);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, '');
    setPhoneNumber(numericValue);
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
          label="شماره تماس"
          type="tel"
          placeholder="09123456789"
          value={phoneNumber}
          onChange={handlePhoneChange}
          error={error}
          icon={<Phone className="w-4 h-4" />}
          dir="ltr"
          maxLength={11}
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
          کد تایید به شماره تماس شما ارسال خواهد شد
        </p>
      </motion.div>
    </form>
  );
}