import { Card } from "@/components/ui/Card";
import { Package, Inbox } from "lucide-react";
import { ViewButton } from "@/components/ui/Button";
import EmptyState from "../EmptyState"; 
import { ISaleTopSellingProduct } from "@/types/report/sale";

interface TopProductsProps {
  data: ISaleTopSellingProduct[];
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

export default function SalesTopProducts({ data }: TopProductsProps) {
  const isEmpty = !data || data.length === 0;

  return (
    <SectionCard
      title="محصولات پرفروش"
      icon={Package}
      action={<ViewButton size="sm" variant="outline" disabled={isEmpty} />}
    >
      {isEmpty ? (
        <EmptyState
          icon={Inbox}
          title="هیچ محصول پرفروشی ثبت نشده"
          description="برای مشاهده محصولات پرفروش، باید حداقل یک فروش ثبت شده باشد."
        />
      ) : (
        <div className="space-y-4">
          {data.map((product, index) => (
            <div
              key={product.rank ?? index}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200"
            >
              <div className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ${
                    index === 0
                      ? "bg-gradient-to-br from-yellow-500 to-orange-500"
                      : index === 1
                      ? "bg-gradient-to-br from-gray-500 to-gray-700"
                      : index === 2
                      ? "bg-gradient-to-br from-orange-500 to-red-500"
                      : "bg-gradient-to-br from-blue-500 to-cyan-500"
                  }`}
                >
                  {product.rank ?? index + 1}
                </div>

                <div className="mr-3 flex-1">
                  <p className="font-semibold text-gray-900 text-sm leading-tight">
                    {product.name}
                  </p>

                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-gray-600">فروش: {product.sold}</span>
                    <span className="text-xs text-gray-600">موجودی: {product.stock}</span>
                  </div>
                </div>
              </div>

              <div className="text-left">
                <p className="font-bold text-emerald-600 text-sm">
                  {(Number(product.total_amount).toLocaleString("fa-IR"))} افغانی
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
