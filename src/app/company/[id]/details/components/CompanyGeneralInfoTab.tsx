// components/user/tabs/CompanyGeneralInfoTab.tsx
"use client";

import { User, Phone, Building, Folder, Clock, Calendar, FileText, Download, Circle, RefreshCw, Mail } from "lucide-react";
import Image from "next/image";
import { IUser } from "@/types/user/user";

interface Props {
    data: IUser;
    onDownload?: (fileType: "logo" | "contract") => void;
    isDeleting?: boolean;
}

export function CompanyGeneralInfoTab({ data, onDownload }: Props) {

    console.log("details data", data)
    const InfoCard = ({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) => (
        <div className={`bg-gray-50 rounded-lg p-4 border border-gray-200 ${className}`}>
            <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
            <div className="text-gray-900">{children}</div>
        </div>
    );

    const StatusBadge = ({ isActive }: { isActive?: boolean }) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            <Circle className={`w-2 h-2 ml-2 fill-current ${isActive ? "text-green-500" : "text-red-500"}`} />
            {isActive ? "فعال" : "غیرفعال"}
        </span>
    );


    return (
        <div className="space-y-6">
            {/* اطلاعات شخصی */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base md:text-xl font-semibold text-gray-900">اطلاعات شخصی</h3>
                    <StatusBadge isActive={data.status} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InfoCard title="نام">
                        <div className="flex items-center">
                            <User className="ml-2 w-4 h-4 text-gray-500" />
                            {data.first_name} {data.last_name}
                        </div>
                    </InfoCard>

                    <InfoCard title="شماره تماس">
                        <div className="flex items-center">
                            <Phone className="ml-2 w-4 h-4 text-gray-500" />
                            {data.phone}
                        </div>
                    </InfoCard>

                    <InfoCard title="نام شرکت">
                        <div className="flex items-center">
                            <Building className="ml-2 w-4 h-4 text-gray-500" />
                            {data.company_name}
                        </div>
                    </InfoCard>

                    <InfoCard title="کتگوری">
                        <div className="flex items-center">
                            <Folder className="ml-2 w-4 h-4 text-gray-500" />
                            {data.category}
                        </div>
                    </InfoCard>

                    <InfoCard title="مدت فعال بودن">
                        <div className="flex items-center">
                            <Clock className="ml-2 w-4 h-4 text-gray-500" />
                            {data.time_of_active ? `فعال برای ${data.time_of_active}` : "-"}
                        </div>
                    </InfoCard>

                    <InfoCard title="ایمیل">
                        <div className="flex items-center">
                            <Mail className="ml-2 w-4 h-4 text-gray-500" />
                            {data.email ? data.email : "نامشخص"}
                        </div>
                    </InfoCard>

                    {/* ✅ مدت ضمانت جنس */}
                    <InfoCard title="مدت ضمانت جنس">
                        <div className="flex items-center">
                            <Clock className="ml-2 w-4 h-4 text-gray-500" />
                            {data.warranty || "ثبت نشده"}
                        </div>
                    </InfoCard>

                    {/* ✅ آدرس شرکت */}
                    <InfoCard title="آدرس شرکت">
                        <div className="flex items-start">
                            <Building className="ml-2 w-4 h-4 text-gray-500 mt-0.5" />
                            <span className="text-gray-800 leading-snug">
                                {data.address || "آدرس ثبت نشده است."}
                            </span>
                        </div>
                    </InfoCard>
                </div>
            </div>


            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mt-4 md:mt-8">
                <h3 className="text-base md:text-xl font-semibold text-gray-900 mb-6">فایل‌ها و مدارک</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* لوگوی شرکت */}
                    <InfoCard title="لگوی شرکت">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {data.company_logo ? (
                                    <Image
                                        src={data.company_logo}
                                        alt="Company Logo"
                                        width={64}
                                        height={64}
                                        className="rounded-md border object-cover"
                                    />
                                ) : (
                                    <span className="text-sm text-gray-400">بدون تصویر</span>
                                )}
                            </div>
                            {data.company_logo && (
                                <button
                                    onClick={() => onDownload?.("logo")}
                                    className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                                >
                                    <Download className="w-4 h-4 ml-1" /> دانلود
                                </button>
                            )}
                        </div>
                    </InfoCard>

                    {/* قرارداد */}
                    <InfoCard title="قرارداد">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {data.contract ? (
                                    (() => {
                                        const ext = data.contract.split(".").pop()?.toLowerCase();
                                        const isImage = ["jpg", "jpeg", "png", "webp"].includes(ext || "");

                                        if (isImage) {
                                            return (
                                                <Image
                                                    src={data.contract}
                                                    alt="Contract File"
                                                    width={64}
                                                    height={64}
                                                    className="rounded-md border object-cover"
                                                />
                                            );
                                        } else {
                                            const fileType =
                                                ext === "pdf" ? "فایل PDF" :
                                                    ext === "doc" || ext === "docx" ? "فایل Word" :
                                                        "فایل ضمیمه";

                                            return (
                                                <div className="flex items-center gap-2 text-gray-600 h-12">
                                                    <FileText className="w-6 h-6 text-gray-500" />
                                                    <span className="text-sm">{fileType}</span>
                                                </div>
                                            );
                                        }
                                    })()
                                ) : (
                                    <span className="text-sm text-gray-400">بدون فایل</span>
                                )}
                            </div>
                            {data.contract && (
                                <button
                                    onClick={() => onDownload?.("contract")}
                                    className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                                >
                                    <Download className="w-4 h-4 ml-1" /> دانلود
                                </button>
                            )}
                        </div>
                    </InfoCard>
                </div>
            </div>


            {/* توضیحات */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
                <h3 className="text-base md:text-xl font-semibold text-gray-900 mb-4">توضیحات</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{data.description || "توضیحاتی ثبت نشده است."}</p>
                </div>
            </div>

            {/* تاریخ‌ها */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
                <h3 className="text-base md:text-xl font-semibold text-gray-900 mb-6">تاریخ‌ها</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoCard title="تاریخ ایجاد">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Calendar className="ml-2 w-4 h-4 text-gray-500" />
                                {data.date_joined ? new Date(data.date_joined).toLocaleDateString("fa-IR") : "نامشخص"}
                            </div>
                            <span className="text-xs text-gray-500">
                                {data.date_joined ? new Date(data.date_joined).toLocaleTimeString("fa-IR") : ""}
                            </span>
                        </div>
                    </InfoCard>

                    <InfoCard title="آخرین بروزرسانی">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <RefreshCw className="ml-2 w-4 h-4 text-gray-500" />
                                {data.updated_at ? new Date(data.updated_at).toLocaleDateString("fa-IR") : "بروزرسانی صورت نگرفته"}
                            </div>
                            <span className="text-xs text-gray-500">
                                {data.updated_at ? new Date(data.updated_at).toLocaleTimeString("fa-IR") : ""}
                            </span>
                        </div>
                    </InfoCard>
                </div>
            </div>
        </div>
    );
}
