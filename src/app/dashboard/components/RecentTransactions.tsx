"use client";

import { Card } from "@/components/ui/Card";
import { TrendingUp, TrendingDown, ArrowUpRight, } from "lucide-react";
import { useApiGet } from "@/hooks/useApi";
import { DASHBOARD } from "@/endpoints/report/dashboard/dashboard";
import { Transaction } from "@/types/report/dashboard/transaction";
import { CardLoader } from "@/components/loading/DataLoading";

export default function RecentTransactions() {
  const { data: transactions, isLoading } = useApiGet<Transaction[]>(
    "recent-transactions",
    DASHBOARD.resent_transaction
  );

  const getStatusColor = (type: string) => {
    switch (type) {
      case "income":
        return "text-primary-600 bg-primary-50 border-primary-200";
      case "expense":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (type: string) => {
    if (type === "income") {
      return <TrendingUp className="w-4 h-4 text-primary-500" />;
    }
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  if (isLoading) {
    return (
      <Card className="p-6 text-center text-gray-500">
        <CardLoader />
      </Card>
    );
  }

  if (!isLoading && (!transactions || transactions.length === 0)) {
    return (
      <Card className="p-3 md:p-6 border-gray-300 bg-gray-50 shadow-none text-center text-gray-500">
        <div className="py-10 flex flex-col items-center gap-3">
          <ArrowUpRight className="w-10 h-10 text-gray-400" />
          <p className="text-base font-medium text-gray-600">هیچ معامله‌ای یافت نشد</p>
          <p className="text-sm text-gray-500">در حال حاضر معامله‌ای برای نمایش وجود ندارد.</p>
        </div>
      </Card>
    );
  }


  return (
    <Card className="bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm border border-gray-200/60 shadow-xs hover:shadow-md transition-all duration-300">
      <div className="p-0 md:p-6">
        {/* سربرگ */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-full flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
            <div className="w-full flex justify-between items-center">
              <h2 className="text-lg font-semibold text-primary-600">معاملات اخیر</h2>
              <div className="text-sm text-gray-600">
                نمایش {transactions?.length ?? 0} معامله
              </div>
            </div>
          </div>
        </div>

        {/* جدول */}
        <div className="space-y-3">
          {transactions?.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 md:p-4 bg-white rounded-lg md:rounded-xl border border-gray-200/60 hover:border-primary-300 hover:shadow-sm transition-all duration-200 group"
            >
              {/* معلومات معامله */}
              <div className="flex items-center gap-4 flex-1">
                {/* آیکون وضعیت */}
                <div className={`p-2 rounded-xl border-2 ${getStatusColor(transaction.type)}`}>
                  {getStatusIcon(transaction.type)}
                </div>

                {/* جزئیات */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {transaction.title}
                    </span>
                    <span
                      className={`px-2 py-[2px] md:py-1 rounded-full text-[10px] md:text-xs font-medium border ${getStatusColor(transaction.type)}`}
                    >
                      {transaction.type === "income" ? "مؤفق" : "مصرف"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>#{transaction.id}</span>
                    <span>•</span>
                    <span>{transaction.date}</span>
                  </div>
                </div>
              </div>

              {/* مقدار */}
              <div className="text-left ml-4">
                <div
                  className={`text-lg font-bold ${transaction.type === "income" ? "text-primary-600" : "text-red-600"
                    }`}
                >
                  {transaction.amount.toLocaleString("fa-AF")}
                </div>
                <div className="text-xs md:text-xs text-gray-500 mt-1">افغانی</div>
              </div>
            </div>
          ))}
        </div>

        {/* پاورقی
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200/60">
          <div className="text-sm text-gray-600">
            نمایش {transactions?.length ?? 0} معامله
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200 group">
            دیدن همه معاملات
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </button>
        </div> */}
      </div>
    </Card>
  );
}
