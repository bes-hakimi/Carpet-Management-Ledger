"use client";

import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { AddButton} from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tag, CreditCard, FileText, Clock, CheckCircle } from "lucide-react";
import { useApiGet } from "@/hooks/useApi";
import { EXPENSE } from "@/endpoints/expense";
import { ExpenseDetailsType } from "@/types/expense/details";
import { ContentLoader } from "@/components/loading/DataLoading";

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueColor?: string;
}

function DetailItem({ icon, label, value, valueColor = "text-gray-900" }: DetailItemProps) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg">
      <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className={`text-sm md:text-lg font-semibold mt-1 ${valueColor}`}>{value}</p>
      </div>
    </div>
  );
}

export default function ExpenseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const expenseId = Number(params.id); // ✅ به‌جای props استفاده از useParams

  const { data: expense, isLoading, isError } = useApiGet<ExpenseDetailsType>(
    `expense-detail-${expenseId}`,
    EXPENSE.details(expenseId)
  );

  const statusInfo = {
    icon: <CheckCircle className="w-5 h-5" />,
    color: "text-green-600 bg-green-100",
    label: "تکمیل شده",
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title={`جزئیات مصرف${expense ? `: ${expense.title}` : ""}`}
        description="مشاهده اطلاعات کامل مصرف ثبت شده"
        showHomeIcon
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 p-4 md:p-6 border border-gray-200 rounded-xl">
        {isLoading && <ContentLoader />}
        {isError && <p className="text-center text-red-500">خطا در دریافت داده‌ها</p>}

        {expense && !isLoading && !isError && (
          <>
            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">
              {/* <PrintButton onClick={() => window.print()}>پرنت</PrintButton> */}
              <AddButton onClick={() => router.push("/expense/create")}>مصرف جدید</AddButton>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Main Information */}
              <div className="lg:col-span-2 space-y-4 md:space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">وضعیت مصرف</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`p-2 rounded-lg ${statusInfo.color}`}>{statusInfo.icon}</div>
                      <span className="text-sm md:text-xl font-bold text-gray-900">{statusInfo.label}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">مبلغ</p>
                    <p className="text-sm md:text-xl font-bold text-primary-600">
                      {Number(expense.price).toLocaleString()} افغانی
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <DetailItem
                    icon={<FileText className="w-5 h-5 text-primary-600" />}
                    label="عنوان مصرف"
                    value={expense.title}
                  />
                  <DetailItem
                    icon={<Tag className="w-5 h-5 text-primary-600" />}
                    label="کتگوری"
                    value={expense.category}
                  />
                  <DetailItem
                    icon={<CreditCard className="w-5 h-5 text-blue-600" />}
                    label="طریقه پرداخت"
                    value={expense.peyment_method}
                  />
                  <DetailItem
                    icon={<Clock className="w-5 h-5 text-orange-600" />}
                    label="تاریخ ثبت"
                    value={new Date(expense.updated_at).toLocaleDateString("fa-AF")}
                  />
                </div>

                {/* Description */}
                {expense.description && (
                  <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <h3 className="text-sm md:text-lg font-semibold text-gray-900">توضیحات</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{expense.description}</p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-primary-50 rounded-xl border border-primary-200 p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-primary-900 mb-3">راهنمایی</h3>
                  <ul className="space-y-2 text-sm text-primary-800">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span>مصرف های خود را به طور منظم ثبت کنید</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span>کتگوری صحیح برای هر مصرف انتخاب کنید</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span>توضیحات کامل برای مصارف بزرگ وارد کنید</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
