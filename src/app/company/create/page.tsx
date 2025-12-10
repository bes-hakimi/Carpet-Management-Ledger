"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { FileUpload } from "@/components/ui/FileUpload";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { SaveButton, CancelButton } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Switch } from "@/components/ui/Switch";
import toast from "react-hot-toast";
import { useApiPost } from "@/hooks/useApi";
import { USERS } from "@/endpoints/users";
import { categories, durations, warrantyPeriods } from "../constants/userOptions";
import PasswordInput from "@/components/ui/PasswordInput";
import { ApiError } from "@/types/api/api";

export default function CreateCompanyPage() {
  const router = useRouter();
  const { mutate: createCompany, isPending } = useApiPost(USERS.create);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [warranty, setWarranty] = useState<string>("بدون ضمانت");
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [contractFileUrl, setContractFileUrl] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ اعتبارسنجی فرم
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = "نام الزامی است";
    if (!lastName.trim()) newErrors.lastName = "نام خانوادگی الزامی است";
    if (!companyName.trim()) newErrors.companyName = "نام شرکت الزامی است";

    const phoneLocalRegex = /^07\d{8}$/;      // مثال: 0700123456
    const phoneIntlRegex = /^\+937\d{8}$/;   // مثال: +93700123456
    if (!phoneLocalRegex.test(phoneNumber) && !phoneIntlRegex.test(phoneNumber)) {
      newErrors.phoneNumber = "لطفاً شماره تماس با فرمت افغانستان وارد کنید";
    }

    if (!email.trim()) newErrors.email = "ایمیل الزامی است";
    if (!password.trim()) newErrors.password = "رمز عبور الزامی است";
    if (!confirmPassword.trim()) newErrors.confirmPassword = "تکرار رمز عبور الزامی است";
    if (!address.trim()) newErrors.address = "آدرس الزامی است";
    if (!category.trim()) newErrors.category = "کتگوری الزامی است";
    if (!duration.trim()) newErrors.duration = "مدت فعال بودن الزامی است";

    // لوگو و قرارداد نباید خالی باشند
    if (!companyLogo) newErrors.companyLogo = "لوگو شرکت الزامی است";
    if (!contractFileUrl) newErrors.contract = "فایل قرارداد الزامی است";

    if (password && confirmPassword && password !== confirmPassword)
      newErrors.confirmPassword = "رمز عبور و تکرار آن مطابقت ندارند";
    if (password && password.length < 6)
      newErrors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ ارسال فرم
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // پاک‌سازی خطاهای قدیمی

    if (!validateForm()) return;

    const payload = {
      email,
      first_name: firstName,
      last_name: lastName,
      password,
      role: "admin",
      phone: phoneNumber,
      category,
      company_name: companyName,
      company_logo: companyLogo || "",
      contract: contractFileUrl || "",
      time_of_active: duration,
      status: isActive,
      warranty: warranty,
      address,
      description,
    };

    console.log("Submitting payload:", payload);

    createCompany(payload, {
      onSuccess: () => {
        toast.success(`شرکت ${companyName} با موفقیت ایجاد شد`);
        router.push("/company/list");
      },
      onError: (error: ApiError) => {
        console.error("API Error:", error);

        // بررسی می‌کنیم که پیام خطا از response.data یا خود شیء خطا باشد
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
      <PageHeader title="ایجاد شرکت" showHomeIcon description="اطلاعات شرکت را در فرم زیر وارد کنید" />

      <form onSubmit={handleSubmit} className="space-y-6 border border-gray-300 rounded-md p-4 md:p-6">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="نام"
            placeholder="نام مدیر شرکت را وارد کنید"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={errors.firstName}
          />

          <Input
            label="نام خانوادگی"
            placeholder="نام خانوادگی مدیر شرکت"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={errors.lastName}
          />

          <Input
            label="شماره تماس"
            type="text"
            placeholder="شماره تماس با فرمت افغانستان"
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
            error={errors.password}
            animated={false}
            placeholder="رمز عبور خود را وارد کنید"
          />

          <PasswordInput
            label="تکرار رمز عبور"
            value={confirmPassword}
            onChange={setConfirmPassword}
            animated={false}
            error={errors.confirmPassword}
            placeholder="رمز عبور را دوباره وارد کنید"
          />

          <Input
            label="نام شرکت"
            placeholder="مثلاً: شرکت سپهر تجارت"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            error={errors.companyName}
          />

          <div className="col-span-1 md:col-span-2">
            <Input
              label="آدرس"
              placeholder="آدرس دقیق شرکت را وارد کنید"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              error={errors.address}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">لوگو شرکت</label>
            <ImageUpload
              onImageSelect={setCompanyLogo}
              label="انتخاب لوگو"
              maxSize={2}
              error={errors.companyLogo} // ارسال خطا به خود کامپوننت
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">فایل قرارداد</label>
            <FileUpload
              onFileSelect={setContractFileUrl}
              accept=".pdf,.doc,.docx"
              label="انتخاب فایل قرارداد"
              maxSize={10}
              error={errors.contract} // ارسال خطا به خود کامپوننت
            />
          </div>

          <div className="md:col-span-2 rounded-xl border border-gray-200 p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-6">تنظیمات فروشگاه</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


              <Select
                label="کتگوری"
                options={categories}
                value={category}
                onChange={setCategory}
                placeholder="انتخاب نوع فعالیت شرکت"
                error={errors.category}
              />

              <Select
                label="مدت فعال بودن"
                options={durations}
                value={duration}
                onChange={setDuration}
                placeholder="انتخاب مدت فعال بودن حساب"
                error={errors.duration}
              />

              <Select
                label="مدت ضمانت اجناس"
                options={warrantyPeriods}
                value={warranty}
                onChange={setWarranty}
                placeholder="انتخاب مدت ضمانت"
              />
            </div>
          </div>

          <div className="md:col-span-2 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">وضعیت حساب شرکت</h4>
                <p className="text-sm text-gray-600 mt-1">{isActive ? "حساب شرکت فعال است" : "حساب شرکت غیرفعال است"}</p>
              </div>
              <Switch size="md" checked={isActive} onChange={setIsActive} />
            </div>
          </div>
        </div>

        <Textarea
          label="توضیحات"
          value={description}
          onChange={setDescription}
          placeholder="توضیحات تکمیلی در مورد شرکت"
          rows={4}
        />

        <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
          <CancelButton type="button" onClick={handleCancel}>انصراف</CancelButton>
          <SaveButton type="submit" loading={isPending}>
            ایجاد شرکت
          </SaveButton>
        </div>
      </form>
    </div>
  );
}
