import { Card } from "@/components/ui/Card";
import { Calendar, Inbox } from "lucide-react";
import { DownloadButton, ViewButton } from "@/components/ui/Button";
import EmptyState from "../EmptyState";
import { IFinancialDailyReport } from "@/types/report/financial";

interface DailyExpenseListProps {
  data: IFinancialDailyReport[];
}

export default function DailyExpenseList({ data }: DailyExpenseListProps) {
  const isEmpty = !data || data.length === 0;

  return (
    <Card className="p-4 md:p-6 border-0 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-gray-900">گزارش روزانه مالی</h3>
        </div>
        <div className="flex gap-2">
          <DownloadButton size="sm" variant="outline" disabled={isEmpty} />
          <ViewButton size="sm" variant="outline" disabled={isEmpty} />
        </div>
      </div>

      {isEmpty ? (
        <EmptyState
          icon={Inbox}
          title="هیچ داده مالی ثبت نشده است"
          description="برای مشاهده گزارش‌ها، باید حداقل یک رکورد مالی ثبت شود."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-4 px-4 text-right font-bold text-gray-900">تاریخ</th>
                <th className="py-4 px-4 text-center font-bold text-gray-900 text-nowrap">تعداد بل</th>
                <th className="py-4 px-4 text-center font-bold text-gray-900 text-nowrap">فروش کل</th>
                <th className="py-4 px-4 text-center font-bold text-gray-900 text-nowrap">سود خالص</th>
                <th className="py-4 px-4 text-center font-bold text-gray-900">عملکرد</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                  <td className="py-4 px-4 text-right font-semibold text-gray-900 text-nowrap">{item.date}</td>
                  <td className="py-4 px-4 text-center text-gray-700">{item.total_bills}</td>
                  <td className="py-4 px-4 text-center font-bold text-gray-900">{parseFloat(item.total_sales).toLocaleString()}</td>
                  <td className="py-4 px-4 text-center font-bold text-gray-900">{parseFloat(item.net_profit).toLocaleString()}</td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        item.performance.color === 'green'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : item.performance.color === 'orange'
                          ? 'bg-orange-100 text-orange-800 border border-orange-200'
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}
                    >
                      {item.performance.label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
