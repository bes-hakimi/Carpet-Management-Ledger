import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface VerificationStepProps {
  onSubmit: (code: string) => void;
  isLoading: boolean;
}

export default function VerificationStep({ onSubmit, isLoading }: VerificationStepProps) {
  const [code, setCode] = useState(["", "", "", ""]);
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

    // حرکت به فیلد بعدی (از چپ به راست)
    if (value && index < 3) {
      // برای RTL: فیلد بعدی در واقع index + 1 است
      inputsRef.current[index + 1]?.focus();
    }

    // اگر همه فیلدها پر شدند، ارسال کن
    if (newCode.every(digit => digit !== "") && index === 3) {
      handleSubmit(newCode.join(""));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace") {
      if (!code[index] && index > 0) {
        // اگر فیلد خالی است، به فیلد قبلی برو (سمت راست در RTL)
        inputsRef.current[index - 1]?.focus();
      } else if (code[index]) {
        // اگر فیلد پر است، آن را خالی کن
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
    } else if (e.key === "ArrowRight" && index > 0) {
      // در RTL، ArrowRight به معنی حرکت به فیلد قبلی (سمت راست) است
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index < 3) {
      // در RTL، ArrowLeft به معنی حرکت به فیلد بعدی (سمت چپ) است
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').split('').slice(0, 4);
    
    if (digits.length === 4) {
      const newCode = [...code];
      digits.forEach((digit, index) => {
        newCode[index] = digit;
      });
      setCode(newCode);
      inputsRef.current[3]?.focus();
      handleSubmit(newCode.join(""));
    }
  };

  const handleResendCode = () => {
    if (timeLeft > 0) return;
    
    // ریست تایمر به 2 دقیقه
    setTimeLeft(120);
    
    // در اینجا تابع ارسال مجدد کد را فراخوانی کنید
    console.log("ارسال مجدد کد");
  };

  const handleSubmit = (verificationCode?: string) => {
    const finalCode = verificationCode || code.join("");
    if (finalCode.length === 4) {
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
          کد ۴ رقمی ارسال شده
        </label>
        <div className="flex justify-center gap-3" dir="ltr">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-10 h-10 text-center text-base font-semibold border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
              style={{ direction: "ltr" }} // اضافه کردن style برای اطمینان
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
          disabled={code.join("").length !== 4}
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
          disabled={timeLeft > 0}
          className={`text-sm transition-colors ${
            timeLeft > 0 
              ? "text-gray-400 cursor-not-allowed" 
              : "text-teal-600 hover:text-teal-800"
          }`}
        >
          {timeLeft > 0 ? (
            `ارسال مجدد کد (${formatTime(timeLeft)})`
          ) : (
            "ارسال مجدد کد"
          )}
        </button>
      </motion.div>
    </form>
  );
}