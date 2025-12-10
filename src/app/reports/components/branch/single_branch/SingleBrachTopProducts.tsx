import { Card } from "@/components/ui/Card";
import { Package } from "lucide-react";
import EmptyState from "../../EmptyState";
import { ISingleBranchStockItem } from "@/types/report/single-branch";

interface SingleBrachTopProductsProps {
  data: ISingleBranchStockItem[];
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
  <Card className="p-4 md:p-6 border-0 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-2 items-center">
        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white md:mr-3">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
      </div>
      {action}
    </div>
    {children}
  </Card>
);

export default function SingleBrachTopProducts({ data }: SingleBrachTopProductsProps) {
  if (!data || data.length === 0) {
    return (
      <SectionCard title="محصولات پرفروش" icon={Package}>
        <EmptyState
          title="هیچ محصولی یافت نشد"
          description="برای مشاهده محصولات پرفروش، باید حداقل یک محصول در انبار ثبت شده باشد."
          icon={Package}
        />
      </SectionCard>
    );
  }
  return (
    <SectionCard
      title="محصولات پرفروش"
      icon={Package}
    >
      <div className="space-y-4">
        {data.map((product, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200"
          >
            <div className="flex items-center flex-1">
              {/* رتبه با رنگ بندی قبلی (UI دست‌نخورده) */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ${index === 0
                    ? "bg-gradient-to-br from-yellow-500 to-orange-500"
                    : index === 1
                      ? "bg-gradient-to-br from-gray-500 to-gray-700"
                      : index === 2
                        ? "bg-gradient-to-br from-orange-500 to-red-500"
                        : "bg-gradient-to-br from-blue-500 to-cyan-500"
                  }`}
              >
                {index + 1}
              </div>

              <div className="mr-3 flex-1">
                <p className="font-semibold text-gray-900 text-sm leading-tight">
                  {product.name}
                </p>

                {/* نمایش دیتای API */}
                <div className="flex flex-col mt-1 text-xs text-gray-600 space-y-1">
                  <span>نوع: {product.type}</span>
                  <span>موجودی: {product.stock_qty} / {product.max_stock}</span>

                  <span>درصد پر بودن: {product.percentage}%</span>

                  <span
                    className={
                      product.status === "normal"
                        ? "text-emerald-600 font-bold"
                        : product.status === "low"
                          ? "text-orange-500 font-bold"
                          : "text-red-500 font-bold"
                    }
                  >
                    وضعیت: {product.status}
                  </span>
                </div>
              </div>
            </div>

            {/* ستون سمت چپ خالی می‌ماند چون total_amount وجود ندارد */}
            <div className="text-left text-sm text-gray-500">

            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
