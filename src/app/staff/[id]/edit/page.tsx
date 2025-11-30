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
import { ContentLoader } from "@/components/loading/DataLoading";
import { useApiGet, useApiPut, useApiDeleteDynamic } from "@/hooks/useApi";
import { USERS } from "@/endpoints/users";
import { IUser } from "@/types/user/user";

interface StaffDetailsResponse {
  details: IUser;
}

export default function EditStaffPage() {
  const router = useRouter();
  const params = useParams();

  // ✅ همیشه نوع را string نگه می‌داریم
  const staffId = params?.id ? String(params.id) : "";

  const { data: staff, isLoading } = useApiGet<StaffDetailsResponse>(
  `staff-${staffId}`,
  USERS.details(Number(staffId))
);


  const updateMutation = useApiPut<IUser, Partial<IUser>>(USERS.update(Number(staffId)));
  const deleteMutation = useApiDeleteDynamic<{ message: string }>();

  const [formData, setFormData] = useState<Partial<IUser>>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (staff?.details) {
      setFormData(staff.details);
    }
  }, [staff]);

  const handleInputChange = (field: keyof IUser, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

    await updateMutation.mutateAsync(formData, {
      onSuccess: () => {
        toast.success("اطلاعات کارمند با موفقیت ذخیره شد!");
        router.push("/staff/list");
      },
      onError: (error) => {
        toast.error(`خطا در ویرایش: ${error.message}`);
      },
    });
  };

  const handleDeleteConfirm = async () => {
    await deleteMutation.mutateAsync(USERS.delete(Number(staffId)), {
      onSuccess: () => {
        toast.success("کارمند با موفقیت حذف شد!");
        setIsDeleteModalOpen(false);
        router.push("/staff/list");
      },
      onError: (error) => {
        toast.error(`خطا در حذف: ${error.message}`);
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
        <ContentLoader />
      </div>
    );
  }

  if (!formData?.id) {
    return (
      <div className="text-center mt-10 text-gray-500">
        اطلاعاتی برای این کارمند یافت نشد.
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
              label="آدرس"
              value={formData.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="آدرس"
              required
            />
          </div>
        </div>

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
          <DeleteButton type="button" onClick={() => setIsDeleteModalOpen(true)}>
            حذف کارمند
          </DeleteButton>
          <CancelButton type="button" onClick={() => router.back()}>انصراف</CancelButton>
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
