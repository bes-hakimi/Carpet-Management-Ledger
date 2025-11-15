"use client";

import { IUser } from "@/types/user/user";
import { Input } from "@/components/ui/Input";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { PrimaryButton, CancelButton } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { Select } from "@/components/ui/Select";
import { warrantyPeriods } from "@/app/company/constants/userOptions";

interface ProfileEditProps {
    profile: IUser;
    onInputChange: (field: keyof IUser, value: IUser[keyof IUser]) => void;
    onSave: () => void;
    onCancel: () => void;
    isSaving: boolean;
}

export default function ProfileEdit({
    profile,
    onInputChange,
    onSave,
    onCancel,
    isSaving,
}: ProfileEditProps) {
    const { userData } = useAuth();
    const userRoll = userData?.user?.role ?? null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">

            {/* آپلود لوگوی شرکت (فقط admin و branch) */}
            {(userRoll === "admin") && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">لوگوی شرکت</h3>
                    <ImageUpload
                        defaultImageUrl={profile.company_logo ?? ""}
                        onImageSelect={(url) => onInputChange("company_logo", url)}
                        label="لوگو شرکت"
                        maxSize={5}
                    />
                </div>
            )}

            {/* اطلاعات شخصی */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="نام"
                    value={profile.first_name ?? ""}
                    onChange={(e) => onInputChange("first_name", e.target.value)}
                    placeholder="نام را وارد کنید"
                />

                {userRoll !== "branch" && (
                    <Input
                        label="نام خانوادگی"
                        value={profile.last_name ?? ""}
                        onChange={(e) => onInputChange("last_name", e.target.value)}
                        placeholder="نام خانوادگی مدیر شرکت"
                    />
                )}
                <Input
                    label="شماره تماس"
                    value={profile.phone ?? ""}
                    onChange={(e) => onInputChange("phone", e.target.value)}
                    placeholder="شماره تماس با فرمت افغانستان"
                />

                <Input
                    label="ایمیل"
                    type="email"
                    value={profile.email ?? ""}
                    onChange={(e) => onInputChange("email", e.target.value)}
                    placeholder="example@company.com"
                />



                {userRoll === "admin" && (
                    <>
                        <Input
                            label="نام شرکت"
                            value={profile.company_name ?? ""}
                            onChange={(e) => onInputChange("company_name", e.target.value)}
                            placeholder="مثلاً: شرکت سپهر تجارت"
                        />
                        <Select
                            label="مدت ضمانت"
                            options={warrantyPeriods}
                            value={profile.warranty ?? ""}
                            onChange={(value) => onInputChange("warranty", value)}
                            placeholder="مدت ضمانت اجناس"
                        />


                    </>
                )}

                {userRoll === "branch" && (
                    <>
                        <Input
                            label="نام شعبه"
                            value={profile.branch_name ?? ""}
                            onChange={(e) => onInputChange("branch_name", e.target.value)}
                            placeholder="نام شعبه"
                        />
                    </>
                )}

                <Input
                    label="آدرس"
                    value={profile.address ?? ""}
                    onChange={(e) => onInputChange("address", e.target.value)}
                    placeholder="آدرس دقیق شرکت"
                />

            </div>

            {/* دکمه‌ها */}
            <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
                <CancelButton onClick={onCancel}>انصراف</CancelButton>
                <PrimaryButton type="submit" loading={isSaving} loadingText="در حال ذخیره...">
                    ذخیره تغییرات
                </PrimaryButton>
            </div>
        </form>
    );
}
