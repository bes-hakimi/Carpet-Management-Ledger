import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface VerificationStepProps {
  onSubmit: (code: string) => void;
  isLoading: boolean;
  onResendCode: () => void;
}


export default function VerificationStep({ onSubmit, isLoading, onResendCode }: VerificationStepProps) {
  const CODE_LENGTH = 6;
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(120); // 2 دقیقه
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // تایمر برای ارسال مجدد کد
  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // حرکت به فیلد بعدی
    if (value && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    // اگر همه فیلدها پر شدند، ارسال کن
    if (newCode.every(digit => digit !== "") && index === CODE_LENGTH - 1) {
      handleSubmit(newCode.join(""));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace") {
      if (!code[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      } else if (code[index]) {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
    } else if (e.key === "ArrowRight" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').split('').slice(0, CODE_LENGTH);

    if (digits.length === CODE_LENGTH) {
      const newCode = [...code];
      digits.forEach((digit, index) => {
        newCode[index] = digit;
      });
      setCode(newCode);
      inputsRef.current[CODE_LENGTH - 1]?.focus();
      handleSubmit(newCode.join(""));
    }
  };

  const [isResendLoading, setIsResendLoading] = useState(false);

  const handleResendCode = async () => {
    if (timeLeft > 0 || isResendLoading) return; // جلوگیری از چند کلیک همزمان

    setIsResendLoading(true);
    try {
      setTimeLeft(120); // ریست تایمر
      await onResendCode(); // فراخوانی تابع ارسال واقعی
    } catch (err) {
      console.error(err);
    } finally {
      setIsResendLoading(false);
    }
  };



  const handleSubmit = (verificationCode?: string) => {
    const finalCode = verificationCode || code.join("");
    if (finalCode.length === CODE_LENGTH) {
      onSubmit(finalCode);
    }
  };

  // مقداردهی اولیه ref‌ها
  if (inputsRef.current.length !== code.length) {
    inputsRef.current = Array(code.length).fill(null);
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label className="text-sm font-medium text-gray-600 block mb-3 text-center">
          کد {CODE_LENGTH} رقمی ارسال شده
        </label>
        <div className="flex justify-center gap-1.5 md:gap-3" dir="ltr">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputsRef.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-8 h-8 md:w-10 md:h-10 text-center text-base font-semibold border-2 border-gray-300 rounded-md md:rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
              style={{ direction: "ltr" }}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          type="submit"
          loading={isLoading}
          loadingText="در حال تایید..."
          fullWidth
          disabled={code.join("").length !== CODE_LENGTH}
        >
          تایید کد
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <button
          type="button"
          onClick={handleResendCode}
          disabled={timeLeft > 0 || isResendLoading}
          className={`text-sm transition-colors ${timeLeft > 0 || isResendLoading
              ? "text-gray-400 cursor-not-allowed"
              : "text-primary-600 hover:text-primary-800"
            }`}
        >
          {isResendLoading
            ? "در حال ارسال..."
            : timeLeft > 0
              ? `ارسال مجدد کد (${formatTime(timeLeft)})`
              : "ارسال مجدد کد"}
        </button>

      </motion.div>
    </form>
  );
}
