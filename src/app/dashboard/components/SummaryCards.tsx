"use client";

import { Card } from "@/components/ui/Card";
import { DollarSign, Package, TrendingUp, Activity, History } from "lucide-react";
import { motion } from "framer-motion";
import { useApiGet } from "@/hooks/useApi";
import { DASHBOARD } from "@/endpoints/report/dashboard/dashboard";
import { SummaryCardType } from "@/types/report/dashboard/summary_card";
import { CardLoader } from "@/components/loading/DataLoading";

export default function SummaryCards() {
  const { data, isLoading } = useApiGet<SummaryCardType>(
    "dashboard-summary",
    DASHBOARD.main
  );

  if (isLoading) {
    return <CardLoader />;
  }

  if (!data?.report) {
    return <div className="text-center py-6 text-red-500">دیتا یافت نشد</div>;
  }

  const r = data.report;

  const summaryData = [
    {
      title: "مجموع محصولات",
      value: r.total_stock_qty ?? 0,
      icon: Package,
      gradient: "from-blue-400 to-blue-700",
      update: data.last_update ?? "08:00 AM",
    },
    {
      title: "مجموع فروشات",
      value: r.total_sales_price ?? 0,
      icon: DollarSign,
      gradient: "from-yellow-400 to-orange-600",
      update: data.last_update ?? "08:00 AM",
    },
    {
      title: "مجموع مصارف",
      value: `${r.total_expense ?? 0} افغانی`,
      icon: Activity,
      gradient: "from-red-400 to-rose-600",
      update: data.last_update ?? "08:00 AM",
    },
    {
      title: "مجموع اصل پول",
      value: `${r.product_cost ?? 0} افغانی`,
      icon: Activity,
      gradient: "from-teal-400 to-teal-600",
      update: data.last_update ?? "08:00 AM",
    },
    {
      title: "مجموع مفاد خالص",
      value: `${r.net_income ?? 0} افغانی`,
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-600",
      update: data.last_update ?? "08:00 AM",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {summaryData.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card
            className={`p-3 md:p-4 bg-gradient-to-r ${item.gradient} text-white border-none shadow-none shadow-gray-300`}
          >
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <h1 className="text-base font-medium">{item.title}</h1>
                <div className="text-lg font-bold">{item.value}</div>
              </div>

              <item.icon className="h-9 w-9 p-2 bg-white/30 rounded-md" />
            </div>

            <div className="flex items-center gap-1 border-t border-white mt-2 pt-2 text-sm text-white/90">
              <History className="w-4 h-4" />
              <span>بروز رسانی در</span>
              <span className="font-semibold">{item.update}</span>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
