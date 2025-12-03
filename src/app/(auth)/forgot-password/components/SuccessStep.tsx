import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SuccessStep() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <CheckCircle className="w-16 h-16 text-primary-500 mx-auto mb-4" />
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        رمز عبور با موفقیت تغییر کرد
      </h3>
      
      <p className="text-gray-600 text-sm mb-6">
        اکنون می‌توانید با رمز عبور جدید وارد حساب خود شوید
      </p>

      <Button
        onClick={() => window.location.href = "/login"}
        variant="primary"
        fullWidth
      >
        ورود به حساب کاربری
      </Button>
    </motion.div>
  );
}