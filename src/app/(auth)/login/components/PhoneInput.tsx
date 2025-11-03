import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function PhoneInput({ value, onChange, error }: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // فقط اعداد را قبول کند
    const numericValue = e.target.value.replace(/\D/g, '');
    onChange(numericValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Input
        label="شماره تماس"
        type="tel"
        placeholder="09123456789"
        value={value}
        onChange={handleChange}
        error={error}
        icon={<Phone className="w-4 h-4" />}
        dir="ltr"
        maxLength={11}
      />
    </motion.div>
  );
}