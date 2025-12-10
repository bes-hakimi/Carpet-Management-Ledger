"use client";

import { BarChart3, Users, Store, ShoppingCart, DollarSign, TrendingDown } from "lucide-react";
import { IUser } from "@/types/user/user";

interface Props {
  data: IUser;
}

export function CompanyStatsTab({ data }: Props) {
  const stats = [
    {
      title: "تعداد محصولات",
      value: data.products_count ?? 0,
      icon: <Store className="w-6 h-6 text-primary-600" />,
      color: "bg-primary-50",
    },
    {
      title: "تعداد کارمندان",
      value: data.staff_count ?? 0,
      icon: <Users className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      title: "تعداد شعبات",
      value: data.branches_count ?? 0,
      icon: <BarChart3 className="w-6 h-6 text-indigo-600" />,
      color: "bg-indigo-50",
    },
    {
      title: "تعداد فروشات",
      value: data.sales_count ?? 0,
      icon: <ShoppingCart className="w-6 h-6 text-amber-600" />,
      color: "bg-amber-50",
    },
    {
      title: "مجموع درآمد",
      value: data.total_income ? `${data.total_income.toLocaleString()} AFN` : "0 AFN",
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
      color: "bg-green-50",
    },
    {
      title: "مجموع مصارف",
      value: data.total_expenses ? `${data.total_expenses.toLocaleString()} AFN` : "0 AFN",
      icon: <TrendingDown className="w-6 h-6 text-rose-600" />,
      color: "bg-rose-50",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
      <h3 className="text-base md:text-xl font-semibold text-gray-900 mb-6">آمار شرکت</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-5 rounded-md shadow-sm border border-gray-100 hover:shadow-md transition-all ${item.color}`}
          >
            <div>
              <p className="text-gray-500 text-sm font-medium">{item.title}</p>
              <h4 className="text-2xl font-bold text-gray-800 mt-1">{item.value}</h4>
            </div>
            <div className="p-3 bg-white rounded-full shadow-sm">
              {item.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
