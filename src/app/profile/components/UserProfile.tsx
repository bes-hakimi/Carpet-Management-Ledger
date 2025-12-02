"use client";

import { useState, useEffect } from "react";
import ProfileView from "./ProfileView";
import ProfileEdit from "./ProfileEdit";
import { IUser } from "@/types/user/user";
import { useApiGet, useApiPut } from "@/hooks/useApi";
import { USERS } from "@/endpoints/users";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import { EditButton } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContentLoader } from "@/components/loading/DataLoading";

interface IUserResponse {
    details: IUser;
    branches: IUser[];
    staffs: IUser[];
}

export default function UserProfile() {
    const { userData } = useAuth();
    const userId = userData?.user?.id ?? null;
    const userRoll = userData?.user?.role ?? null;

    const [isEditing, setIsEditing] = useState(false);

    // دریافت داده‌ها از API
    const { data, isLoading, error } = useApiGet<IUserResponse>(
        `user-profile-${userId}`,
        userId ? USERS.details(userId) : "",
        { enabled: !!userId }
    );

    // State فرم ویرایش
    const [formData, setFormData] = useState<IUser | null>(null);

    // همگام‌سازی details با فرم
    useEffect(() => {
        if (data?.details) {
            setFormData(data.details);
        }
    }, [data]);

    const updateMutation = useApiPut<IUser, IUser>(
        userId ? USERS.update(userId) : ""
    );

    const handleInputChange = (field: keyof IUser, value: IUser[keyof IUser]) => {
        setFormData((prev) =>
            prev ? { ...prev, [field]: value } : prev
        );
    };


    const handleSave = () => {
        if (!formData) return;
        updateMutation.mutate(formData, {
            onSuccess: () => {
                toast.success("اطلاعات با موفقیت ذخیره شد!");
                setIsEditing(false);
            },
            onError: () => {
                toast.error("ذخیره اطلاعات با خطا مواجه شد!");
            },
        });
    };

    if (!userId) {
        return (
            <div className="min-h-screen bg-gray-50">
                <PageHeader title="پروفایل کاربر" description="مشاهده و ویرایش اطلاعات پروفایل" />
                <ContentLoader />
            </div>
        );
    }

    if (isLoading || !formData) {
        return (
            <div className="min-h-screen bg-gray-50">
                <PageHeader title="پروفایل کاربر" description="مشاهده و ویرایش اطلاعات پروفایل" />
                <ContentLoader />
            </div>
        );
    }

    if (error) {
        toast.error("خطا در دریافت اطلاعات کاربر!");
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <PageHeader title="پروفایل کاربر" description="مشاهده و ویرایش اطلاعات پروفایل" />
                <p className="text-red-500 mt-6">دریافت اطلاعات با خطا مواجه شد.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <PageHeader title="پروفایل کاربر" description="مشاهده و ویرایش اطلاعات پروفایل" />

            <div className="w-full">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* هدر پروفایل */}
                    <div className="bg-gradient-to-r from-primary-400 to-primary-600 px-6 py-8 text-white flex justify-between">
                        <div className="flex items-center gap-4">

                            <div className="h-14 w-14 bg-white/20 rounded-md flex items-center justify-center">
                                <span className="text-xl font-bold">
                                    {formData.first_name?.charAt(0)}
                                    {formData.last_name?.charAt(0)}
                                </span>
                            </div>

                            <div>
                                <h1 className="text-xl font-bold">
                                    {formData.first_name} {formData.last_name}
                                </h1>
                                {userRoll === "branch" ?
                                    <p className="text-sm text-primary-100">{formData.branch_name}</p>
                                    :
                                    <p className="text-sm text-primary-100">{formData.company_name}</p>
                                }
                            </div>

                        </div>

                        <EditButton
                            onClick={() => setIsEditing((prev) => !prev)}
                            className="h-fit border border-white text-white "
                        >
                            {isEditing ? "مشاهده پروفایل" : "ویرایش پروفایل"}
                        </EditButton>
                    </div>

                    {/* نمایش یا ویرایش */}
                    <div className="p-6">
                        {isEditing ? (
                            <ProfileEdit
                                profile={formData}
                                onInputChange={handleInputChange}
                                onSave={handleSave}
                                onCancel={() => setIsEditing(false)}
                                isSaving={updateMutation.isPending}
                            />
                        ) : (
                            <ProfileView profile={formData} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
