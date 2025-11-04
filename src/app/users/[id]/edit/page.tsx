// src/app/edit-user/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { FileUpload } from "@/components/ui/FileUpload";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { SaveButton, CancelButton, DeleteButton } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Switch } from "@/components/ui/Switch";
import { useRouter, useParams } from "next/navigation";

const categories = [
  { value: "carpet", label: "فروشگاه قالین" },
  { value: "dishes", label: "فروشگاه ظروف" },
  { value: "clothes", label: "فروشگاه لباس" },
  { value: "electronics", label: "فروشگاه وسایل برقی" },
  { value: "cosmetics", label: "فروشگاه وسایل آرایشی" },
];

const durations = [
  { value: "1m", label: "فعال برای یک ماه" },
  { value: "2m", label: "فعال برای دو ماه" },
  { value: "3m", label: "فعال برای سه ماه" },
  { value: "6m", label: "فعال برای شش ماه" },
  { value: "1y", label: "فعال برای یک سال" },
];

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  phoneNumber: string;
  category: string;
  duration: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [formData, setFormData] = useState<UserData>({
    id: "",
    firstName: "",
    lastName: "",
    companyName: "",
    phoneNumber: "",
    category: "",
    duration: "",
    description: "",
    isActive: true,
    createdAt: "",
    updatedAt: ""
  });
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [contractFileUrl, setContractFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // شبیه‌سازی دریافت داده از API
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      // در واقعیت اینجا API call خواهید داشت
      setTimeout(() => {
        setFormData({
          id: userId,
          firstName: "امین",
          lastName: "محمدی",
          companyName: "فروشگاه قالین امین",
          phoneNumber: "09123456789",
          category: "carpet",
          duration: "1y",
          description: "فروشگاه تخصصی قالین و فرش دستباف",
          isActive: true,
          createdAt: "2024-01-15",
          updatedAt: "2024-03-20"
        });
        setIsLoading(false);
      }, 1000);
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (field: keyof UserData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      companyLogo,
      contractFileUrl
    };
    console.log("Data to update:", submitData);
    alert("اطلاعات کاربر با موفقیت به‌روزرسانی شد!");
    router.push("/users");
  };

  const handleCancel = () => {
    if (confirm("آیا از انصراف مطمئن هستید؟ تغییرات ذخیره نخواهند شد.")) {
      router.back();
    }
  };

  const handleDelete = () => {
    if (confirm("آیا از حذف این کاربر مطمئن هستید؟ این عمل غیرقابل بازگشت است.")) {
      console.log("Deleting user:", userId);
      alert("کاربر با موفقیت حذف شد!");
      router.push("/users");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <PageHeader
          title="ویرایش کاربر"
          showHomeIcon={true}
          description="در حال بارگذاری اطلاعات کاربر..."
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
        title="ویرایش کاربر"
        showHomeIcon={true}
        description="اطلاعات کاربر را ویرایش کنید"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">اطلاعات اصلی</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="نام"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="نام"
              required
            />

            <Input
              label="نام خانوادگی"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="نام خانوادگی"
              required
            />

            <Input
              label="شماره تماس"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder="شماره تماس"
              required
            />

            <Input
              label="نام شرکت"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="نام شرکت"
              required
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">فایل‌ها و مدارک</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-700">لگوی شرکت</label>
              <ImageUpload
                onImageSelect={setCompanyLogo}
                label="آپلود لگوی جدید"
                maxSize={2}
              />
              <p className="text-xs text-gray-500 mt-2">لگوی فعلی: company-logo.png</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-gray-700">فایل قرارداد</label>
              <FileUpload
                onFileSelect={setContractFileUrl}
                accept=".pdf,.doc,.docx"
                label="آپلود قرارداد جدید"
                maxSize={10}
              />
              <p className="text-xs text-gray-500 mt-2">فایل فعلی: contract.pdf</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">تنظیمات فروشگاه</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="کتگوری"
              options={categories}
              value={formData.category}
              onChange={(value) => handleInputChange('category', value)}
              placeholder="انتخاب کتگوری"
            />

            <Select
              label="مدت فعال بودن"
              options={durations}
              value={formData.duration}
              onChange={(value) => handleInputChange('duration', value)}
              placeholder="مدت فعال بودن فروشگاه"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">وضعیت حساب</h3>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">وضعیت حساب کاربری</h4>
              <p className="text-sm text-gray-600 mt-1">
                {formData.isActive
                  ? "حساب کاربری فعال است و می‌تواند از سیستم استفاده کند"
                  : "حساب کاربری غیرفعال است و دسترسی ندارد"
                }
              </p>
            </div>
            <Switch
              size="md"
              checked={formData.isActive}
              onChange={(checked) => handleInputChange('isActive', checked)}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">توضیحات</h3>

          <Textarea
            label="توضیحات کاربر"
            value={formData.description}
            onChange={(value) => handleInputChange('description', value)}
            placeholder="توضیحات کاربر"
            rows={4}
          />
        </div>

        {/* دکمه‌های اقدام */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-gray-200">
          <div className="flex gap-3">
            <DeleteButton
              size="md"
              onClick={handleDelete}
            >
              حذف کاربر
            </DeleteButton>
          </div>

          <div className="flex gap-3">
            <CancelButton
              size="md"
              onClick={handleCancel}
            >
              انصراف
            </CancelButton>

            <SaveButton
              size="md"
              type="submit"
            >
              ذخیره تغییرات
            </SaveButton>
          </div>
        </div>
      </form>
    </div>
  );
}