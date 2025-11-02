// src/app/create-user/page.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { FileUpload } from "@/components/ui/FileUpload";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { SaveButton, CancelButton } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Switch } from "@/components/ui/Switch";
import { useRouter } from "next/navigation";

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

const warrantyPeriods = [
  { value: "no-warranty", label: "بدون ضمانت" },
  { value: "3months", label: "۳ ماه" },
  { value: "6months", label: "۶ ماه" },
  { value: "1year", label: "۱ سال" },
  { value: "2years", label: "۲ سال" },
  { value: "3years", label: "۳ سال" },
  { value: "4years", label: "۴ سال" },
  { value: "5years", label: "۵ سال" },
];


export default function CreateUserPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [warranty, setWarranty] = useState<string>("no-warranty");
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [passwordError, setPasswordError] = useState("");

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError("رمز عبور و تکرار آن مطابقت ندارند");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("رمز عبور باید حداقل ۶ کاراکتر باشد");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    const formData = {
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      address,
      warranty,
      companyName,
      companyLogo,
      contractFile,
      category,
      duration,
      description,
      isActive,
    };
    console.log(formData);
    alert("کاربر با موفقیت ایجاد شد!");
    router.push("/users");
  };

  const handleCancel = () => {
    if (confirm("آیا از انصراف مطمئن هستید؟ اطلاعات ذخیره نخواهند شد.")) {
      router.back();
    }
  };

  return (
    <div className="w-full">
      <PageHeader
        title="ایجاد کاربر"
        showHomeIcon={true}
        description="اطلاعات جدید کاربر را در فرم زیر وارد کنید"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* اطلاعات شخصی */}
          <Input
            label="نام"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="نام"
            required
          />

          <Input
            label="نام خانوادگی"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="نام خانوادگی"
            required
          />

          <Input
            label="شماره تماس"
            type="number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="شماره تماس"
            required
          />

          <Input
            label="ایمیل (اختیاری)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ایمیل"
          />

          {/* فیلدهای رمز عبور */}
          <Input
            label="رمز عبور"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز عبور"
            required
            onBlur={validatePassword}
          />

          <Input
            label="تکرار رمز عبور"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="تکرار رمز عبور"
            required
            onBlur={validatePassword}
            error={passwordError}
          />

          {/* اطلاعات شرکت */}
          <Input
            label="نام شرکت"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="نام شرکت"
            required
          />

          <div>
            <label className="block text-sm font-medium mb-2">مدت ضمانت جنس</label>
            <Select
              options={warrantyPeriods}
              value={warranty}
              onChange={setWarranty}
              placeholder="مدت ضمانت را انتخاب کنید"
            />
          </div>

          {/* فیلد آدرس */}
          <div className="md:col-span-2">
            <Input
              label="آدرس"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="آدرس کامل"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">لگوی شرکت</label>
            <ImageUpload
              onImageSelect={setCompanyLogo}
              label="لگوی شرکت را انتخاب کنید"
              maxSize={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">فایل قرارداد</label>
            <FileUpload
              onFileSelect={setContractFile}
              accept=".pdf,.doc,.docx"
              label="فایل قرارداد را انتخاب کنید"
              maxSize={10}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">کتگوری</label>
            <Select
              options={categories}
              value={category}
              onChange={setCategory}
              placeholder="انتخاب کتگوری"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">مدت فعال بودن</label>
            <Select
              options={durations}
              value={duration}
              onChange={setDuration}
              placeholder="مدت فعال بودن فروشگاه"
            />
          </div>

          {/* وضعیت فعال/غیرفعال */}
          <div className="md:col-span-2">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">وضعیت حساب کاربری</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {isActive
                      ? "حساب کاربری فعال است و می‌تواند از سیستم استفاده کند"
                      : "حساب کاربری غیرفعال است و دسترسی ندارد"
                    }
                  </p>
                </div>
                <Switch
                  size="md"
                  checked={isActive}
                  onChange={setIsActive}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">توضیحات</label>
          <Textarea
            value={description}
            onChange={setDescription}
            placeholder="توضیحات کاربر"
            rows={4}
          />
        </div>

        {/* دکمه‌های اقدام */}
        <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
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
            ایجاد کاربر
          </SaveButton>
        </div>
      </form>
    </div>
  );
}