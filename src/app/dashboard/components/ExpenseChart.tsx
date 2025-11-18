"use client";

import { Card } from "@/components/ui/Card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useApiGet } from "@/hooks/useApi";
import { DASHBOARD } from "@/endpoints/report/dashboard/dashboard";

// تایپ‌ها
import { ExpenseResponse, ExpenseMonthItem } from "@/types/report/dashboard/expense";
import { TableLoader } from "@/components/loading/DataLoading";

export default function ExpenseDonutChart() {
  const { data, isLoading } = useApiGet<ExpenseResponse>(
    "expense-chart",
    DASHBOARD.expense_chart
  );

  const expenseData: ExpenseMonthItem[] = data?.months?.map((item, index) => ({
    ...item,
    color: ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6"][index % 6],
  })) ?? [];

  const chartData = expenseData.map(item => ({
    name: item.month_name,
    value: item.total,
    color: item.color
  }));

  const totalExpense = data?.total_expense_6_month ?? 0;
  const averageExpense = data?.average_monthly_expense ?? 0;

  return (
    <Card className="bg-gradient-to-br from-white to-red-50/20 backdrop-blur-sm border border-gray-200/60 shadow-xs hover:shadow-md transition-all duration-300">
      <div className="p-6">
        <h2 className="text-lg font-bold text-teal-600 mb-4">مصارف شش ماه اخیر</h2>

        {isLoading ? (
          <TableLoader />
        ) : (
          <>
            {/* آمار کلی */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-rose-50 rounded-2xl border border-rose-200">
                <div className="text-2xl font-bold text-rose-600">
                  {totalExpense.toLocaleString()}
                </div>
                <div className="text-xs text-rose-600 mt-1">مجموع مصارف</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-2xl border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">
                  {averageExpense.toLocaleString()}
                </div>
                <div className="text-xs text-blue-600 mt-1">میانگین ماهانه</div>
              </div>
            </div>

            {/* نمودار */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="65%"
                    outerRadius="85%"
                    paddingAngle={2}
                    cornerRadius={8}
                    startAngle={90}
                    endAngle={450}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color!} stroke="white" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name) => [`${value.toLocaleString()} افغانی`, name]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
