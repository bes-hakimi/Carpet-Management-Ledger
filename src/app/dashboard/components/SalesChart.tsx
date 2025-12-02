"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useApiGet } from "@/hooks/useApi";
import { DASHBOARD } from "@/endpoints/report/dashboard/dashboard";
import { Select } from "@/components/ui/Select";


// import تایپ‌ها
import {
  SalesChartResponse,
  SalesChartDayItem,
  SalesChartWeekItem,
  SalesChartMonthItem,
  SalesChartYearItem,
} from "@/types/report/dashboard/sales-chart";
import { CardLoader } from "@/components/loading/DataLoading";


const periodOptions = [
  { value: "day", label: "روزانه" },
  { value: "week", label: "هفتگی" },
  { value: "month", label: "ماهانه" },
  { value: "year", label: "سالانه" },
];

export default function SalesChart() {
  const [period, setPeriod] = useState("day");

  const { data, isLoading } = useApiGet<SalesChartResponse>(
    ["sales-chart", period].join("-"),
    DASHBOARD.sales_chart(period)
  );

  const chartData = data?.data?.map((item) => {
    let label: string;

    switch (period) {
      case "day":
        label = (item as SalesChartDayItem).weekday;
        break;
      case "week":
        label = (item as SalesChartWeekItem).week_start;
        break;
      case "month":
        label = (item as SalesChartMonthItem).month;
        break;
      case "year":
        label = String((item as SalesChartYearItem).year);
        break;
      default:
        label = "";
    }

    return {
      day: label,
      sales: item.total ?? 0,
    };
  }) ?? [];


  return (
    <Card className="p-3 md:p-6 border-gray-200/60 shadow-none">

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-primary-600">
          فروشات {periodOptions.find(p => p.value === period)?.label}
        </h2>

        <div className="w-40">
          <Select
            options={periodOptions}
            value={period}
            onChange={setPeriod}
            placeholder="انتخاب دوره"
            size="sm"
          />
        </div>
      </div>

      {isLoading && <CardLoader />}

      {!isLoading && (
        <div className="h-44 md:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            >
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor="var(--primary-600)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--primary-600)" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="day"
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: number) => [
                  `${value.toLocaleString()} افغانی`,
                  "فروش",
                ]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                }}
                labelStyle={{ color: "#475569", fontWeight: "600" }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="var(--primary-700)"
                strokeWidth={2.5}
                fill="url(#colorSales)"
                dot={{ r: 3, fill: "var(--primary-700)", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "var(--primary-700)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
