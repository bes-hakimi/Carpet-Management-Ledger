import { Card } from "@/components/ui/Card";
import { Inbox, CalendarRange } from "lucide-react";
import EmptyState from "../EmptyState";
import { IFinancialDailyExpense } from "@/types/report/financial";

interface DailyFinancialListProps {
  data: IFinancialDailyExpense[];
}

export default function DailyFinancialList({ data }: DailyFinancialListProps) {
  const isEmpty = !data || data.length === 0;

  return (
    <Card className="p-4 md:p-6 border-0 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
            <CalendarRange className="w-5 h-5" />
          </div>
        <h3 className="text-base font-bold text-gray-900">گزارش روزانه هزینه‌ها</h3>
      </div>

      {isEmpty ? (
        <EmptyState
          icon={Inbox}
          title="هیچ هزینه‌ای ثبت نشده است"
          description="برای مشاهده گزارش‌ها، باید حداقل یک رکورد هزینه ثبت شود."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-4 px-4 text-right font-bold text-gray-900">روز</th>
                <th className="py-4 px-4 text-center font-bold text-gray-900">مجموع هزینه‌ها</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                >
                  <td className="py-4 px-4 text-right font-semibold text-gray-900">
                    {item.day}
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-gray-900">
                    {parseFloat(item.total_expenses).toLocaleString()}
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
