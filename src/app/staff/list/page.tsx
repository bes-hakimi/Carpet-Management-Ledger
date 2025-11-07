"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { PageHeader } from "@/components/ui/PageHeader";
import { StaffTable } from "../components/StaffTable";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";

import { useApiGet, useApiDeleteDynamic } from "@/hooks/useApi";
import { USERS } from "@/endpoints/users";
import { ApiError } from "@/types/api/api";

// ✅ تایپ جدول شرکت‌ها
interface Company {
  id: string;
  name: string;
  category: string;
  owner: string;
  status: "active" | "inactive";
  createdAt: string;
}

// ✅ تایپ داده‌ی خام API
interface ApiCompany {
  id: number;
  company_name: string;
  category: string;
  first_name: string;
  last_name: string;
  status: boolean;
  date_joined: string;
}

export default function CompaniesListPage() {
  const router = useRouter();

  // ✅ وضعیت modal و شرکت انتخاب‌شده
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ گرفتن شرکت‌ها از API
  const { data: apiCompanies = [], isLoading, error, refetch } = useApiGet<ApiCompany[]>(
    "companies",
    USERS.getStaffList
  );

  // ✅ حذف داینامیک
  const deleteCompanyMutation = useApiDeleteDynamic<void>();



  // ✅ تبدیل داده API به تایپ Company
  const companies: Company[] = apiCompanies.map(item => ({
    id: item.id.toString(),
    name: item.company_name,
    category: item.category,
    owner: `${item.first_name} ${item.last_name}`,
    status: item.status ? "active" : "inactive",
    createdAt: item.date_joined,
  }));

  // ===========================
  // دستورات view, edit, delete
  // ===========================

  const handleView = (company: Company) => router.push(`/company/${company.id}/details`);
  const handleEdit = (company: Company) => router.push(`/company/${company.id}/edit`);

  // باز کردن modal
  const handleDeleteClick = (company: Company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  // تایید حذف
  const handleConfirmDelete = () => {
    if (!selectedCompany) return;

    deleteCompanyMutation.mutate(USERS.delete(Number(selectedCompany.id)), {
      onSuccess: () => {
        toast.success("شرکت با موفقیت حذف شد");
        setIsModalOpen(false);
        setSelectedCompany(null);
        refetch();
      },
      onError: (error: ApiError) => {
        console.error(error);
        toast.error(error.message || "حذف شرکت با مشکل مواجه شد");
      },
    });
  };

  // بستن modal
  const handleCloseModal = () => {
    if (deleteCompanyMutation.status !== 'pending') {
      setIsModalOpen(false);
      setSelectedCompany(null);
    }
  };



  // ===========================
  // رندر صفحه
  // ===========================

  if (isLoading) return <p>در حال بارگذاری...</p>;
  if (error) return <p>خطا در دریافت داده‌ها: {error.message}</p>;

  return (
    <div className="w-full">
      <PageHeader
        title="مدیریت شرکت‌ها"
        description="لیست تمام شرکت‌های ثبت شده در سیستم"
        showHomeIcon
      />

      <StaffTable
        companies={companies}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        itemName={selectedCompany?.name}
        confirmText="حذف"
        cancelText="لغو"
        isLoading={deleteCompanyMutation.status === 'pending'}
        type="danger"
      />


    </div>
  );
}
