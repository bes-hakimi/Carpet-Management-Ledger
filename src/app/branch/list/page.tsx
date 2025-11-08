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
import { IUser } from "@/types/user/user";

type ApiResponse = { results?: IUser[]; message?: string } | IUser[];

function isIUserArray(data: unknown): data is IUser[] {
  return Array.isArray(data) && data.every((item) => typeof item === "object" && "id" in item);
}

function isApiResponseObject(data: unknown): data is { results?: IUser[]; message?: string } {
  return typeof data === "object" && data !== null && ("results" in data || "message" in data);
}

export default function BranchListPage() {
  const router = useRouter();
  const [selectedBranch, setSelectedBranch] = useState<IUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: apiData, isLoading, error, refetch } = useApiGet<ApiResponse>(
    "branches",
    USERS.getBranchList
  );

  const deleteBranchMutation = useApiDeleteDynamic<{ message?: string }>();

  // ✅ تعیین لیست کاربران با تایپ دقیق
  const branches: IUser[] = isIUserArray(apiData)
    ? apiData
    : isApiResponseObject(apiData) && Array.isArray(apiData.results)
    ? apiData.results
    : [];

  const emptyMessage: string | null =
    branches.length === 0
      ? isApiResponseObject(apiData)
        ? apiData.message || "هیچ شعبه‌ای یافت نشد."
        : "هیچ شعبه‌ای یافت نشد."
      : null;

  const handleView = (branch: IUser) => router.push(`/branch/${branch.id}/details`);
  const handleEdit = (branch: IUser) => router.push(`/branch/${branch.id}/edit`);
  const handleDelete = (branch: IUser) => {
    setSelectedBranch(branch);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedBranch?.id) return;

    deleteBranchMutation.mutate(USERS.delete(selectedBranch.id), {
      onSuccess: (res) => {
        toast.success(res?.message || "شعبه با موفقیت حذف شد");
        setIsModalOpen(false);
        setSelectedBranch(null);
        refetch();
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

  const handleCloseModal = () => {
    if (!deleteBranchMutation.isPending) {
      setIsModalOpen(false);
      setSelectedBranch(null);
    }
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
        <p className="text-center text-red-500 mt-6">{(error as ApiError)?.message || "خطا در دریافت داده‌ها"}</p>
      ) : emptyMessage ? (
        <EmptyData title={emptyMessage} />
      ) : (
        <BranchTable
          branches={branches} // BranchTable از IUser تایپ دریافت می‌کند
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={confirmDelete}
        isLoading={deleteBranchMutation.isPending}
        itemName={selectedBranch?.branch_name || selectedBranch?.company_name || "—"}
        title="حذف شعبه"
        message="آیا از حذف این شعبه مطمئن هستید؟ این عمل غیرقابل بازگشت است."
      />
    </div>
  );
}
