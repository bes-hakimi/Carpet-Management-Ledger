"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { SaveButton, CancelButton } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Switch } from "@/components/ui/Switch";
import { useRouter } from "next/navigation";

export default function CreateBranchPage() {
  const router = useRouter();
  const [branchName, setBranchName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      branchName,
      managerName,
      phoneNumber,
      email,
      address,
      isActive,
      description,
    };

    console.log(formData);
    alert("شعبه با موفقیت ایجاد شد!");
    router.push("/branch/list"); // پس از ایجاد به لیست شعبات برود
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
          {/* نام شعبه */}
          <Input
            label="نام شعبه"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            placeholder="نام شعبه"
            required
          />

          {/* مدیر شعبه */}
          <Input
            label="مدیر شعبه"
            value={managerName}
            onChange={(e) => setManagerName(e.target.value)}
            placeholder="نام مدیر شعبه"
            required
          />

          {/* شماره تماس */}
          <Input
            label="شماره تماس"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="شماره تماس"
            required
            dir="rtl"
          />

          {/* ایمیل */}
          <Input
            label="ایمیل"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ایمیل"
          />

          {/* آدرس */}
          <div className="md:col-span-2">
            <Input
              label="آدرس"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="آدرس کامل شعبه"
              required
            />
          </div>

          {/* وضعیت فعال/غیرفعال */}
          <div className="md:col-span-2">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">وضعیت شعبه</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {isActive
                      ? "شعبه فعال است و در سیستم نمایش داده می‌شود"
                      : "شعبه غیرفعال است و دسترسی ندارد"}
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

        {/* توضیحات */}
        <div>
          <label className="block text-sm font-medium mb-2">توضیحات</label>
          <Textarea
            value={description}
            onChange={setDescription}
            placeholder="توضیحات شعبه"
            rows={4}
          />
        </div>

        {/* دکمه‌ها */}
        <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
          <CancelButton size="md" onClick={handleCancel}>
            انصراف
          </CancelButton>
          <SaveButton size="md" type="submit">
            ایجاد شعبه
          </SaveButton>
        </div>
      </form>
    </div>
  );
}
