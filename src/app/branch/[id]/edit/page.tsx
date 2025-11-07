"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { SaveButton, CancelButton, DeleteButton } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Switch } from "@/components/ui/Switch";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";

import { useApiGet, useApiPut, useApiDeleteDynamic } from "@/hooks/useApi";
import { USERS } from "@/endpoints/users";
import { IUser } from "@/types/user/user";

export default function EditBranchPage() {
  const router = useRouter();
  const params = useParams();
  const branchId = Number(params.id);

  const { data: branch, isLoading } = useApiGet<IUser>(
    `branch-${branchId}`,
    USERS.details(branchId)
  );

  const updateMutation = useApiPut<IUser, Partial<IUser>>(USERS.update(branchId));
  const deleteMutation = useApiDeleteDynamic<{ message: string }>();

  const [formData, setFormData] = useState<Partial<IUser>>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (branch) setFormData(branch);
  }, [branch]);

  const handleInputChange = (field: keyof IUser, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body: Partial<IUser> = {
      ...formData,
    };

    const toastId = toast.loading("در حال ذخیره تغییرات...");

    await updateMutation.mutateAsync(body, {
      onSuccess: () => {
        toast.success("اطلاعات شعبه با موفقیت ذخیره شد!", { id: toastId });
        router.push("/branch/list");
      },
      onError: (error) => {
        toast.error(`خطا در ویرایش: ${error.message}`, { id: toastId });
      },
    });
  };

  const handleDeleteConfirm = async () => {
    const toastId = toast.loading("در حال حذف شعبه...");
    await deleteMutation.mutateAsync(USERS.delete(branchId), {
      onSuccess: () => {
        toast.success("شعبه با موفقیت حذف شد!", { id: toastId });
        setIsDeleteModalOpen(false);
        router.push("/branch/list");
      },
      onError: (error) => {
        toast.error(`خطا در حذف: ${error.message}`, { id: toastId });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <PageHeader
          title="ویرایش شعبه"
          showHomeIcon
          description="در حال بارگذاری اطلاعات شعبه..."
        />
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <PageHeader
        title="ویرایش شعبه"
        showHomeIcon
        description="اطلاعات شعبه را ویرایش کنید"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ✅ اطلاعات اصلی */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-6">اطلاعات اصلی</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="نام"
              value={formData.first_name || ""}
              onChange={(e) => handleInputChange("first_name", e.target.value)}
              placeholder="نام"
              required
            />
            <Input
              label="نام خانوادگی"
              value={formData.last_name || ""}
              onChange={(e) => handleInputChange("last_name", e.target.value)}
              placeholder="نام خانوادگی"
              required
            />
            <Input
              label="شماره تماس"
              value={formData.phone?.toString() || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="شماره تماس"
              required
            />
            <Input
              label="نام شعبه"
              value={formData.company_name || ""}
              onChange={(e) => handleInputChange("company_name", e.target.value)}
              placeholder="نام شعبه"
              required
            />

          </div>
        </div>

        {/* ✅ وضعیت */}
        {/* ✅ وضعیت */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-6">وضعیت حساب</h3>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium">
                {formData.is_active ? "حساب فعال است" : "حساب غیرفعال است"}
              </h4>
              <p className="text-sm text-gray-500">
                {formData.is_active
                  ? "با غیرفعال کردن، حساب کاربر موقتاً از دسترسی خارج می‌شود."
                  : "لطفاً دلیل غیرفعال کردن حساب را بنویسید."}
              </p>
            </div>
            <Switch
              checked={formData.is_active ?? true}
              onChange={(checked) => handleInputChange("is_active", checked)}
            />
          </div>

        
          {!formData.is_active && (
            <div className="mt-4">
              <Textarea
                label="دلیل غیرفعال کردن حساب"
                value={formData.reson_of_status || ""}
                onChange={(value) => handleInputChange("reson_of_status", value)}
                placeholder="مثلاً: تخلف از قوانین، درخواست کاربر، عدم پرداخت هزینه و ..."
                rows={3}
                required
              />
            </div>
          )}
        </div>


        {/* ✅ توضیحات */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <Textarea
            label="توضیحات"
            value={formData.description || ""}
            onChange={(value) => handleInputChange("description", value)}
            rows={4}
          />
        </div>

        {/* ✅ دکمه‌ها */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end items-center pt-6">
          <DeleteButton onClick={() => setIsDeleteModalOpen(true)}>
            حذف شعبه
          </DeleteButton>
          <CancelButton onClick={() => router.back()}>
            انصراف
          </CancelButton>
          <SaveButton type="submit" loading={updateMutation.isPending}>
            ذخیره تغییرات
          </SaveButton>

        </div>
      </form>

      {/* ✅ مدال حذف */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
        itemName={`${formData.first_name || ""} ${formData.last_name || ""}`}
      />
    </div>
  );
}
