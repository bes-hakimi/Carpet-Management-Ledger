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
import { ContentLoader } from "@/components/loading/DataLoading";
import { EmptyData } from "@/components/empty/EmptyData";

interface Staff {
  id: string;
  name: string;
  category: string;
  owner: string;
  status: "active" | "inactive";
  createdAt: string;
}

interface ApiStaff {
  id: number;
  company_name: string;
  category: string;
  first_name: string;
  last_name: string;
  status: boolean;
  date_joined: string;
}

interface StaffListResponse {
  results?: ApiStaff[];
  message?: string;
}

export default function StaffListPage() {
  const router = useRouter();

  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: apiStaffData, isLoading, error, refetch } = useApiGet<StaffListResponse>(
    "staff-list",
    USERS.getStaffList
  );

  // ✅ بررسی نوع داده و map امن
  const staffList: Staff[] = Array.isArray(apiStaffData?.results)
    ? apiStaffData.results.map((item) => ({
        id: item.id.toString(),
        name: item.company_name,
        category: item.category,
        owner: `${item.first_name} ${item.last_name}`,
        status: item.status ? "active" : "inactive",
        createdAt: item.date_joined,
      }))
    : [];

  const emptyMessage: string | null =
    !Array.isArray(apiStaffData?.results) && typeof apiStaffData?.message === "string"
      ? apiStaffData.message
      : null;

  const handleView = (staff: Staff) => router.push(`/staff/${staff.id}/details`);
  const handleEdit = (staff: Staff) => router.push(`/staff/${staff.id}/edit`);

  const handleDeleteClick = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedStaff) return;

    deleteStaffMutation.mutate(USERS.delete(Number(selectedStaff.id)), {
      onSuccess: () => {
        toast.success("کارمند با موفقیت حذف شد");
        setIsModalOpen(false);
        setSelectedStaff(null);
        refetch();
      },
      onError: (error: ApiError) => {
        console.error(error);
        toast.error(error.message || "حذف کارمند با مشکل مواجه شد");
      },
    });
  };

  const handleCloseModal = () => {
    if (deleteStaffMutation.status !== "pending") {
      setIsModalOpen(false);
      setSelectedStaff(null);
    }
  };

  const deleteStaffMutation = useApiDeleteDynamic<void>();

  return (
    <div className="w-full">
      <PageHeader
        title="مدیریت کارمندان"
        description="لیست تمام کارمندان ثبت‌شده در سیستم"
        showHomeIcon
      />

      {isLoading ? (
        <div className="flex w-full h-[300px] items-center justify-center">
          <ContentLoader />
        </div>
      ) : error ? (
        <p className="text-center text-red-500 mt-6">
          خطا در دریافت داده‌ها: {error.message}
        </p>
      ) : emptyMessage ? (
        <EmptyData title={emptyMessage} />
      ) : (
        <StaffTable
          companies={staffList}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        itemName={selectedStaff?.name}
        confirmText="حذف"
        cancelText="لغو"
        isLoading={deleteStaffMutation.status === "pending"}
        type="danger"
      />
    </div>
  );
}
