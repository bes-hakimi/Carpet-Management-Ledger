"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useApiGet, useApiDeleteDynamic } from "@/hooks/useApi";
import { USERS } from "@/endpoints/users";
import { PageHeader } from "@/components/ui/PageHeader";
import { EditButton, DeleteButton } from "@/components/ui/Button";
import { CompanyGeneralInfoTab } from "./components/CompanyGeneralInfoTab";
import { BranchesTab } from "./components/BranchesTab";
import { StaffTab } from "./components/StaffTab";
import { CompanyStatsTab } from "./components/CompanyStatsTab";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { SkeletonLoader } from "@/components/loading/SkeletonLoader";

// اضافه کردن toast
import toast, { Toaster } from "react-hot-toast";
import { ContentLoader } from "@/components/loading/DataLoading";

export default function CompanyDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = Number(params.id);

  const { data, isLoading, error } = useApiGet<any>(`user-${companyId}`, USERS.details(companyId));
  const deleteCompanyMutation = useApiDeleteDynamic();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "branches" | "staff" | "stats">("general");


  const handleEdit = () => router.push(`/company/${companyId}/edit`);

  const handleDeleteConfirm = async () => {
    if (!data) return;
    deleteCompanyMutation.mutate(USERS.delete(companyId), {
      onSuccess: () => {
        setIsDeleteOpen(false);
        toast.success("شرکت با موفقیت حذف شد!"); // پیام موفقیت
        router.push("/company/list");
      },
      onError: (err: any) => {
        console.error(err);
        toast.error("حذف با خطا مواجه شد!"); // پیام خطا
      },
    });
  };

  const handleDownload = (fileType: "logo" | "contract") => {
    if (!data) return;
    const url = fileType === "logo" ? data.company_logo : data.contract;
    window.open(url, "_blank");
  };

  if (isLoading) return <div className="flex w-full h-full items-center justify-center"> <ContentLoader/> </div>;
  if (error || !data) return <div>شرکت یافت نشد یا خطا در دریافت اطلاعات</div>;

  return (
    <div className="w-full">
      {/* Toaster برای نمایش پیام‌ها */}
      <Toaster position="top-right" />

      <PageHeader title="جزئیات شرکت" showHomeIcon description="مشاهده کامل اطلاعات شرکت" />

      <div className="flex justify-end gap-3 mb-6">
        <DeleteButton size="md" onClick={() => setIsDeleteOpen(true)}>حذف شرکت</DeleteButton>
        <EditButton size="md" onClick={handleEdit}>ویرایش شرکت</EditButton>
      </div>

      {/* تب‌ها */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button
            className={`py-2 px-4 text-sm font-medium ${activeTab === "general" ? "border-b-2 border-teal-600 text-teal-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("general")}
          >
            اطلاعات کلی
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${activeTab === "branches" ? "border-b-2 border-teal-600 text-teal-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("branches")}
          >
            شعبات
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${activeTab === "staff" ? "border-b-2 border-teal-600 text-teal-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("staff")}
          >
            کارمندان
          </button>

          <button
            className={`py-2 px-4 text-sm font-medium ${activeTab === "stats" ? "border-b-2 border-teal-600 text-teal-600" : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setActiveTab("stats")}
          >
            آمار
          </button>

        </nav>
      </div>

      {/* محتوای تب فعال */}
      <div>
        {activeTab === "general" && (
          <CompanyGeneralInfoTab
            data={data}
            onDownload={handleDownload}
            isDeleting={deleteCompanyMutation.status === "pending"}
          />
        )}
        {activeTab === "branches" && <BranchesTab />}
        {activeTab === "staff" && <StaffTab />}
        {activeTab === "stats" && <CompanyStatsTab data={data} />}

      </div>

      {/* مدال حذف */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={`${data?.first_name} ${data?.last_name}`}
        isLoading={deleteCompanyMutation.status === "pending"}
      />
    </div>
  );
}
