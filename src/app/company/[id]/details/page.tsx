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
import { ApiError } from "@/types/api/api";
import toast, { Toaster } from "react-hot-toast";
import { ContentLoader } from "@/components/loading/DataLoading";
import { IUser } from "@/types/user/user";

interface CompanyDetailsResponse {
  details: IUser;
  branches: IUser[];
  staffs: IUser[];
  stats: IUser;
}

export default function CompanyDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = Number(params.id);

  const { data, isLoading, error } = useApiGet<CompanyDetailsResponse>(
    `user-${companyId}`,
    USERS.details(companyId)
  );

  const deleteCompanyMutation = useApiDeleteDynamic();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "branches" | "staff" | "stats">("general");

  const handleEdit = () => router.push(`/company/${companyId}/edit`);

  const handleDeleteConfirm = async () => {
    if (!data) return;
    deleteCompanyMutation.mutate(USERS.delete(companyId), {
      onSuccess: () => {
        setIsDeleteOpen(false);
        toast.success("شرکت با موفقیت حذف شد!");
        router.push("/company/list");
      },
      onError: (error: unknown) => {
        const apiError = error as ApiError;
        console.error("Delete API Error:", apiError);

        const message =
          apiError.response?.data?.message ??
          apiError.response?.data?.detail ??
          apiError.message ??
          "حذف با خطا مواجه شد!";

        toast.error(message);
      },
    });
  };

  const handleDownload = (fileType: "logo" | "contract") => {
    if (!data) return;
    const url = fileType === "logo" ? data.details.company_logo : data.details.contract;
    if (url) window.open(url, "_blank");
  };


  return (
    <div className="w-full">
      <Toaster position="top-right" />

      {/* Page Header همیشه نمایش داده شود */}
      <PageHeader
        title="جزئیات شرکت"
        showHomeIcon
        description="مشاهده کامل اطلاعات شرکت"
      />

      {/* فقط وقتی داده‌ها لود شده و خطایی نیست دکمه‌ها نمایش داده شوند */}
      {!isLoading && !error && data && (
        <div className="flex justify-end gap-3 mb-6">
          <DeleteButton size="md" onClick={() => setIsDeleteOpen(true)}>
            حذف شرکت
          </DeleteButton>
          <EditButton size="md" onClick={handleEdit}>
            ویرایش شرکت
          </EditButton>
        </div>
      )}

      {/* محتوای اصلی */}
      {isLoading ? (
        <div className="flex w-full h-full items-center justify-center">
          <ContentLoader />
        </div>
      ) : error || !data ? (
        <div>شرکت یافت نشد یا خطا در دریافت اطلاعات</div>
      ) : (
        <>
          {/* تب‌ها */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              {["general", "branches", "staff", "stats"].map((tab) => (
                <button
                  key={tab}
                  className={`py-2 px-4 text-sm font-medium ${activeTab === tab
                      ? "border-b-2 border-primary-600 text-primary-600"
                      : "text-gray-500 hover:text-gray-700"
                    }`}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                >
                  {{
                    general: "اطلاعات کلی",
                    branches: "شعبات",
                    staff: "کارمندان",
                    stats: "آمار",
                  }[tab]}
                </button>
              ))}
            </nav>
          </div>

          {/* محتوای تب فعال */}
          <div>
            {activeTab === "general" && (
              <CompanyGeneralInfoTab
                data={data.details}
                onDownload={handleDownload}
                isDeleting={deleteCompanyMutation.status === "pending"}
              />
            )}
            {activeTab === "branches" && <BranchesTab data={data.branches} />}
            {activeTab === "staff" && <StaffTab data={data.staffs} />}
            {activeTab === "stats" && <CompanyStatsTab data={data.stats ?? {}} />}
          </div>
        </>
      )}

      {/* مدال حذف */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={`${data?.details.first_name ?? ""} ${data?.details.last_name ?? ""}`}
        isLoading={deleteCompanyMutation.status === "pending"}
      />
    </div>

  );
}
