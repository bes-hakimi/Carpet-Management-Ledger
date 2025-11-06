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

export default function CreateBranchPage() {
  const router = useRouter();

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

  const createBranch = useApiPost(USERS.create);

  const afghanistanPhoneRegex = /^0[7]\d{8}$/;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.branchName.trim()) newErrors.branchName = "نام شعبه الزامی است";
    if (!formData.managerName.trim()) newErrors.managerName = "نام مدیر الزامی است";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "شماره تماس الزامی است";
    else if (!afghanistanPhoneRegex.test(formData.phoneNumber))
      newErrors.phoneNumber = "شماره تماس باید با 07 شروع شود و 9 رقم باشد (مثلاً 0791234567)";
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

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("لطفاً خطاهای فرم را بررسی کنید.");
      return;
    }

    try {
      const payload = {
        ...formData,
        phoneNumber: formData.phoneNumber.replace(/^\+93/, "0"), // ✅ فرمت اصلاحی شماره تماس
      };

      await createBranch.mutateAsync(payload);
      toast.success("شعبه با موفقیت ایجاد شد!");
      setTimeout(() => router.push("/branch/list"), 2000);
    } catch (error: any) {
      // ✅ هندل ارور با ساختار سرور
      if (error?.response?.data) {
        const serverErrors = error.response.data;
        const formattedErrors: Record<string, string> = {};

        Object.entries(serverErrors).forEach(([key, messages]) => {
          if (Array.isArray(messages)) formattedErrors[key] = messages[0];
        });

        setErrors((prev) => ({ ...prev, ...formattedErrors }));

        const firstError = Object.values(formattedErrors)[0];
        if (firstError) toast.error(firstError);
        else toast.error("خطا در ایجاد شعبه");
      } else {
        toast.error("خطا در ارتباط با سرور");
      }
    }
  };

  const handleCancel = () => {
    if (confirm("آیا از انصراف مطمئن هستید؟ اطلاعات ذخیره نخواهند شد.")) {
      router.back();
    }
  };

  return (
    <div className="w-full">
      <PageHeader
        title="ایجاد شعبه"
        showHomeIcon={true}
        description="اطلاعات شعبه جدید را در فرم زیر وارد کنید"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
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
            type="tel"
            dir="rtl"
            value={formData.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            placeholder="مثلاً 0791234567"
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

          <div className="md:col-span-2">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
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
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">توضیحات</label>
          <Textarea
            value={formData.description}
            onChange={(val) => handleChange("description", val)}
            placeholder="توضیحات شعبه (اختیاری)"
            rows={4}
          />
        </div>

        <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
          <CancelButton size="md" onClick={handleCancel}>
            انصراف
          </CancelButton>
          <SaveButton size="md" type="submit" loading={createBranch.isPending}>
            ایجاد شعبه
          </SaveButton>
        </div>
      </form>
    </div>
  );
}
