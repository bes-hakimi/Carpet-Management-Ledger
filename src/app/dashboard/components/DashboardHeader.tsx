"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardHeader() {
  return (
    <motion.div
      className="flex justify-between items-center bg-gray-100 p-4 rounded-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-xl font-bold">داشبورد مدیریت</h1>
      <div className="flex flex-nowrap items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-sm">
        <ArrowUpRight className="h-4 w-4" />
        <span>عملیات سریع </span>
      </div>
    </motion.div>
  );
}