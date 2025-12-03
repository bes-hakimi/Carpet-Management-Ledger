import { Card } from "@/components/ui/Card";
import { DownloadButton, ViewButton } from "@/components/ui/Button";
import { Calendar } from "lucide-react";
import { ISaleDailySale } from "@/types/report/sale";

interface DailySalesReportProps {
  data: ISaleDailySale[];
}

const SectionCard = ({
  title,
  children,
  icon: Icon,
  action,
}: {
  title: string;
  children: React.ReactNode;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  action?: React.ReactNode;
}) => (
  <Card className="p-6 border-0 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-2 items-center">
        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white mr-3">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
      </div>
      {action}
    </div>
    {children}
  </Card>
);

export default function SalesDailySalesReport({ data }: DailySalesReportProps) {
  return (
    <SectionCard
      title="گزارش روزانه فروش"
      icon={Calendar}
      action={
        <div className="flex gap-2">
          <DownloadButton size="sm" variant="outline" />
          <ViewButton size="sm" variant="outline" />
        </div>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-right py-4 px-4 font-bold text-gray-900">تاریخ</th>
              <th className="text-center py-4 px-4 font-bold text-gray-900">تعداد بل</th>
              <th className="text-center py-4 px-4 font-bold text-gray-900">مبلغ کل</th>
              <th className="text-center py-4 px-4 font-bold text-gray-900">عملکرد</th>
            </tr>
          </thead>

          <tbody>
            {data.map((sale, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="py-4 px-4 text-right font-semibold text-gray-900">
                  {sale.date}
                </td>

                <td className="py-4 px-4 text-center text-gray-700">
                  {sale.total_bills}
                </td>

                <td className="py-4 px-4 text-center font-bold text-gray-900">
                  {(Number(sale.total_amount)).toLocaleString()} افغانی
                </td>

                <td className="py-4 px-4 text-center">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-${sale.performance.color}-100 text-${sale.performance.color}-800 border border-${sale.performance.color}-200`}
                  >
                    {sale.performance.label}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}
