"use client";

import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { Package, AlertTriangle, CheckCircle } from "lucide-react";
import { useApiGet } from "@/hooks/useApi";
import { DASHBOARD } from "@/endpoints/report/dashboard/dashboard";
import { InventoryItem } from "@/types/report/dashboard/inventory";
import { CardLoader } from "@/components/loading/DataLoading";

export default function InventorySummary() {
  const { data: items, isLoading } = useApiGet<InventoryItem[]>(
    "inventory-summary",
    DASHBOARD.inventory_summary
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return {
          bg: "bg-rose-50",
          border: "border-rose-200",
          text: "text-rose-700",
          progress: "bg-rose-500",
        };
      case "warning":
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-700",
          progress: "bg-amber-500",
        };
      default:
        return {
          bg: "bg-primary-50",
          border: "border-primary-200",
          text: "text-primary-700",
          progress: "bg-primary-500",
        };
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === "critical" || status === "warning") {
      return <AlertTriangle className="w-4 h-4" />;
    }
    return <CheckCircle className="w-4 h-4" />;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "critical":
        return "ضروری";
      case "warning":
        return "هشدار";
      default:
        return "نرمال";
    }
  };

  if (isLoading) {
    return (
      <Card className="p-0 md:p-6 text-center text-gray-500">
        <CardLoader />
      </Card>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Card className="p-3 md:p-6 border-gray-300 bg-gray-50 shadow-none  text-center text-gray-500">
        <div className="py-10 flex flex-col items-center gap-3">
          <Package className="w-10 h-10 text-gray-400" />
          <p className="text-base font-medium text-gray-600">هیچ محصولی در گدام یافت نشد</p>
          <p className="text-sm text-gray-500">در حال حاضر گزارشی برای موجودی محصولات وجود ندارد.</p>
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
              <Package className="w-5 h-5 text-white" />
            </div>
            <div className="w-full flex justify-between items-center">
              <h2 className="text-lg font-semibold text-primary-600">وضعیت گدام</h2>
              <p className="text-sm text-gray-600 mt-1">مشاهده موجودی محصولات</p>
            </div>
          </div>
        </div>

        {/* لیست محصولات */}
        <div className="space-y-4">
          {items?.map((item, index) => {
            const colors = getStatusColor(item.status);
            const StatusIcon = getStatusIcon(item.status);

            return (
              <div
                key={index}
                className={`p-2 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all duration-200 hover:shadow-sm ${colors.bg} ${colors.border}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border-2 ${colors.border} ${colors.text}`}>
                      {StatusIcon}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h3 className="text-sm md:text-base font-medium text-gray-900">{item.name}</h3>
                        <p className="text-xs text-gray-600"> دسته بنده({item.type})</p>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${colors.border} ${colors.text}`}
                        >
                          {getStatusText(item.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {item.stock_qty}
                      <span className="text-sm font-normal text-gray-500">
                        /{item.max_stock}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {item.percentage}%
                    </div>
                  </div>
                </div>

                {/* نوار پیشرفت */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${colors.progress}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>

                {/* وضعیت */}
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span>موجودی فعلی</span>
                  <span>
                    {item.stock_qty} از {item.max_stock} قطعه
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* پاورقی */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200/60">
          <div className="text-sm text-gray-600">خلاصه وضعیت گدام</div>
          <Link
            href="/products/list"
            className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
          >
            جزئیات کامل
            <Package className="w-4 h-4" />
          </Link>

        </div>
      </div>
    </Card>
  );
}
