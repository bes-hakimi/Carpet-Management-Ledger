import { motion } from "framer-motion";
import { Shield, User } from "lucide-react";

export default function LoginHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-8"
    >
      {/* آیکون جذاب و مدرن */}
      <div className="relative inline-flex items-center justify-center mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-cyan-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
        <div className="relative bg-gradient-to-br from-primary-500 to-cyan-600 p-4 rounded-2xl shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-1 shadow-lg"
        >
          <Shield className="w-4 h-4 text-white" />
        </motion.div>
      </div>

      <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-primary-600 to-cyan-600 bg-clip-text text-transparent">
        ورود به حساب کاربری
      </h1>
      <p className="text-gray-600 mt-2 text-sm">
        لطفا اطلاعات حساب خود را وارد کنید
      </p>
    </motion.div>
  );
}