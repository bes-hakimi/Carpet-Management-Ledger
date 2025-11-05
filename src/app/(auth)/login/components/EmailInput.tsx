import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function EmailInput({ value, onChange, error }: EmailInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Input
        label="ایمیل"
        type="email"
        placeholder="example@email.com"
        value={value}
        onChange={handleChange}
        error={error}
        icon={<Mail className="w-4 h-4" />}
        dir="ltr"
      />
    </motion.div>
  );
}
