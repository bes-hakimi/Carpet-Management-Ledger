"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { SaveButton, CancelButton } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Switch } from "@/components/ui/Switch";
import { useRouter } from "next/navigation";
import { useApiPost } from "@/hooks/useApi";
import { USERS } from "@/endpoints/users";
import toast from "react-hot-toast";
import PasswordInput from "@/components/ui/PasswordInput";
import { ApiError } from "@/types/api/api";

export default function CreateBranchPage() {
  const router = useRouter();
  const { mutate: createBranch, isPending } = useApiPost(USERS.create);

  const [formData, setFormData] = useState({
    branchName: "",
    managerName: "",
    phoneNumber: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
    description: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ فرمت شماره تماس افغانستان (07xxxxxxxx یا +937xxxxxxxx)
  const phoneLocalRegex = /^07\d{8}$/;
  const phoneIntlRegex = /^\+937\d{8}$/;

  // ✅ اعتبارسنجی فرم
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.branchName.trim()) newErrors.branchName = "نام شعبه الزامی است";
    if (!formData.managerName.trim()) newErrors.managerName = "نام مدیر الزامی است";

    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "شماره تماس الزامی است";
    else if (!phoneLocalRegex.test(formData.phoneNumber) && !phoneIntlRegex.test(formData.phoneNumber))
      newErrors.phoneNumber = "لطفاً شماره تماس با فرمت افغانستان وارد کنید";

    if (!formData.email.trim()) newErrors.email = "ایمیل الزامی است";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "ایمیل نامعتبر است";

    if (!formData.address.trim()) newErrors.address = "آدرس الزامی است";
    if (!formData.password.trim()) newErrors.password = "رمز عبور الزامی است";
    else if (formData.password.length < 6)
      newErrors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";

    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "تأیید رمز عبور مطابقت ندارد";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ مدیریت تغییر فیلدها
  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // ✅ ارسال فرم به API
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) {
      toast.error("لطفاً خطاهای فرم را بررسی کنید.");
      return;
    }

    // فرمت شماره تماس برای ارسال به API

    const payload = {
      branch_name: formData.branchName,
      first_name: formData.managerName,
      email: formData.email,
      password: formData.password,
      phone: formData.phoneNumber,
      address: formData.address,
      description: formData.description,
      status: formData.isActive,
      role: "branch",
    };

    console.log("Submitting payload:", payload);

    createBranch(payload, {
      onSuccess: () => {
        toast.success(`شعبه ${formData.branchName} با موفقیت ایجاد شد`);
        router.push("/branch/list");
      },
      onError: (error: ApiError) => {
        console.error("API Error:", error);

        const message =
          error.response?.data?.message ??
          error.response?.data?.detail ??
          error.message ??
          "مشکلی در ارسال اطلاعات به سرور رخ داد";
        toast.error(message);
      },
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="w-full">
      <PageHeader
        title="ایجاد شعبه"
        showHomeIcon={true}
        description="اطلاعات شعبه جدید را در فرم زیر وارد کنید"
      />

      <form onSubmit={handleSubmit} className="space-y-6 border border-gray-300 rounded-md p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="نام شعبه"
            value={formData.branchName}
            onChange={(e) => handleChange("branchName", e.target.value)}
            placeholder="مثلاً شعبه مرکزی"
            error={errors.branchName}
          />

          <Input
            label="مدیر شعبه"
            value={formData.managerName}
            onChange={(e) => handleChange("managerName", e.target.value)}
            placeholder="مثلاً علی رضایی"
            error={errors.managerName}
          />

          <Input
            label="شماره تماس"
            type="text"
            dir="rtl"
            value={formData.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            placeholder="شماره تماس با فرمت افغانستان"
            error={errors.phoneNumber}
          />

          <Input
            label="ایمیل"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="مثلاً example@email.com"
            error={errors.email}
          />

          <PasswordInput
            label="رمز عبور"
            value={formData.password}
            onChange={(val) => handleChange("password", val)}
            placeholder="حداقل ۶ کاراکتر"
            animated={false}
            error={errors.password}
          />

          <PasswordInput
            label="تأیید رمز عبور"
            value={formData.confirmPassword}
            onChange={(val) => handleChange("confirmPassword", val)}
            placeholder="تکرار رمز عبور"
            animated={false}
            error={errors.confirmPassword}
          />

          <div className="md:col-span-2">
            <Input
              label="آدرس"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="آدرس کامل شعبه"
              error={errors.address}
            />
          </div>

          <div className="md:col-span-2 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
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
                onChange={(checked) => handleChange("isActive", checked)}
              />
            </div>
          </div>
        </div>

        <Textarea
          label="توضیحات"
          value={formData.description}
          onChange={(val) => handleChange("description", val)}
          placeholder="توضیحات شعبه (اختیاری)"
          rows={4}
        />

        <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
          <CancelButton type="button" onClick={handleCancel}>انصراف</CancelButton>
          <SaveButton type="submit" loading={isPending}>
            ایجاد شعبه
          </SaveButton>
        </div>
      </form>
    </div>
  );
}
