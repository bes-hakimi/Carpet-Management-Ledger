import { Card } from "@/components/ui/Card";
import { DollarSign, Receipt, BarChart3, Archive } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { IPublicMainReport } from "@/types/report/overview";

interface OverviewStatsCardsProps {
  stats: IPublicMainReport;
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "blue"
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  trend?: number;
  color?: "blue" | "green" | "purple" | "orange";
}) => {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-500",
    green: "from-emerald-500 to-green-500",
    purple: "from-purple-500 to-pink-500",
    orange: "from-orange-500 to-red-500"
  };

  const isPositive = trend && trend >= 0;

  return (
    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 p-4 border-0 bg-gradient-to-br from-white to-gray-50/50">
      <div className="flex flex-row items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <div className="text-xl font-bold text-gray-900 mb-1">{value}</div>
        {subtitle && <p className="text-sm text-gray-600 mb-2">{subtitle}</p>}
        {trend && (
          <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
            {isPositive ?
              <ArrowUpRight className="w-4 h-4 ml-1" /> :
              <ArrowDownRight className="w-4 h-4 ml-1" />
            }
            {Math.abs(trend).toFixed(1)}% نسبت به دوره قبل
          </div>
        )}
      </div>
      <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${colorClasses[color]} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
    </Card>
  );
};

export default function OverviewStatsCards({ stats }: OverviewStatsCardsProps) {
  if (!stats?.report) {
    return <div>در حال بارگذاری...</div>; // یا Skeleton / Loader
  }

  const safeStats = {
    totalSalesPrice: stats.report.total_sales_price ?? 0,
    totalStockQty: stats.report.total_stock_qty ?? 0,
    companyValue: stats.report.company_value ?? 0,
    totalSoldQty: stats.report.total_sold_qty ?? 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="فروش کل"
        value={safeStats.totalSalesPrice.toString()} // فقط تبدیل به رشته
        subtitle="افغانی"
        icon={DollarSign}
        color="green"
      />

      <StatCard
        title="تعداد بل‌ها"
        value={safeStats.totalSoldQty.toString()}
        subtitle="بل فروش"
        icon={Receipt}
        color="blue"
      />

      <StatCard
        title="ارزش شرکت"
        value={safeStats.companyValue.toString()}
        subtitle="افغانی"
        icon={BarChart3}
        color="purple"
      />

      <StatCard
        title="موجودی گدام"
        value={safeStats.totalStockQty.toString()}
        subtitle="عدد قالین"
        icon={Archive}
        color="orange"
      />

    </div>
  );
}
