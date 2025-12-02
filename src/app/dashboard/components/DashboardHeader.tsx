"use client";

import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export default function DashboardHeader() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <motion.div
      className="flex justify-between items-center bg-gray-100 p-4 rounded-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-xl font-bold">داشبورد مدیریت</h1>

      {/* دکمه بروز رسانی */}
      <Button
      size="md"
        onClick={handleRefresh}
        icon={ <RefreshCw className="h-4 w-4" />}
        className="flex flex-nowrap items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-sm hover:bg-primary-600 transition-colors"
      >
       
        <span>بروز رسانی اطلاعات</span>
      </Button>
    </motion.div>
  );
}
