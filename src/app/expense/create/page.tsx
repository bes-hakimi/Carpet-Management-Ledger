"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { SaveButton, CancelButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { PageHeader } from "@/components/ui/PageHeader";
import { DollarSign, FileText } from "lucide-react";
import { categories, paymentMethods } from "../constant/constant";
import { useApiPost } from "@/hooks/useApi";
import { EXPENSE } from "@/endpoints/expense";
import { ExpenseCreate, ExpenseCreateResponse } from "@/types/expense/create";
import { ApiError } from "@/types/api/api";

export default function CreateExpensePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ExpenseCreate>({
    title: "",
    price: "",
    category: "",
    description: "",
    peyment_method: "",
  });

  // ✳️ استفاده از hook برای ارسال درخواست POST
const { mutateAsync: createExpense, isPending } = useApiPost<ExpenseCreateResponse, ExpenseCreate>(EXPENSE.create);

  // 🧭 تغییر مقدار در فرم
  const handleChange = (field: keyof ExpenseCreate, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await createExpense(formData); 
    toast.success("مصرف با موفقیت ثبت شد");
    router.push("/expense/list");
  } catch (error: unknown) {
    const err = error as ApiError;
    const errorMessage =
      err?.response?.data?.message ||
      err?.response?.data?.detail ||
      err?.message ||
      "خطا در ثبت مصرف";
    toast.error(errorMessage);
  }
};



  return (
    <div className="min-h-screen w-full">
      <PageHeader
        title="ثبت مصرف جدید"
        description="معلومات مصرف تازه خود را وارد کنید"
        showHomeIcon={true}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl overflow-hidden border border-gray-200"
      >
        <div className="bg-gradient-to-r from-cyan-500 to-primary-500 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">فرم ثبت مصرف</h2>
                <p className="text-primary-100 mt-1 text-sm">تمام فیلدهای ضروری را پر کنید</p>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-2 text-primary-100 text-sm">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>مصرف جدید</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="عنوان مصرف"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="مثال: خرید از بازار"
              icon={<FileText className="w-4 h-4" />}
              required
            />

            <Input
              label="مبلغ (افغانی)"
              type="number"
              value={formData.price.toString()}
              onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
              placeholder="مثال: 1000"
              icon={<DollarSign className="w-4 h-4" />}
              required
            />

            <Select
              label="کتگوری"
              options={categories}
              value={formData.category}
              onChange={(value) => handleChange("category", value)}
              placeholder="کتگوری انتخاب کنید"
              required
            />

            <Select
              label="طریقه پرداخت"
              options={paymentMethods}
              value={formData.peyment_method}
              onChange={(value) => handleChange("peyment_method", value)}
              placeholder="طریقه پرداخت انتخاب کنید"
              required
            />
          </div>

          <Textarea
            label="توضیحات"
            value={formData.description}
            onChange={(value) => handleChange("description", value)}
            placeholder="توضیحات اضافی درباره این مصرف..."
            rows={4}
          />

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <CancelButton onClick={() => router.back()} disabled={isPending}>
              لغو
            </CancelButton>
            <SaveButton type="submit" loading={isPending} loadingText="در حال ثبت..." disabled={isPending}>
              ثبت مصرف
            </SaveButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
