"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { PageHeader } from "@/components/ui/PageHeader";
import { BranchTable } from "../components/BranchTable";
import { ContentLoader } from "@/components/loading/DataLoading";
import { USERS } from "@/endpoints/users";
import { ApiError } from "@/types/api/api";
import { useApiGet, useApiDeleteDynamic } from "@/hooks/useApi";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { EmptyData } from "@/components/empty/EmptyData";

interface Branch {
  id: string;
  branchName: string;
  managerName: string;
  phoneNumber: string;
  email?: string;
  address: string;
  isActive: boolean;
  description?: string;
  createdAt: string;
}

interface ApiUser {
  id: number;
  company_name: string;
  first_name: string;
  last_name: string;
  phone: number;
  email?: string;
  role: string;
  status: boolean;
  date_joined: string;
}

interface BranchListResponse {
  results?: ApiUser[];
  message?: string;
}

export default function BranchListPage() {
  const router = useRouter();
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: apiUsersData, isLoading, error } = useApiGet<BranchListResponse>(
    "branches",
    USERS.getBranchList
  );

  // ✅ بررسی اینکه results آرایه باشد
  const branches: Branch[] = Array.isArray(apiUsersData?.results)
    ? apiUsersData.results.map((user) => ({
        id: user.id.toString(),
        branchName: user.company_name,
        managerName: `${user.first_name} ${user.last_name}`,
        phoneNumber: user.phone.toString(),
        email: user.email,
        address: "-",
        isActive: user.status,
        description: "-",
        createdAt: user.date_joined,
      }))
    : [];

  // ✅ پیام خالی
  const emptyMessage: string | null =
    !Array.isArray(apiUsersData?.results) && typeof apiUsersData?.message === "string"
      ? apiUsersData.message
      : null;

  const deleteBranchMutation = useApiDeleteDynamic<void>();

  const handleView = (branch: Branch) => router.push(`/branch/${branch.id}/details`);
  const handleEdit = (branch: Branch) => router.push(`/branch/${branch.id}/edit`);
  const handleDelete = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedBranch) return;

    deleteBranchMutation.mutate(USERS.delete(Number(selectedBranch.id)), {
      onSuccess: (res: any) => {
        toast.success(res?.message || "شعبه با موفقیت حذف شد");
        setIsModalOpen(false);
      },
      onError: (err: ApiError) => {
        const message =
          err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          "خطا در حذف شعبه";
        toast.error(message);
        setIsModalOpen(false);
      },
    });
  };

  return (
    <div className="w-full">
      <PageHeader
        title="مدیریت شعبات"
        description="لیست تمام شعبات ثبت شده در سیستم"
        showHomeIcon
      />

      {isLoading ? (
        <div className="flex w-full h-[300px] items-center justify-center">
          <ContentLoader />
        </div>
      ) : error ? (
        <p className="text-center text-red-500 mt-6">{error.message}</p>
      ) : emptyMessage ? (
        <EmptyData title={emptyMessage} />
      ) : (
        <BranchTable
          branches={branches}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        isLoading={deleteBranchMutation.isPending}
        itemName={selectedBranch?.branchName}
        title="حذف شعبه"
        message="آیا از حذف این شعبه مطمئن هستید؟ این عمل غیرقابل بازگشت است."
      />
    </div>
  );
}
