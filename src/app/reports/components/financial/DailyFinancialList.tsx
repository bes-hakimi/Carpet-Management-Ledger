import { Card } from "@/components/ui/Card";
import { IFinancialDailyExpense } from "@/types/report/financial";

interface DailyFinancialListProps {
  data: IFinancialDailyExpense[];
}

export default function DailyFinancialList({ data }: DailyFinancialListProps) {
  return (
    <Card className="p-6 border-0 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      <h3 className="text-base font-bold text-gray-900 mb-4">گزارش روزانه هزینه‌ها</h3>
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
              <tr key={index} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="py-4 px-4 text-right font-semibold text-gray-900">{item.day}</td>
                <td className="py-4 px-4 text-center font-bold text-gray-900">{parseFloat(item.total_expenses).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
