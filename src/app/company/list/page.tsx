"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { PageHeader } from "@/components/ui/PageHeader";
import { CompanyTable } from "../components/CompanyTable";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { useApiGet, useApiDeleteDynamic } from "@/hooks/useApi";
import { USERS } from "@/endpoints/users";
import { ApiError } from "@/types/api/api";
import { ContentLoader } from "@/components/loading/DataLoading";
import { EmptyData } from "@/components/empty/EmptyData";

interface Company {
  id: string;
  name: string;
  category: string;
  owner: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  createdAt: string;
}

interface ApiCompany {
  id: number;
  company_name: string;
  category: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: boolean;
  date_joined: string;
}

export default function CompaniesListPage() {
  const router = useRouter();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: apiResponse, isLoading, error, refetch } = useApiGet<
    ApiCompany[] | { message: string }
  >("companies", USERS.getCompanyList);

  const deleteCompanyMutation = useApiDeleteDynamic<void>();

  // بررسی اینکه data آرایه است یا پیام
  const apiCompanies: ApiCompany[] =
    Array.isArray(apiResponse) ? apiResponse : [];

  const emptyMessage: string | null =
    !Array.isArray(apiResponse) && typeof apiResponse?.message === "string"
      ? apiResponse.message
      : null;

  const companies: Company[] = apiCompanies.map((item) => ({
    id: item.id.toString(),
    name: item.company_name,
    category: item.category,
    owner: `${item.first_name} ${item.last_name}`,
    email: item.email,
    phone: item.phone,
    status: item.status ? "active" : "inactive",
    createdAt: item.date_joined,
  }));

  const handleView = (company: Company) => router.push(`/company/${company.id}/details`);
  const handleEdit = (company: Company) => router.push(`/company/${company.id}/edit`);
  const handleDeleteClick = (company: Company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

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

  const handleCloseModal = () => {
    if (deleteCompanyMutation.status !== "pending") {
      setIsModalOpen(false);
      setSelectedCompany(null);
    }
  };

  return (
    <div className="w-full">
      <PageHeader
        title="مدیریت شرکت‌ها"
        description="لیست تمام شرکت‌های ثبت شده در سیستم"
        showHomeIcon
      />

      {isLoading ? (
        <div className="flex w-full h-[300px] items-center justify-center">
          <ContentLoader />
        </div>
      ) : error ? (
        <p className="text-center text-red-500 mt-4">{error.message}</p>
      ) : emptyMessage ? (
        <EmptyData title={emptyMessage} />
      ) : (
        <CompanyTable
          companies={companies}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        itemName={selectedCompany?.name}
        confirmText="حذف"
        cancelText="لغو"
        isLoading={deleteCompanyMutation.status === "pending"}
        type="danger"
      />
    </div>
  );
}
