import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
}

export default function PasswordInput({ 
  value, 
  onChange, 
  error, 
  label = "رمز عبور",
  placeholder = "رمز عبور خود را وارد کنید"
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="w-full flex flex-col space-y-1"
    >
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"} 
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          error={undefined} // خطا را اینجا غیرفعال می‌کنیم
          icon={<Lock className="w-4 h-4" />}
          className={error ? "border-red-500 focus:ring-red-500" : ""} // اضافه کردن استایل خطا
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute left-10 top-1/2 transform -translate-y-1/2 text-teal-500 hover:text-teal-600 transition-colors duration-200 z-10"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
      {/* فقط اینجا خطا را نشان بده */}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </motion.div>
  );
}