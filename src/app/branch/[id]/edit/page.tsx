"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { SaveButton, CancelButton, DeleteButton } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Switch } from "@/components/ui/Switch";
import { useRouter, useParams } from "next/navigation";

interface BranchData {
  id: string;
  branchName: string;
  managerName: string;
  phoneNumber: string;
  email: string;
  address: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EditBranchPage() {
  const router = useRouter();
  const params = useParams();
  const branchId = params.id as string;

  const [formData, setFormData] = useState<BranchData>({
    id: "",
    branchName: "",
    managerName: "",
    phoneNumber: "",
    email: "",
    address: "",
    description: "",
    isActive: true,
    createdAt: "",
    updatedAt: ""
  });

  // شبیه‌سازی دریافت داده از API
  useEffect(() => {
    setFormData({
      id: branchId,
      branchName: "شعبه کابل مرکزی",
      managerName: "احمد حفیظی",
      phoneNumber: "0700123456",
      email: "kabul@company.af",
      address: "کابل، ناحیه 7، جاده مرکزی",
      description: "شعبه اصلی شرکت",
      isActive: true,
      createdAt: "2025-03-10",
      updatedAt: "2025-03-20",
    });
  }, [branchId]);

  const handleInputChange = (field: keyof BranchData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Data to update:", formData);
    alert("اطلاعات شعبه با موفقیت به‌روزرسانی شد!");
    router.push("/branch/list");
  };

  const handleCancel = () => {
    if (confirm("آیا از انصراف مطمئن هستید؟ تغییرات ذخیره نخواهند شد.")) {
      router.back();
    }
  };

  const handleDelete = () => {
    if (confirm("آیا از حذف این شعبه مطمئن هستید؟ این عمل غیرقابل بازگشت است.")) {
      console.log("Deleting branch:", branchId);
      alert("شعبه با موفقیت حذف شد!");
      router.push("/branch/list");
    }
  };

  return (
    <div className="w-full">
      <PageHeader
        title="ویرایش شعبه"
        showHomeIcon={true}
        description="اطلاعات شعبه را ویرایش کنید"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* اطلاعات اصلی شعبه */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">اطلاعات اصلی شعبه</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="نام شعبه"
              value={formData.branchName}
              onChange={(e) => handleInputChange("branchName", e.target.value)}
              placeholder="نام شعبه"
              required
            />
            <Input
              label="مدیر شعبه"
              value={formData.managerName}
              onChange={(e) => handleInputChange("managerName", e.target.value)}
              placeholder="مدیر شعبه"
              required
            />
            <Input
              label="شماره تماس"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              placeholder="شماره تماس"
              required
            />
            <Input
              label="ایمیل"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="ایمیل شعبه"
            />
            <div className="md:col-span-2">
              <Input
                label="آدرس"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="آدرس شعبه"
                required
              />
            </div>
          </div>
        </div>

        {/* وضعیت فعال/غیرفعال */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">وضعیت شعبه</h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">وضعیت شعبه</h4>
              <p className="text-sm text-gray-600 mt-1">
                {formData.isActive
                  ? "شعبه فعال است و در سیستم نمایش داده می‌شود"
                  : "شعبه غیرفعال است و دسترسی ندارد"}
              </p>
            </div>
            <Switch
              size="md"
              checked={formData.isActive}
              onChange={(checked) => handleInputChange("isActive", checked)}
            />
          </div>
        </div>

        {/* توضیحات */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">توضیحات</h3>
          <Textarea
            label="توضیحات شعبه"
            value={formData.description}
            onChange={(value) => handleInputChange("description", value)}
            placeholder="توضیحات شعبه"
            rows={4}
          />
        </div>

        {/* دکمه‌های اقدام */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-gray-200">
          <div className="flex gap-3">
            <DeleteButton size="md" onClick={handleDelete}>
              حذف شعبه
            </DeleteButton>
          </div>

          <div className="flex gap-3">
            <CancelButton size="md" onClick={handleCancel}>
              انصراف
            </CancelButton>

            <SaveButton size="md" type="submit">
              ذخیره تغییرات
            </SaveButton>
          </div>
        </div>
      </form>
    </div>
  );
}
