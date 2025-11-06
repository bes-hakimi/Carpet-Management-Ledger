"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { SaveButton, CancelButton } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Switch } from "@/components/ui/Switch";
import toast from "react-hot-toast";
import { useApiPost } from "@/hooks/useApi";
import { USERS } from "@/endpoints/users";
import PasswordInput from "@/components/ui/PasswordInput";

export default function CreateStaffPage() {
  const router = useRouter();
  const { mutate: createUser, isPending } = useApiPost(USERS.create);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("07");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ اعتبارسنجی فرم
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = "نام الزامی است";
    if (!lastName.trim()) newErrors.lastName = "نام خانوادگی الزامی است";

    const phoneRegex = /^07\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      newErrors.phoneNumber = "شماره تماس باید با 07 شروع شود و 10 رقم باشد";
    }

    if (!email.trim()) newErrors.email = "ایمیل الزامی است";
    if (!password.trim()) newErrors.password = "رمز عبور الزامی است";
    if (!confirmPassword.trim()) newErrors.confirmPassword = "تکرار رمز عبور الزامی است";
    if (password && password.length < 6)
      newErrors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";
    if (password && confirmPassword && password !== confirmPassword)
      newErrors.confirmPassword = "رمز عبور و تکرار آن مطابقت ندارند";

    if (!address.trim()) newErrors.address = "آدرس الزامی است";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 نگاشت خطای API
  const handleApiErrors = (data: any) => {
    if (!data || typeof data !== "object") return;
    const apiErrors: Record<string, string> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) apiErrors[key] = value.join(" ");
      else if (typeof value === "string") apiErrors[key] = value;
    });
    setErrors((prev) => ({ ...prev, ...apiErrors }));
  };

  // ✅ ارسال فرم
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    // نرمال‌سازی شماره تماس (حذف صفر و تبدیل به عدد)
    const normalizedPhone = Number(phoneNumber.replace(/^0/, "7"));

    const payload = {
      email,
      first_name: firstName,
      last_name: lastName,
      password,
      role: "staff",
      phone: normalizedPhone,
      status: isActive,
      address,
      description,
    };

    console.log("Submitting payload:", payload);

    createUser(payload, {
      onSuccess: () => {
        toast.success(`کارمند ${firstName} ${lastName} با موفقیت ایجاد شد`);
        router.push("/company/list");
      },
      onError: (error: any) => {
        console.error("API Error:", error);
        const data = error?.response?.data ?? error?.data ?? null;
        if (data && typeof data === "object") {
          handleApiErrors(data);
          Object.entries(data).forEach(([key, value]) => {
            if (Array.isArray(value)) value.forEach((msg) => toast.error(msg));
            else if (typeof value === "string") toast.error(value);
          });
        } else {
          toast.error("مشکلی در ارسال اطلاعات به سرور رخ داد");
        }
      },
    });
  };

  const handleCancel = () => {
    if (confirm("آیا از انصراف مطمئن هستید؟ اطلاعات ذخیره نخواهند شد.")) {
      router.back();
    }
  };

  return (
    <div className="w-full">
      <PageHeader
        title="ایجاد کارمند"
        showHomeIcon
        description="اطلاعات کارمند را در فرم زیر وارد کنید"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="نام"
            placeholder="نام کارمند را وارد کنید"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={errors.firstName}
          />

          <Input
            label="نام خانوادگی"
            placeholder="نام خانوادگی کارمند"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={errors.lastName}
          />

          <Input
            label="شماره تماس"
            type="text"
            placeholder="مثلاً 0700200200"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            error={errors.phoneNumber}
          />

          <Input
            label="ایمیل"
            type="email"
            placeholder="example@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <PasswordInput
            label="رمز عبور"
            value={password}
            onChange={setPassword}
            animated={false}
            error={errors.password}
            placeholder="رمز عبور را وارد کنید"
          />

          <PasswordInput
            label="تکرار رمز عبور"
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={errors.confirmPassword}
            animated={false}
            placeholder="رمز عبور را دوباره وارد کنید"
          />

          <div className="md:col-span-2">
            <Input
              label="آدرس"
              placeholder="آدرس دقیق کارمند را وارد کنید"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              error={errors.address}
            />
          </div>

          <div className="md:col-span-2 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">وضعیت حساب</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {isActive ? "فعال" : "غیرفعال"}
                </p>
              </div>
              <Switch size="md" checked={isActive} onChange={setIsActive} />
            </div>
          </div>
        </div>

        <Textarea
          label="توضیحات"
          value={description}
          onChange={setDescription}
          placeholder="توضیحات در مورد کارمند"
          rows={4}
        />

        <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
          <CancelButton onClick={handleCancel}>انصراف</CancelButton>
          <SaveButton type="submit" loading={isPending}>
            ایجاد کارمند
          </SaveButton>
        </div>
      </form>
    </div>
  );
}
