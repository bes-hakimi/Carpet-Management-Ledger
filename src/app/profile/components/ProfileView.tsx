"use client";

import { useState } from "react";
import Image from "next/image";
import { IUser } from "@/types/user/user";
import {
    User,
    Building,
    Phone,
    Mail,
    MapPin,
    AlertCircle,
    Award,
    Eye,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ProfileViewProps {
    profile: IUser;
}

export default function ProfileView({ profile }: ProfileViewProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { userData } = useAuth();
    const userRoll = userData?.user?.role ?? null;

    return (
        <div className="space-y-4">


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard icon={<User size={20} />} label="نام" value={profile.first_name} />
                {userRoll !== "branch" && (
                    <InfoCard icon={<User size={20} />} label="نام خانوادگی" value={profile.last_name} />
                )}
                <>
                    <InfoCard
                        icon={<Phone size={20} />} label="شماره تماس" value={profile.phone ?? "-"} />
                    <InfoCard icon={<Mail size={20} />} label="ایمیل" value={profile.email ?? "-"} />
                </>

                {/* ---------- نام شرکت فقط برای admin ---------- */}
                {userRoll === "admin" && profile.company_name && (
                    <InfoCard icon={<Building size={20} />} label="نام شرکت" value={profile.company_name} />
                )}

                {/* ---------- نام شعبه فقط برای branch ---------- */}
                {userRoll === "branch" && profile.branch_name && (
                    <InfoCard icon={<Building size={20} />} label="نام شعبه" value={profile.branch_name} />
                )}

                {/* ---------- مدت ضمانت اجناس فقط برای admin ---------- */}
                {userRoll === "admin" && profile.warranty && (
                    <InfoCard icon={<Award size={20} />} label="مدت ضمانت اجناس" value={profile.warranty} />
                )}
                <InfoCard icon={<MapPin size={20} />} label="آدرس" value={profile.address ?? "-"} />
            </div>
            {/* ---------- لوگوی شرکت برای admin و branch ---------- */}
            {profile.company_logo && (
                <div className="flex flex-col space-y-2">
                    <span className="text-gray-500 text-sm font-medium">لوگوی شرکت</span>
                    <div className="relative group w-32 h-24 cursor-pointer">
                        <Image
                            src={profile.company_logo}
                            alt={profile.company_name ?? "Company Logo"}
                            className="rounded-md border border-gray-200 transition-transform duration-200 group-hover:scale-105"
                            fill
                            sizes="96px"
                            style={{ objectFit: "cover" }}
                            onClick={() => setIsModalOpen(true)}
                        />
                        <div
                            className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Eye className="text-white" size={24} />
                        </div>
                    </div>
                </div>
            )}

            {/* ---------- مدال نمایش بزرگ لوگو ---------- */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div className="relative w-[80vw] max-w-[400px] h-auto rounded-md p-4 bg-white">
                        <Image
                            src={profile.company_logo!}
                            alt={profile.company_name ?? "Company Logo"}
                            className="rounded-lg"
                            width={800}
                            height={800}
                            style={{ objectFit: "contain" }}
                        />
                    </div>
                </div>
            )}

            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <InfoCard
                    icon={<AlertCircle size={20} />}
                    label="وضعیت حساب"
                    value={profile.is_active ? "فعال" : `غیرفعال: ${profile.reson_of_status ?? "-"}`}
                    fullWidth
                    status={profile.is_active ? "active" : "inactive"}
                />
            </div>
        </div>
    );
}

// ---------- کامپوننت InfoCard ----------
interface InfoCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    fullWidth?: boolean;
    status?: "active" | "inactive";
}

function InfoCard({ label, value, icon, fullWidth = false, status }: InfoCardProps) {
    const statusClasses = status === "active"
        ? "text-primary-700 bg-primary-100"
        : status === "inactive"
            ? "text-red-700 bg-red-100"
            : "";

    return (
        <div className={`flex items-center gap-4 p-4 rounded-lg border border-gray-200 bg-white ${fullWidth ? "col-span-2" : ""} ${statusClasses}`}>
            <div className="p-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-md">{icon}</div>
            <div className="flex flex-col">
                <span className="text-gray-500 text-sm">{label}</span>
                <span className="font-medium text-gray-900">{value}</span>
            </div>
        </div>
    );
}
