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
import toast, { Toaster } from "react-hot-toast";
import { useApiPost } from "@/hooks/useApi";
import { USERS } from "@/endpoints/users";
import { categories, durations, warrantyPeriods } from "../constants/userOptions";

export default function CreateUserPage() {
  const router = useRouter();

  const { mutate: createUser, isPending } = useApiPost(USERS.create);

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
    if (!validatePassword()) return;

    const payload = {
      email: email,
      first_name: firstName,
      last_name: lastName,
      password: password,
      role: "admin",
      phone: Number(phoneNumber),
      category: category,
      company_name: companyName,
      company_logo: companyLogo || "",
      contract: contractFileUrl || "",
      time_of_active: duration,
      status: isActive,
      reson_of_status: warranty,
      address,
      description,
    };
    createUser(payload, {
      onSuccess: () => {
        toast.success(`شرکت ${companyName} با موفقیت ایجاد شد`);
        router.push("/company/list");
      },
      onError: (error: any) => {
        console.log("Error creating user:", error);
        toast.error(
          error?.response?.data?.message ||
          "مشکلی در ارسال اطلاعات به سرور رخ داد"
        );
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
      <Toaster position="top-right" reverseOrder={false} />

      <PageHeader
        title="ایجاد شرکت"
        showHomeIcon
        description="اطلاعات شرکت را در فرم زیر وارد کنید"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="نام" placeholder="نام" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <Input label="نام خانوادگی" placeholder="نام خانوادگی" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          <Input label="شماره تماس" placeholder="شماره تماس" type="number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
          <Input label="ایمیل" placeholder="ایمل" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="رمز عبور" placeholder="رمز عبور" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onBlur={validatePassword} required />
          <Input label="تکرار رمز عبور" placeholder="تکرار رمز عبور" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onBlur={validatePassword} error={passwordError} required />
          <Input label="نام شرکت" placeholder="نام شرکت" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
          <Select label="مدت ضمانت اجناس" placeholder="مدت ضمانت را انتخاب کنید" options={warrantyPeriods} value={warranty} onChange={setWarranty} />

          <div className="md:col-span-2">
            <Input label="آدرس" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">لوگو شرکت</label>
            <ImageUpload onImageSelect={setCompanyLogo} label="انتخاب لوگو" maxSize={2} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">فایل قرارداد</label>
            <FileUpload onFileSelect={setContractFileUrl} accept=".pdf,.doc,.docx" label="انتخاب فایل قرارداد" maxSize={10} />
          </div>

          <Select label="کتگوری" placeholder="انتخاب کتگوری" options={categories} value={category} onChange={setCategory} />
          <Select label="مدت فعال بودن" placeholder="مدت فعال بودن شرکت" options={durations} value={duration} onChange={setDuration} />

          <div className="md:col-span-2 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">وضعیت حساب شرکت</h4>
                <p className="text-sm text-gray-600 mt-1">{isActive ? "حساب شرکت فعال است و می‌تواند از سیستم استفاده کند" : "حساب شرکت غیرفعال است و دسترسی ندارد"}</p>
              </div>
              <Switch size="md" checked={isActive} onChange={setIsActive} />
            </div>
          </div>
        </div>

        <Textarea value={description} onChange={setDescription} placeholder="توضیحات شرکت" rows={4} />

        <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
          <CancelButton onClick={handleCancel}>انصراف</CancelButton>
          <SaveButton type="submit" disabled={isPending}>
            {isPending ? "در حال ارسال..." : "ایجاد شرکت"}
          </SaveButton>
        </div>
      </form>
    </div>
  );
}
