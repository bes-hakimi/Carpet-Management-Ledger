"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Select } from "@/components/ui/Select";
import { useApiGet } from "@/hooks/useApi";
import { DASHBOARD } from "@/endpoints/report/dashboard/dashboard";

import {
  NetIncomeResponse,
  NetIncomeDayItem,
  NetIncomeWeekItem,
  NetIncomeMonthItem,
  NetIncomeYearItem,
  NetIncomeItem,
} from "@/types/report/dashboard/net-income";
import { CardLoader } from "@/components/loading/DataLoading";

const periodOptions = [
  { value: "day", label: "روزانه" },
  { value: "week", label: "هفتگی" },
  { value: "month", label: "ماهانه" },
  { value: "year", label: "سالانه" },
];

export default function ProfitChart() {
  const [period, setPeriod] = useState("day");

  const { data, isLoading } = useApiGet<NetIncomeResponse>(
    ["net-income-chart", period].join("-"),
    DASHBOARD.net_income_chart(period)
  );

  const chartData =
    data?.data?.map((item: NetIncomeItem) => {
      let label: string;
      const value: number = item.net_income;

      switch (period) {
        case "day":
          label = (item as NetIncomeDayItem).day_name;
          break;
        case "week":
          label = (item as NetIncomeWeekItem).week_name;
          break;
        case "month":
          label = (item as NetIncomeMonthItem).month_name;
          break;
        case "year":
          label = String((item as NetIncomeYearItem).shamsi_year);
          break;
        default:
          label = "";
      }

      return { month: label, profit: value };
    }) ?? [];

  return (
    <Card className="p-3 md:p-6 border-gray-200/60 shadow-none">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-primary-600">
          مفاد {periodOptions.find((p) => p.value === period)?.label}
        </h1>

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

      {isLoading ? (
        <CardLoader />
      ) : (
          <div className="h-52 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
          >
            <defs>
              {/* Bar Gradient (vertical) */}
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary-500)" stopOpacity={0.9} />
                <stop offset="95%" stopColor="var(--primary-500)" stopOpacity={0.3} />
              </linearGradient>

              {/* Line Gradient (horizontal) */}
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--primary-400)" />
                <stop offset="100%" stopColor="var(--primary-600)" />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />

            <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />

            <Tooltip
              cursor={{
                fill: "color-mix(in srgb, var(--primary-500) 15%, transparent)",
              }}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                direction: "rtl",
                fontFamily: "Vazirmatn, sans-serif",
              }}
              labelStyle={{ color: "#374151", fontWeight: 500 }}
              formatter={(value: number, name, props) => {
                if (props?.dataKey === "profit") {
                  return [`${value.toLocaleString()} افغانی`, "مفاد"];
                }
                return null;
              }}
            />

            <Bar
              dataKey="profit"
              barSize={24}
              radius={[6, 6, 0, 0]}
              fill="url(#barGradient)"
            />

            <Line
              type="monotone"
              dataKey="profit"
              stroke="url(#lineGradient)"
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "var(--primary-500)",
                strokeWidth: 2,
                stroke: "#fff",
              }}
              activeDot={{
                r: 7,
                stroke: "var(--primary-500)",
                strokeWidth: 3,
                fill: "#fff",
              }}
              tooltipType="none"
            />
          </ComposedChart>
        </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
