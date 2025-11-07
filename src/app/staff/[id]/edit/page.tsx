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

export default function EditStaffPage() {
  const router = useRouter();
  const params = useParams();
  const staffId = Number(params.id);

  const { data: staff, isLoading } = useApiGet<IUser>(
    `staff-${staffId}`,
    USERS.details(staffId)
  );

  const updateMutation = useApiPut<IUser, Partial<IUser>>(USERS.update(staffId));
  const deleteMutation = useApiDeleteDynamic<{ message: string }>();

  const [formData, setFormData] = useState<Partial<IUser>>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (staff) setFormData(staff);
  }, [staff]);

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
        toast.success("اطلاعات کارمند با موفقیت ذخیره شد!", { id: toastId });
        router.push("/staff/list");
      },
      onError: (error) => {
        toast.error(`خطا در ویرایش: ${error.message}`, { id: toastId });
      },
    });
  };

  const handleDeleteConfirm = async () => {
    const toastId = toast.loading("در حال حذف کارمند...");
    await deleteMutation.mutateAsync(USERS.delete(staffId), {
      onSuccess: () => {
        toast.success("کارمند با موفقیت حذف شد!", { id: toastId });
        setIsDeleteModalOpen(false);
        router.push("/staff/list");
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
          title="ویرایش کارمند"
          showHomeIcon
          description="در حال بارگذاری اطلاعات کارمند..."
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
        title="ویرایش کارمند"
        showHomeIcon
        description="اطلاعات کارمند را ویرایش کنید"
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
              label="نام کارمند"
              value={formData.company_name || ""}
              onChange={(e) => handleInputChange("company_name", e.target.value)}
              placeholder="نام کارمند"
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
                {formData.status ? "حساب فعال است" : "حساب غیرفعال است"}
              </h4>
              <p className="text-sm text-gray-500">
                {formData.status
                  ? "با غیرفعال کردن، حساب کاربر موقتاً از دسترسی خارج می‌شود."
                  : "لطفاً دلیل غیرفعال کردن حساب را بنویسید."}
              </p>
            </div>
            <Switch
              checked={formData.status ?? true}
              onChange={(checked) => handleInputChange("status", checked)}
            />
          </div>

        
          {!formData.status && (
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
            حذف کارمند
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
